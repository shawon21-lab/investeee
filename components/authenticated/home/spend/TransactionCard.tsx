"use client";
import "animate.css";
import useTheme from "@/components/hooks/useTheme";
import { useRouter } from "next/navigation";
import React from "react";
import { FaMoneyBillAlt, FaAngleRight } from "react-icons/fa";
import formatNumber from "@/constants/formatNumber";
import formatDate from "@/constants/formatDate";
import useCompany from "@/components/hooks/useCompany";

interface TransactionCardProps {
  title: string;
  amount: number | string;
  createdAt?: Date;
  senderName?: string;
  id?: string;

  status:
    | "successful"
    | "pending"
    | "processing"
    | "action-needed"
    | "rejected";

  category:
    | "money-received"
    | "transfer"
    | "deposit"
    | "loan"
    | "investment-topup"
    | "investment-withdrawal";
}

const TransactionCard = (props: TransactionCardProps) => {
  const { mode } = useTheme();
  const { push } = useRouter();
  const { title, amount, status, category, createdAt, senderName, id } = props;
  const date = createdAt && new Date(createdAt);
  const formattedDate = formatDate(date);

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;

  const currency = company?.currency.symbol;

  return (
    <div
      onClick={() => push(`/transaction-info/${id}`)}
      className={`flex items-center justify-between 
    hover:shadow-lg shadow-md py-4 
    px-3 rounded-lg cursor-pointer  
    gap-3 active:scale-95 transition duration-300
    ${mode === "light" ? "" : ""} 
    ${status === "action-needed" && "animate-bounce"}`}
    >
      <div className="flex items-center gap-4">
        <FaMoneyBillAlt
          color={mode === "light" ? primaryColor : primaryLightColor}
          size={24}
        />

        <div>
          <div
            className={`font-semibold
            ${mode === "light" ? "text-gray-500" : "text-white"}`}
          >
            {title}
          </div>
          <div className={`font-semibold text-sm text-gray-300`}>
            {`${formattedDate} . ${
              category === "money-received" ? senderName : ""
            }`}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`font-bold flex flex-col items-end
        ${mode === "light" ? "text-slate-700" : "text-white"}`}
        >
          <div>
            {currency}
            {formatNumber(+amount)}
          </div>
          <div
            className={`font-normal italic text-sm 
          ${status === "pending" && "text-[#2196f3]"} 
          ${status === "successful" && "text-[#00c853]"} 
          ${status === "processing" && "text-[#ff9800]"} 
          ${status === "action-needed" && "text-rose-400"} 
          ${status === "rejected" && "text-[#f44336]"}`}
          >
            {status === "pending" && "Pending..."}
            {status === "successful" && "Successful"}
            {status === "processing" && "Processing..."}
            {status === "action-needed" && "Action Needed"}
            {status === "rejected" && "Rejected"}
          </div>
        </div>

        <FaAngleRight
          color={mode === "light" ? primaryColor : primaryLightColor}
          size={24}
        />
      </div>
    </div>
  );
};

export default TransactionCard;
