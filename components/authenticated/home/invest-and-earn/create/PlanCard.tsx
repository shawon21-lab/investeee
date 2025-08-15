"use client";
import Button from "@/components/Button";
import useTheme from "@/components/hooks/useTheme";
import formatNumber from "@/constants/formatNumber";
import { Avatar } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoMdPerson } from "react-icons/io";
import PayModal from "./PayModal";
import useCompany from "@/components/hooks/useCompany";

interface PlanCardProps {
  name: string;
  maxAmount: number;
  minAmount: number;
  id: string;
  roiDaily: number;
  duration: number;
  totalRoi: number;
  referralBonus: number;
}

const PlanCard = (props: PlanCardProps) => {
  const { mode } = useTheme();
  const {
    name,
    maxAmount,
    minAmount,
    id,
    roiDaily,
    totalRoi,
    duration,
    referralBonus,
  } = props;
  const router = useRouter();
  const [payModal, setPayModal] = useState(false);
  const { company } = useCompany();
  const currency = company?.currency.symbol;
  const primary = company?.color.primary;
  const primaryLight = company?.color.primaryLight;

  return (
    <>
      <div
        className={`sm:max-w-[250px] w-full h-[450px] 
    shadow-md rounded-md p-5 
    transition-all duration-300 hover:scale-105 
    hover:shadow-lg flex flex-col items-start 
    gap-4 justify-between
    ${
      mode === "light"
        ? "shadow-[#d9d9d9] hover:shadow-[#c1c1c1]"
        : "shadow-[#5d5d5d] hover:shadow-[#7b7b7b]"
    }`}
      >
        <div
          style={{ color: mode === "light" ? primary : primaryLight }}
          className={`font-bold text-xl `}
        >
          {name}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="font-semibold text-sm">
            <div className="text-xs">Mini Deposit:</div>
            <div className="font-semibold text-xl">
              {currency}
              {formatNumber(minAmount)}
            </div>
          </div>

          <div className="font-semibold text-sm">
            <div className="text-xs">Max Deposit:</div>
            <div className="font-semibold text-xl">
              {currency}
              {formatNumber(maxAmount)}
            </div>
          </div>

          <div className="font-semibold text-sm">
            <div className="text-xs">Referral Bonus:</div>
            <div className="font-semibold text-xl">
              {referralBonus === 0 || !referralBonus
                ? "No Bonus"
                : `${referralBonus}%`}
            </div>
          </div>

          <div className="font-semibold text-sm">
            <div className="text-xs">Total ROI:</div>
            <div className="font-semibold text-xl">{totalRoi}%</div>
          </div>

          <div className="font-semibold text-sm">
            <div className="text-xs">ROI Daily:</div>
            <div className="font-semibold text-xl">{roiDaily}%</div>
          </div>

          <div className="font-semibold text-sm">
            <div className="text-xs">Duration:</div>
            <div className="font-semibold text-xl">{duration} (days)</div>
          </div>
        </div>

        <Button onClick={() => setPayModal(true)} label={"Select"} />
      </div>

      <PayModal
        opened={payModal}
        onClose={() => setPayModal(false)}
        planName={name}
        ROIDaily={roiDaily}
        totalROI={totalRoi}
        duration={duration}
        maxAmount={maxAmount}
        minAmount={minAmount}
        referralBonus={referralBonus}
      />
    </>
  );
};

export default PlanCard;
