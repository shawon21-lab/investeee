"use client";
import useTheme from "@/components/hooks/useTheme";
import formatNumber from "@/constants/formatNumber";
import { Radio } from "@mantine/core";
import React, { useState } from "react";

interface WalletCardProps {
  setSelectedWallet: (walletAddress: string) => void;
  walletAddress: string;
  label: string;
  value: string;
  selectedWallet: string;
  amount: number;
  setCoinName: (coinName: string) => void;
}

const WalletCard = (props: WalletCardProps) => {
  const {
    setSelectedWallet,
    walletAddress,
    label,
    value,
    selectedWallet,
    amount,
    setCoinName,
  } = props;
  const { mode } = useTheme();

  return (
    <div
      onClick={() => {
        setSelectedWallet(walletAddress);
        setCoinName(value);
      }}
      className={`flex items-center justify-between 
    hover:shadow-lg shadow-md py-4 
    px-3 rounded-lg cursor-pointer 
    gap-3 w-full active:scale-95 transition duration-200
    ${mode === "light" ? "shadow-gray-200" : "shadow-[#1d1d1d]"}`}
    >
      <div className="flex items-center gap-4">
        <Radio
          checked={walletAddress === selectedWallet}
          onChange={() => {
            setSelectedWallet(walletAddress);
            setCoinName(value);
          }}
        />

        <div>
          <div
            className={`font-semibold
            ${mode === "light" ? "text-gray-500" : "text-white"}`}
          >
            {label}
          </div>
          {/* <div className={`font-semibold text-sm text-gray-400 break-all`}>
            {walletAddress}
          </div> */}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`font-bold flex flex-col items-end
        ${mode === "light" ? "text-slate-700" : "text-white"}`}
        >
          <div>${formatNumber(amount)}</div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
