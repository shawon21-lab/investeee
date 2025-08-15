import React from "react";
import useTheme from "./hooks/useTheme";

interface CreditCardProps {
  ownerName: string;
  cardNumber: string;
  cardExpire: string;
  // companyName: "Visa" | "Master Card" | "Discovery";
  cvc: string;
  onClick?: () => void;
}

const CreditCard = (props: CreditCardProps) => {
  const { ownerName, cardNumber, cardExpire, cvc, onClick } = props;

  const { mode } = useTheme();

  return (
    <div
      onClick={onClick}
      className={`h-[185px] w-[335px] p-[20px]
  flex-shrink-0 rounded-[20px] flex 
  flex-col justify-between shadow-2xl
  transition-all duration-500 hover:scale-110 
  active:scale-100 select-none sm:cursor-pointer
  ${
    mode === "light"
      ? "bg-[url('/card-bg-light.png')] shadow-gray-200 hover:shadow-gray-300"
      : "bg-[url('/card-bg-dark.png')] shadow-[#1d1d1d] hover:shadow-[#585858]"
  }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-base text-white">{cardExpire}</div>
        <div className="text-base text-white">{cvc}</div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-base text-white">{ownerName}</div>
        <div className="text-base text-white">{cardNumber}</div>
      </div>
    </div>
  );
};

export default CreditCard;
