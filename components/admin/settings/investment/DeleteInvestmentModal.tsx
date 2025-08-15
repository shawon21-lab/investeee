import Button from "@/components/Button";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface DeleteInvestmentModalProps {
  opened: boolean;
  onClose: () => void;
  investmentId: string;
}

const DeleteInvestmentModal = (props: DeleteInvestmentModalProps) => {
  const { opened, onClose, investmentId } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const deleteInvestmentHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(`/api/admin/investment/${investmentId}`);
      if (res.data.error) throw new Error(res.data.error);
      onClose();
      router.push("/admin/settings/investments");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer title="Delete Investment" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div>Are you sure you want to delete this Investment?</div>

        <div className="flex justify-between gap-3">
          <Button
            loading={loading}
            label="Yes"
            onClick={deleteInvestmentHandler}
          />
          <Button label="Cancel" onClick={onClose} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default DeleteInvestmentModal;
