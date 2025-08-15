import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface RejectDepositProps {
  opened: boolean;
  onClose: () => void;
  transaction: TransactionProps;
}

const RejectTransactionModal = (props: RejectDepositProps) => {
  const { opened, onClose, transaction } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    setNoteInput(transaction.note || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handler = async () => {
    const postData = { transactionId: transaction._id, note: noteInput };
    try {
      setLoading(true);
      const { data } = await axios.post(
        `/api/admin/transactions/reject`,
        postData
      );
      if (data.error) throw new Error(data.error);
      toast.success(`${transaction.title} rejected`);
      router.refresh();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer
      title={`Reject ${transaction.title}`}
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div>Are you sure you want to reject this transaction?</div>
        <TextInput
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Notes"
        />
        <div className="flex gap-3">
          <Button outline loading={loading} label="Yes" onClick={handler} />
          <Button label="No" onClick={onClose} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default RejectTransactionModal;
