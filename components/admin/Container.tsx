"use client";
import React from "react";
import useTheme from "../hooks/useTheme";
import AdminNavbar from "./Navbar";

const Container = ({ children }: { children: React.ReactNode }) => {
  const { mode } = useTheme();

  return (
    <div className="flex w-full">
      <AdminNavbar />

      <div
        className={`flex w-full
    justify-center min-h-screen h-full py-2 pt-[3.5rem] pl-[22%] sm:pl-[260px]
    ${
      mode === "light"
        ? "bg-white text-slate-700"
        : " bg-[#121212] transition-colors duration-500 text-white"
    }`}
      >
        <div className="max-w-[95%] w-full">{children}</div>
      </div>
    </div>
  );
};

export default Container;
