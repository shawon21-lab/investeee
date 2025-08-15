import Button from "@/components/Button";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface DeleteCoinModalProps {
  opened: boolean;
  onClose: () => void;
  coinId: string;
}

const DeleteCoinModal = (props: DeleteCoinModalProps) => {
  const { opened, onClose, coinId } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const deleteCoinHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(`/api/coin/${coinId}`);
      if (res.data.error) throw new Error(res.data.error);
      onClose();
      router.push("/admin/settings/coins");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer title="Delete Coin" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div>Are you sure you want to delete this Coin?</div>

        <div className="flex justify-between gap-3">
          <Button loading={loading} label="Yes" onClick={deleteCoinHandler} />
          <Button label="Cancel" onClick={onClose} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default DeleteCoinModal;
