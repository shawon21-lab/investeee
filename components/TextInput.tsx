"use client";
import React, { useState } from "react";
import { IconType } from "react-icons";
import useCompany from "./hooks/useCompany";

interface TextInputProps {
  placeholder?: string;
  disabled?: boolean;
  secureEntry?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: IconType;
  iconAction?: () => void;
  maxLength?: number;
  id?: string;
}

const TextInput = (props: TextInputProps) => {
  const {
    maxLength,
    disabled,
    value,
    onChange,
    secureEntry,
    placeholder,
    icon: Icon,
    iconAction,
    id,
  } = props;
  const [isFocus, setIsFocus] = useState(false);
  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;
  const primaryVeryLightColor = company?.color.primaryVeryLight;

  return (
    <div
      style={{
        backgroundColor: isFocus ? "white" : primaryVeryLightColor,
        borderColor: primaryVeryLightColor,
      }}
      aria-disabled={true}
      className={`flex justify-between w-full 
    items-center px-3 rounded-lg border 
    ${disabled && "bg-gray-100 cursor-not-allowed"}`}
    >
      <input
        maxLength={maxLength}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        disabled={disabled}
        id={id}
        type={secureEntry ? "password" : "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`py-4 outline-none w-full 
        h-full pr-2 bg-inherit 
        text-gray-500 font-semibold 
        disabled:cursor-not-allowed`}
      />
      {Icon && (
        <Icon
          onClick={iconAction}
          size={24}
          className="cursor-pointer text-gray-600"
        />
      )}
    </div>
  );
};

export default TextInput;
