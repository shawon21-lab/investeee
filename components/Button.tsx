"use client";
import { Loader } from "@mantine/core";
import React from "react";
import { IconType } from "react-icons";
import { MoonLoader } from "react-spinners";
import useCompany from "./hooks/useCompany";

interface ButtonProps {
  label: string | React.ReactElement;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
  loading?: boolean;
  type?: "button" | "reset" | "submit";
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
  loading,
  type,
}) => {
  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryVeryLightColor = company?.color.primaryVeryLight;

  return (
    <button
      type={type}
      style={{
        backgroundColor: outline ? "white" : primaryColor,
        borderColor: primaryVeryLightColor,
      }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative disabled:opacity-70 disabled:cursor-not-allowed 
      rounded-lg hover:opacity-80 transition 
      w-full disabled:active:scale-[1] active:scale-[.95] 
      flex justify-center items-center gap-2 
      ${outline ? "text-slate-700" : "text-white"} 
      ${small ? "h-[40px]" : "h-[55px]"} 
      ${small ? "text-sm" : " text-base"} 
      ${small ? "font-light" : "font-semibold"} 
      ${small ? "border-[1px]" : "border-2"}`}
    >
      {!loading && label}
      {Icon && !loading && <Icon size={24} />}
      {loading && (
        // <MoonLoader size={24} color={outline ? "#181818" : "#ffff"} />
        <Loader size={24} color={outline ? primaryColor : "#ffff"} />
      )}
    </button>
  );
};

export default Button;
