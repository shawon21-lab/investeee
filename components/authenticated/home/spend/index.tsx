"use client";
import React, { useCallback, useEffect, useState } from "react";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import { FaSearch } from "react-icons/fa";
import TransactionCard from "@/components/authenticated/home/spend/TransactionCard";
import useTheme from "@/components/hooks/useTheme";
import { useRouter } from "next/navigation";
import { AiOutlineInbox } from "react-icons/ai";
import formatNumber from "@/constants/formatNumber";
import useCompany from "@/components/hooks/useCompany";

interface SpendProps {
  user: userSchemaType;
  transactions: TransactionProps[];
  pendingBalance: number;
}

const Spend = (props: SpendProps) => {
  const { user, transactions, pendingBalance } = props;
  const { mode } = useTheme();
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

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex items-center justify-between px-3 flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <div
            className={`text-xs font-medium 
          ${mode === "light" ? "text-slate-700" : "text-white"}`}
          >
            Account Balance
          </div>

          <div
            className={`font-bold text-3xl sm:text-4xl 
          ${mode === "light" ? "text-slate-700" : "text-white"}`}
          >
            {currency}
            {formatNumber(user.accountBalance)}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div
            className={`text-xs font-medium 
          ${mode === "light" ? "text-slate-700" : "text-white"}`}
          >
            Pending Balance
          </div>

          <div
            style={{ color: primaryLightColor }}
            className="font-bold text-3xl sm:text-4xl"
          >
            {currency}
            {formatNumber(pendingBalance)}
          </div>
        </div>
      </div>

      <div className="flex gap-3 w-full items-center ">
        <Button onClick={() => router.push("/add-money")} label={"Add Money"} />
        <Button
          outline
          onClick={() => router.push("/send-money")}
          label={"Withdraw Money"}
        />
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
    </div>
  );
};

export default Spend;
