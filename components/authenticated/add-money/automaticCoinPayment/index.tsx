"use client";

import React, { useCallback, useEffect, useState } from "react";
import WalletCard from "../automaticCoinPayment/WalletCard";
import useTheme from "@/components/hooks/useTheme";
import Button from "@/components/Button";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import useCompany from "@/components/hooks/useCompany";
import { useSession } from "next-auth/react";

interface AutomaticCoinPaymentProps {
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

const AutomaticCoinPayment = (props: AutomaticCoinPaymentProps) => {
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
  const { company } = useCompany();
  const { data: session } = useSession();
  const userId = (session?.user as { id: string })?.id;

  const nowPaymentData = {
    price_amount: amount,
    price_currency: company?.currency.code.toLowerCase(),
    pay_currency: coinName,
    ipn_callback_url: company?.baseUrl,
    order_id: userId,
    order_description: `Automatic coin payment deposit of ${amount}`,
    is_fixed_rate: true,
    is_fee_paid_by_user: false,
  };

  const addMoneyHandler = async () => {
    try {
      setLoading(true);
      if (!company) throw new Error("Company Info not set");
      if (amount < company.desposit.minimum)
        throw new Error(
          `You cannot deposit less than ${company.currency.symbol}${company.desposit.minimum}`
        );
      if (amount > company?.desposit?.maximum)
        throw new Error(
          `You cannot deposit greater than ${company.currency.symbol}${company.desposit.maximum}`
        );

      const { data: nowPaymentResult } = await axios.post(
        `https://api.nowpayments.io/v1/payment`,
        nowPaymentData,
        {
          headers: { "x-api-key": company?.nowPaymentApi },
        }
      );
      if (nowPaymentResult.message) throw new Error(nowPaymentResult.message);

      const { data } = await axios.post(
        "/api/add-money/automatic-coin-payment",
        {
          amount,
          linkedTransaction,
          type: selectedDepositType,
          coinName,
          nowPaymentResult,
        }
      );

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

export default AutomaticCoinPayment;
