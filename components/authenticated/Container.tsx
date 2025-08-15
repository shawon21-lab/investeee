"use client";
import React, { useEffect } from "react";
import useTheme from "../hooks/useTheme";

const Container = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useTheme();

  return (
    <div
      className={`flex justify-center 
    min-h-screen h-full pt-[7rem]
    ${
      mode === "light"
        ? "bg-white"
        : "bg-[#121212] transition-colors duration-500"
    }`}
    >
      <div className="w-[760px] max-w-[95%]">{children}</div>
    </div>
  );
};

export default Container;
