import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { Select } from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface AddNewCoinModalProps {
  opened: boolean;
  onClose: () => void;
  getCoins: () => void;
}

const AddNewCoinModal = (props: AddNewCoinModalProps) => {
  const { opened, onClose, getCoins } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    label: "",
    value: "",
    walletAddress: "",
    allowed: "",
  });

  const addCoinHandler = async () => {
    try {
      setLoading(true);
      if (data.allowed === "")
        throw new Error("Select either yes or no for the enabled value");

      const res = await axios.post("/api/coin", data);
      if (res.data.error) throw new Error(res.data.error);
      onClose();
      getCoins();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer title="Add new coin" opened={opened} onClose={onClose}>
      <div className="flex flex-col justify-between gap-3 min-h-[400px]">
        <Select
          value={data.label}
          onChange={(e) => setData({ ...data, label: e || "" })}
          placeholder="Label (Bitcoin)"
          data={[
            { value: "Bitcoin (BTC)", label: "Bitcoin (BTC)" },
            { value: "USDT (TRC20)", label: "USDT (TRC20)" },
            { value: "Litcoin (LTC)", label: "Litcoin (LTC)" },
            { value: "Ripple (XRP)", label: "Ripple (XRP)" },
            { value: "Ethereum (ETH)", label: "Ethereum (ETH)" },
            { value: "Cardano (ADA)", label: "Cardano (ADA)" },
          ]}
        />

        <Select
          value={data.value}
          onChange={(e) => setData({ ...data, value: e || "" })}
          placeholder="Value (btc)"
          data={[
            { value: "btc", label: "btc" },
            { value: "usdttrc20", label: "usdttrc20" },
            { value: "ltc", label: "ltc" },
            { value: "xrp", label: "xrp" },
            { value: "eth", label: "eth" },
            { value: "ada", label: "ada" },
          ]}
        />

        <TextInput
          value={data.walletAddress}
          onChange={(e) => setData({ ...data, walletAddress: e.target.value })}
          placeholder="Wallet address"
        />

        <Select
          value={data.allowed}
          onChange={(e) => setData({ ...data, allowed: e || "" })}
          placeholder="Enable (Yes or No)"
          data={[
            { value: "yes", label: "YES" },
            { value: "no", label: "NO" },
          ]}
        />

        <Button loading={loading} label="Add" onClick={addCoinHandler} />
      </div>
    </ModalContainer>
  );
};

export default AddNewCoinModal;
