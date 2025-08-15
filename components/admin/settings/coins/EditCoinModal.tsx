import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { Select } from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface EditCoinModalProps {
  opened: boolean;
  onClose: () => void;
  getCoin: () => void;
  coinId: string;
  currentWallet: string;
  currentAllowed: string;
}

const EditCoinModal = (props: EditCoinModalProps) => {
  const { opened, onClose, coinId, currentWallet, currentAllowed, getCoin } =
    props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    walletAddress: currentWallet,
    allowed: currentAllowed,
  });

  const editCoinHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(`/api/coin/${coinId}`, data);
      if (res.data.error) throw new Error(res.data.error);
      onClose();
      getCoin();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer title="Add new coin" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-3 min-h-[200px]">
        <div className="w-full flex flex-col gap-1">
          <div>Wallet Address</div>
          <TextInput
            value={data.walletAddress}
            onChange={(e) =>
              setData({ ...data, walletAddress: e.target.value })
            }
            placeholder="Wallet address"
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <div>Enable Coin</div>
          <Select
            value={data.allowed}
            onChange={(e) => setData({ ...data, allowed: e || "" })}
            placeholder="Enable (Yes or No)"
            data={[
              { value: "yes", label: "YES" },
              { value: "no", label: "NO" },
            ]}
          />
        </div>

        <Button loading={loading} label="Update" onClick={editCoinHandler} />
      </div>
    </ModalContainer>
  );
};

export default EditCoinModal;
