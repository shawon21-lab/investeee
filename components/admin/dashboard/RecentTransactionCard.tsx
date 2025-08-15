"use client";
import Button from "@/components/Button";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { Avatar } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";
import { IoMdPerson } from "react-icons/io";
import { MdSwapHoriz } from "react-icons/md";

interface CardProps {
  transactions?: TransactionProps[];
}

const RecentTransactionCard = (props: CardProps) => {
  const { mode } = useTheme();
  const { transactions } = props;
  const router = useRouter();

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;
  const primaryVeryLightColor = company?.color.primaryVeryLight;
  const currency = company?.currency.symbol;

  return (
    <div
      className={`sm:max-w-[420px] w-[90%] h-[350px] 
    shadow-md rounded-md p-5 
    transition-all duration-300 hover:scale-105 
    hover:shadow-lg flex flex-col 
    gap-4
    ${
      mode === "light"
        ? "shadow-[#d9d9d9] hover:shadow-[#c1c1c1]"
        : "shadow-[#5d5d5d] hover:shadow-[#7b7b7b]"
    }`}
    >
      <div className="text-lg font-semibold">Recent Transactions</div>

      <div className={`flex flex-col gap-3 overflow-auto`}>
        {transactions?.map((item) => (
          <div
            key={item._id}
            style={{ borderColor: primaryVeryLightColor }}
            className="flex justify-between px-1.5 py-2.5 
          rounded-md border-[.5px] items-center overflow-auto 
          gap-3 flex-shrink-0"
          >
            <div>
              <Avatar color="red" alt="its me" size="lg" radius="xl">
                <MdSwapHoriz color={primaryLightColor} />
              </Avatar>
            </div>

            <div className="flex flex-col">
              <div className="text-sm font-semibold whitespace-nowrap">
                {item.title}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex-shrink-0 font-bold text-lg">
                {currency}
                {item.amount}
              </div>
              <div className="text-xs flex-shrink-0">{item.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactionCard;
