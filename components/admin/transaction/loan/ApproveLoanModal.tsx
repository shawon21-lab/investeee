import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface ApproveLoanProps {
  opened: boolean;
  onClose: () => void;
  transaction: TransactionProps;
}

const ApproveLoanModal = (props: ApproveLoanProps) => {
  const { opened, onClose, transaction } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `/api/admin/transactions/loan/approve/${transaction._id}`
      );
      if (data.error) throw new Error(data.error);
      toast.success(`${transaction.title} Approved`);
      onClose();
      location.reload();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer
      title={`Approve ${transaction.title}`}
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div>Do you want to approve this {transaction.title} transaction?</div>
        <div className="flex gap-3">
          <Button outline loading={loading} label="Yes" onClick={handler} />
          <Button label="No" onClick={onClose} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default ApproveLoanModal;
