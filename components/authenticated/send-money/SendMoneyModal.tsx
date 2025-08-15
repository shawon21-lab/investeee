"use client";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { IconType } from "react-icons";
import { AiFillDollarCircle } from "react-icons/ai";
import validator from "validator";

interface TopUpModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  icon?: IconType;
}

const SendMoneyModal = (props: TopUpModalProps) => {
  const { mode } = useTheme();
  const { opened, onClose, icon: Icon } = props;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    coinName: "",
    walletAddress: "",
  });

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;

  const sendMoneyHandler = async () => {
    try {
      setLoading(true);
      if (validator.isEmpty(paymentData.coinName))
        throw new Error("Coin Name Is Needed");

      if (validator.isEmpty(paymentData.walletAddress))
        throw new Error("Wallet Address Is Needed");

      const { data } = await axios.post("/api/send-money/external", {
        ...paymentData,
      });
      if (data.error) throw new Error(data.error);

      const transactionId = (data as { _id: string })._id;
      router.push(`/transaction-info/${transactionId}`);
    } catch (error: any) {
      toast.error(error.message, { duration: 10000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer
      title={"Wallet Withdrawal"}
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-7">
        <div className="flex w-full justify-center">
          {Icon && <Icon color={primaryLightColor} size={24} />}
        </div>

        <TextInput
          value={paymentData.amount}
          onChange={(e) => {
            if (isNaN(Number(e.target.value))) return;
            setPaymentData({ ...paymentData, amount: e.target.value });
          }}
          placeholder="Enter amount to send"
          icon={AiFillDollarCircle}
        />

        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-1 w-full">
            <TextInput
              value={paymentData.coinName}
              onChange={(e) =>
                setPaymentData({ ...paymentData, coinName: e.target.value })
              }
              placeholder="Enter Coin Name. E.g BTC, USDT(trc20)"
            />

            <TextInput
              value={paymentData.walletAddress}
              onChange={(e) =>
                setPaymentData({
                  ...paymentData,
                  walletAddress: e.target.value,
                })
              }
              placeholder="Enter Wallet Address"
            />
          </div>
        </div>

        <Button loading={loading} onClick={sendMoneyHandler} label="Send" />
      </div>
    </ModalContainer>
  );
};

export default SendMoneyModal;
