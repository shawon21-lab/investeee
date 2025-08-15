"use client";
import Button from "@/components/Button";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { useRouter } from "next/navigation";
import React from "react";
import { FaCoins } from "react-icons/fa";

interface CoinCardProps {
  label: string;
  id: string;
  walletAddress: string;
}

const CoinCard = (props: CoinCardProps) => {
  const { mode } = useTheme();
  const { label, id, walletAddress } = props;
  const router = useRouter();

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;

  return (
    <div
      className={`max-w-[250px] w-[90%] h-[300px] 
    shadow-md rounded-md p-5 
    transition-all duration-300 hover:scale-105 
    hover:shadow-lg flex flex-col items-center 
    gap-4 justify-center
    ${
      mode === "light"
        ? "shadow-[#d9d9d9] hover:shadow-[#c1c1c1]"
        : "shadow-[#5d5d5d] hover:shadow-[#7b7b7b]"
    }`}
    >
      <div>
        <FaCoins color={primaryLightColor} size={24} />
      </div>

      <div className="flex flex-col gap-1.5 items-center text-center">
        <div className="font-semibold text-sm">{label}</div>
        <div className="font-thin text-xs break-all">{walletAddress}</div>
      </div>

      <Button
        onClick={() => router.push(`/admin/settings/coins/${id}`)}
        label={"View Details"}
      />
    </div>
  );
};

export default CoinCard;
