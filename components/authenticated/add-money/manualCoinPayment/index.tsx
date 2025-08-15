"use client";

import React, { useCallback, useEffect, useState } from "react";
import WalletCard from "./WalletCard";
import useTheme from "@/components/hooks/useTheme";
import Button from "@/components/Button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ManualCoinPaymentProps {
  setSelectedDepositType: (
    depositType:
      | "automatic-coin-payment"
      | "manual-coin-payment"
      | "bank-transfer"
      | ""
  ) => void;

  setCoinName: (coinName: string) => void;

  amount: number;
  linkedTransaction: string;
  coinName: string;

  selectedDepositType:
    | "automatic-coin-payment"
    | "manual-coin-payment"
    | "bank-transfer";
}

const ManualCoinPayment = (props: ManualCoinPaymentProps) => {
  const router = useRouter();
  const {
    setSelectedDepositType,
    amount,
    linkedTransaction,
    selectedDepositType,
    setCoinName,
    coinName,
  } = props;
  const { mode } = useTheme();
  const [selectedWallet, setSelectedWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [coins, setCoins] = useState<CoinProps[]>([]);

  const addMoneyHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/add-money/manual-coin-payment", {
        amount,
        linkedTransaction,
        type: selectedDepositType,
        walletAddress: selectedWallet,
        coinName,
      });

      if (data.error) throw new Error(data.error);
      const { _id: transactionId }: TransactionProps = data;
      router.push(`/transaction-info/${transactionId}`);
    } catch (error: any) {
      toast.error(error.message, { duration: 10000 });
    } finally {
      setLoading(false);
    }
  };

  const getCoins = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/coin`);
      if (data.error) throw new Error(data.error);

      const enabledCoins: CoinProps[] = data.filter(
        (coin: CoinProps) => coin.allowed === "yes"
      );
      setCoins(enabledCoins);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCoins();
  }, [getCoins]);

  return (
    <div
      className={`flex flex-col items-center gap-5 
    ${mode === "light" ? "text-slate-700" : "text-white"}`}
    >
      <div>Select a Wallet address</div>

      <div className="flex flex-col gap-3 w-full">
        {coins.map((coin) => (
          <WalletCard
            key={coin._id}
            setSelectedWallet={setSelectedWallet}
            walletAddress={coin.walletAddress}
            label={coin.label}
            value={coin.value}
            selectedWallet={selectedWallet}
            amount={amount}
            setCoinName={setCoinName}
          />
        ))}
      </div>

      <div className="flex w-full sm:w-1/2 gap-5">
        <Button
          outline
          label={"Back"}
          onClick={() => setSelectedDepositType("")}
        />
        <Button
          loading={loading}
          disabled={selectedWallet === ""}
          label={"Continue"}
          onClick={addMoneyHandler}
        />
      </div>
    </div>
  );
};

export default ManualCoinPayment;
