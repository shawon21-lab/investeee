"use client";
import Navbar from "@/components/authenticated/home/Navbar";
import React, { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
