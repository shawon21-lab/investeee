"use client";
import Button from "@/components/Button";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import formatDate from "@/constants/formatDate";
import { useRouter } from "next/navigation";
import React from "react";
import { FaMoneyCheckAlt } from "react-icons/fa";

interface PlanCardProps {
  planName: string;
  minAmount: number;
  maxAmount: number;
  ROIDaily: number;
  totalROI: number;
  duration: number;
  referralBonus: number;
  createdAt: Date;
  id: string;
}

const PlanCard = (props: PlanCardProps) => {
  const { mode } = useTheme();
  const {
    planName,
    minAmount,
    maxAmount,
    ROIDaily,
    totalROI,
    duration,
    createdAt,
    referralBonus,
    id,
  } = props;
  const router = useRouter();
  const date = new Date(`${createdAt}`);

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;
  const currency = company?.currency.symbol;

  return (
    <div
      className={`max-w-[250px] w-[90%] min-h-[300px] 
    shadow-md rounded-md p-5 
    transition-all duration-300 hover:scale-105 
    hover:shadow-lg flex flex-col items-center 
    gap-4 justify-between
    ${
      mode === "light"
        ? "shadow-[#d9d9d9] hover:shadow-[#c1c1c1]"
        : "shadow-[#5d5d5d] hover:shadow-[#7b7b7b]"
    }`}
    >
      <div>
        <FaMoneyCheckAlt color={primaryLightColor} size={24} />
      </div>

      <div className="flex flex-col gap-1.5 items-center text-center w-full">
        <div className="flex justify-start items-center gap-1 w-full">
          <div className="text-sm">Name:</div>
          <div className="font-bold">{planName}</div>
        </div>

        <div className="flex justify-start items-center gap-1 w-full">
          <div className="text-sm">Mini Deposit:</div>
          <div className="font-bold">
            {currency}
            {minAmount}
          </div>
        </div>

        <div className="flex justify-start items-center gap-1 w-full">
          <div className="text-sm">Max Deposit:</div>
          <div className="font-bold">
            {currency}
            {maxAmount}
          </div>
        </div>

        <div className="flex justify-start items-center gap-1 w-full">
          <div className="text-sm">Referral Bonus:</div>
          <div className="font-bold">
            {referralBonus === 0 || !referralBonus
              ? "No Bonus"
              : `${referralBonus}%`}
          </div>
        </div>

        <div className="flex justify-start items-center gap-1 w-full">
          <div className="text-sm">Total ROI:</div>
          <div className="font-bold">{totalROI}%</div>
        </div>

        <div className="flex justify-start items-center gap-1 w-full">
          <div className="text-sm">ROI Daily:</div>
          <div className="font-bold">{ROIDaily}%</div>
        </div>

        <div className="flex justify-start items-center gap-1 w-full">
          <div className="text-sm">Duration (days):</div>
          <div className="font-bold">{duration}</div>
        </div>

        <div className="flex justify-start items-center gap-1 w-full">
          <div className="text-sm">Created At:</div>
          <div className="font-bold">{formatDate(date)}</div>
        </div>
      </div>

      <Button
        onClick={() => router.push(`/admin/settings/plans/${id}`)}
        label={"View Details"}
      />
    </div>
  );
};

export default PlanCard;
