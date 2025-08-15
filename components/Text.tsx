"use client";
import React, { HTMLAttributes, useEffect, useState } from "react";
import useTheme from "./hooks/useTheme";

interface TextProps {
  children: React.ReactNode;
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl";
  font?: "400" | "500" | "600" | "700";
  color?:
    | "gray"
    | "lightGray"
    | "rose"
    | "lightRose"
    | "aqua"
    | "fine-green"
    | "fine-blue";
  clasName?: HTMLAttributes<HTMLDivElement> | string;
  onClick?: () => void;
  colored?: boolean;
}

const Text = (props: TextProps) => {
  const { children, size, font, color, clasName, onClick, colored } = props;
  const { mode } = useTheme();
  const [newSize, setNewSize] = useState(size);
  const [newClassName, setNewClassName] = useState(clasName);

  useEffect(() => {
    setNewSize(size);
    setNewClassName(clasName);
  }, [clasName, size]);

  return (
    <div
      onClick={onClick}
      className={`transition-colors duration-500
      ${newSize === "xs" ? `text-xs` : "text-base"}
      ${newSize === "sm" ? `text-sm` : "text-base"}  
      ${newSize === "base" ? `text-base` : "text-base"}  
      ${newSize === "lg" ? `text-lg` : "text-base"}  
      ${newSize === "xl" ? `text-xl` : "text-base"}  
      ${newSize === "2xl" ? `text-2xl` : "text-base"}  
      ${newSize === "3xl" ? `text-3xl` : "text-base"}  
      ${newSize === "4xl" ? `text-4xl` : "text-base"}  
      ${newSize === "5xl" ? `text-5xl` : "text-base"}  
      ${newSize === "6xl" ? `text-6xl` : "text-base"}   
      ${font === "400" ? "font-normal" : "font-normal"}
      ${font === "500" ? "font-medium" : "font-normal"}
      ${font === "600" ? "font-semibold" : "font-normal"}
      ${font === "700" ? "font-bold" : "font-normal"}
      ${!color && "text-slate-700"} 
      ${color === "gray" && "text-gray-500"}
      ${color === "lightGray" && "text-gray-300"}
      ${color === "rose" && "text-rose-500"}
      ${color === "lightRose" && "text-rose-300"} 
      ${color === "aqua" && "text-[#01e4e4]"}
      ${color === "fine-blue" && "text-[#3dd2f1]"}
      ${color === "fine-green" && "text-[#48d38a]"}
      ${mode == "dark" && !colored && color !== "lightGray" && "text-white"}
      ${newClassName && newClassName}`}
    >
      {children}
    </div>
  );
};

export default Text;
