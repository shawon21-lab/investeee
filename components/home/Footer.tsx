"use client";
import React from "react";
import useCompany from "../hooks/useCompany";

const Footer = () => {
  const { company } = useCompany();

  const date = new Date();
  return (
    <footer
      className="flex justify-center py-7 
    bg-[#050704] text-center px-5 sm:px-10 md:px-20"
    >
      © {date.getFullYear()} {company?.name}, {company?.address}
    </footer>
  );
};

export default Footer;
