"use client";
import React, { useCallback, useState } from "react";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { FaSearch } from "react-icons/fa";
import TransactionCard from "@/components/authenticated/home/spend/TransactionCard";
import useTheme from "@/components/hooks/useTheme";
import LoanModal from "@/components/authenticated/home/loan/LoanModal";
import { AiOutlineInbox } from "react-icons/ai";
import formatNumber from "@/constants/formatNumber";
import useCompany from "@/components/hooks/useCompany";
import { useRouter } from "next/navigation";

interface LoanProps {
  user: userSchemaType;
  transactions: TransactionProps[];
}

const Loan = (props: LoanProps) => {
  const { user, transactions } = props;
  const { mode } = useTheme();
  const [getLoanModal, setGetLoanModal] = useState(false);

  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [displayTransaction, setDisplayTransaction] = useState(transactions);

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;

  const currency = company?.currency.symbol;

  const searchInputChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const enteredText = e.target.value;
      setSearchInput(enteredText);
      const copyTransactions = transactions.slice(0);
      const filteredTransactions = copyTransactions.filter(
        (item) =>
          item.title.toLowerCase().includes(enteredText.toLowerCase()) ||
          item.status.toLowerCase().includes(enteredText.toLowerCase())
      );
      setDisplayTransaction(filteredTransactions);
    },
    [transactions]
  );

  if (company?.loan.status === "off") {
    router.back();
    return (
      <div
        className={`font-bold text-3xl sm:text-4xl flex justify-center w-full
  ${mode === "light" ? "text-slate-700" : "text-white"}`}
      >
        Loan Currently Not Available
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-center gap-2 justify-between px-3">
        <div className="flex flex-col gap-1 w-full">
          <div
            className={`text-xs font-medium 
          ${mode === "light" ? "text-slate-700" : "text-white"}`}
          >
            You Owe
          </div>

          <div
            className={`font-bold text-3xl sm:text-4xl 
          ${mode === "light" ? "text-slate-700" : "text-white"}`}
          >
            {currency}
            {formatNumber(user.loanBalance)}
          </div>
        </div>

        <Button onClick={() => setGetLoanModal(true)} label={"Get a Loan"} />
      </div>

      <TextInput
        value={searchInput}
        onChange={searchInputChangeHandler}
        icon={FaSearch}
        placeholder="Search Transaction"
      />

      <div className="flex flex-col w-full">
        {displayTransaction.length > 0 &&
          displayTransaction.map((item) => (
            <TransactionCard
              key={item._id}
              id={item._id}
              title={item.title}
              createdAt={item.createdAt}
              status={item.status}
              category={item.category}
              amount={item.amount}
              senderName={item.senderName}
            />
          ))}

        {displayTransaction.length <= 0 && (
          <div className="flex justify-center flex-col items-center">
            <AiOutlineInbox color={primaryLightColor} size={100} />
            <div
              className={`font-semibold text-lg
              ${mode === "light" ? "text-slate-700" : "text-white"}`}
            >
              No Availaible transactions
            </div>
          </div>
        )}
      </div>

      <LoanModal opened={getLoanModal} onClose={() => setGetLoanModal(false)} />
    </div>
  );
};

export default Loan;
