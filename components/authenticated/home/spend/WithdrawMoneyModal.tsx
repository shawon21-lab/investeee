"use client";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import useTheme from "@/components/hooks/useTheme";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillDollarCircle } from "react-icons/ai";

interface TopUpModalProps {
  opened: boolean;
  onClose: () => void;
  user: userSchemaType;
}

const SendMoneyModal = (props: TopUpModalProps) => {
  const { mode } = useTheme();
  const { opened, onClose } = props;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    receiverName: "",
    receiverEmail: "",
    receiverPhoneNumber: "",
    receiverAccountNumber: "",
    receiverPaymentUsername: "",
  });

  const sendMoneyHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/send-money/external", {
        ...paymentData,
        amount: Number(paymentData.amount),
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
    <ModalContainer title="Withdraw Money" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-7">
        <div className="flex w-full justify-center">
          <Image
            className="w-[auto] h-[auto]"
            width={40}
            height={40}
            alt="logo"
            src={"/logo-icon.png"}
          />
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
              value={paymentData.receiverName}
              onChange={(e) =>
                setPaymentData({ ...paymentData, receiverName: e.target.value })
              }
              placeholder="Enter Receiver's Name if needed"
            />

            <TextInput
              value={paymentData.receiverEmail}
              onChange={(e) =>
                setPaymentData({
                  ...paymentData,
                  receiverEmail: e.target.value,
                })
              }
              placeholder="Enter Receiver's Email if needed"
            />

            <TextInput
              value={paymentData.receiverPhoneNumber}
              onChange={(e) =>
                setPaymentData({
                  ...paymentData,
                  receiverPhoneNumber: e.target.value,
                })
              }
              placeholder="Enter Receiver's Phone Number if needed"
            />

            <TextInput
              value={paymentData.receiverAccountNumber}
              onChange={(e) =>
                setPaymentData({
                  ...paymentData,
                  receiverAccountNumber: e.target.value,
                })
              }
              placeholder="Enter Receiver's Account Number if needed"
            />
          </div>
        </div>

        <Button loading={loading} onClick={sendMoneyHandler} label="Send" />
      </div>
    </ModalContainer>
  );
};

export default SendMoneyModal;
