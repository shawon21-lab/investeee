"use client";
import useTheme from "@/components/hooks/useTheme";
import formatDate from "@/constants/formatDate";
import formatNumber from "@/constants/formatNumber";
import { Radio } from "@mantine/core";
import React, { useState } from "react";

interface PendingTransactionProp {
  setLinkedTransaction: (transactionId: string) => void;
  linkedTransaction: string;
  title: string;
  createdAt?: Date;
  status: string;
  transactionId: string;
  amount: number;
}

const PendingTransaction = (props: PendingTransactionProp) => {
  const {
    setLinkedTransaction,
    linkedTransaction,
    title,
    transactionId,
    createdAt,
    status,
    amount,
  } = props;
  const { mode } = useTheme();
  const date = createdAt && new Date(createdAt);

  return (
    <div
      onClick={() => setLinkedTransaction(transactionId)}
      className={`flex items-center justify-between 
    hover:shadow-lg shadow-md py-4 
    px-3 rounded-lg cursor-pointer 
    gap-3 w-full active:scale-95 transition duration-200
    ${mode === "light" ? "shadow-gray-200" : "shadow-[#1d1d1d]"}`}
    >
      <div className="flex items-center gap-4">
        <Radio
          checked={linkedTransaction === transactionId}
          onChange={() => setLinkedTransaction(transactionId)}
        />

        <div>
          <div
            className={`font-semibold
            ${mode === "light" ? "text-gray-500" : "text-white"}`}
          >
            {title}
          </div>
          <div className={`font-semibold text-sm text-gray-300`}>
            {formatDate(date)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`font-bold flex flex-col items-end
        ${mode === "light" ? "text-slate-700" : "text-white"}`}
        >
          <div>${formatNumber(amount)}</div>
          <div className="font-normal text-sm text-yellow-400">{status}</div>
        </div>
      </div>
    </div>
  );
};

export default PendingTransaction;
