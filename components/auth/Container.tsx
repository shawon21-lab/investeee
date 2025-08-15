"use client";
import React, { useEffect } from "react";
import useTheme from "../hooks/useTheme";

const Container = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useTheme();

  return (
    <div
      className={`flex items-center 
    justify-center min-h-screen h-full p-5
    ${
      mode === "light"
        ? "bg-white"
        : " bg-[#121212] transition-colors duration-500"
    }`}
    >
      <div className="w-[400px] max-w-[90%] flex flex-col items-center gap-10">
        {children}
      </div>
    </div>
  );
};

export default Container;
