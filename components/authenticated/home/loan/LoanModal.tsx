"use client";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import ModalContainer from "@/components/modals/ModalContainer";
import { Select } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface TopUpModalProps {
  opened: boolean;
  onClose: () => void;
}

const LoanModal = (props: TopUpModalProps) => {
  const { mode } = useTheme();
  const [amountInput, setAmountInput] = useState("");
  const router = useRouter();

  const { opened, onClose } = props;
  const [loading, setLoading] = useState(false);

  const { company } = useCompany();

  const [reasonValue, setReasonValue] = useState<string | null>(null);
  const loanReasons = [
    { value: "personal-expenses", label: "Personal Expenses" },
    { value: "debt-consolidation", label: "Debt Consolidation" },
    { value: "emergency-situations", label: "Emergency Situations" },
    { value: "education", label: "Education/Student loan" },
  ];

  const [durationValue, setDurationValue] = useState<string | null>(null);
  const loanDurations = [
    { value: "one-month", label: "1 Month - 2% Interest" },
    { value: "two-months", label: "2 Months - 5% Interest" },
    { value: "three-months", label: "3 Months - 9% Interest" },
    { value: "six-months", label: "6 Months - 14% Interest" },
    { value: "one-year", label: "1 Year - 25% Interest" },
  ];

  const inputInvalid =
    amountInput.trim() === "" ||
    Number(amountInput) <= 0 ||
    !durationValue ||
    !reasonValue;

  const requestLoanHanlder = async () => {
    try {
      if (inputInvalid)
        throw new Error(
          "Make Sure you have filled all the necessary input fields"
        );

      if (Number(amountInput) < Number(company?.loan.minimum))
        throw new Error(
          `Minimum amount to Request is $${company?.loan.minimum}`
        );
      if (Number(amountInput) > Number(company?.loan.maximum))
        throw new Error(
          `Maximum amount to Request is $${company?.loan.maximum}`
        );

      setLoading(true);
      const { data } = await axios.post("/api/loan/request", {
        amount: Number(amountInput),
        loanDuration: durationValue,
        loanReason: reasonValue,
      });
      if (data.error) throw new Error(data.error);
      const transactionId = (data as { _id: string })._id;
      router.push(`/transaction-info/${transactionId}`);
    } catch (error: any) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer title="Get a loan" opened={opened} onClose={onClose}>
      <div className="h-fit min-h-[450px] flex flex-col justify-between">
        <div className="flex flex-col gap-5">
          <TextInput
            value={amountInput}
            onChange={(e) => {
              if (isNaN(Number(e.target.value))) return;
              setAmountInput(e.target.value);
            }}
            placeholder="How much do you want?"
          />

          <Select
            disabled={false}
            placeholder="Select one"
            label="Reason for getting a loan"
            value={reasonValue}
            onChange={setReasonValue}
            data={loanReasons}
            classNames={{
              input: "border-rose-300 focus:border-rose-500 h-[55px]",
              label: `${
                mode == "light" ? "text-slate-700" : "text-white"
              } text-base font-medium`,
            }}
          />

          <Select
            disabled={false}
            placeholder="Select one"
            label="How long will it take you to pay back"
            value={durationValue}
            onChange={setDurationValue}
            data={loanDurations}
            classNames={{
              input: "border-rose-300 focus:border-rose-500 h-[55px]",
              label: `${
                mode == "light" ? "text-slate-700" : "text-white"
              } text-base font-medium`,
            }}
          />
        </div>

        <Button
          loading={loading}
          onClick={requestLoanHanlder}
          label="Request Loan"
        />
      </div>
    </ModalContainer>
  );
};

export default LoanModal;
