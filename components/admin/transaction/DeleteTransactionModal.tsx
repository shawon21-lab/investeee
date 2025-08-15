import Button from "@/components/Button";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface DeleteTransactionProps {
  opened: boolean;
  onClose: () => void;
  transaction: TransactionProps;
}

const DeleteTransactionModal = (props: DeleteTransactionProps) => {
  const { opened, onClose, transaction } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `/api/admin/transactions/delete/${transaction._id}`
      );
      if (data.error) throw new Error(data.error);
      toast.success(`${transaction.title} Deleted`);
      router.push("/admin/transactions");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer
      title={`Delete ${transaction.title}`}
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div>Are you sure you want to delete this transaction.</div>
        <div className="flex gap-3">
          <Button outline loading={loading} label="Yes" onClick={handler} />
          <Button label="No" onClick={onClose} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default DeleteTransactionModal;
