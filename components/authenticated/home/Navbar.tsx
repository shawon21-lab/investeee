"use client";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const Navbar = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { mode } = useTheme();

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;
  // const primaryVeryLightColor = company?.color.primaryVeryLight;

  const [spendHover, setSpendHover] = useState(false);
  const [investHover, setInvestHover] = useState(false);
  const [loanHover, setLoanHover] = useState(false);

  const getColor = (condition: boolean, hoverState: boolean) => {
    if (condition) {
      if (mode === "light") {
        return primaryColor;
      } else {
        return primaryLightColor;
      }
    } else {
      if (hoverState) {
        return primaryLightColor;
      } else {
        if (mode === "light") {
          return "#334155";
        } else {
          return "white";
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-between px-3 sm:px-10 shadow-lg py-3 rounded-md">
      <div
        onMouseEnter={() => setSpendHover(true)}
        onMouseLeave={() => setSpendHover(false)}
        style={{
          color: getColor(pathName === "/home", spendHover),
        }}
        onClick={() => router.push("/home")}
        className={`cursor-pointer text-base sm:text-lg 
         select-none font-semibold`}
      >
        Spend
      </div>

      <div
        onMouseEnter={() => setInvestHover(true)}
        onMouseLeave={() => setInvestHover(false)}
        style={{
          color: getColor(
            pathName.includes("/home/invest-and-earn"),
            investHover
          ),
        }}
        onClick={() => router.push("/home/invest-and-earn")}
        className={`cursor-pointer text-base sm:text-lg 
         select-none font-semibold`}
      >
        Invest And Earn
      </div>

      {company?.loan.status === "on" && (
        <div
          onMouseEnter={() => setLoanHover(true)}
          onMouseLeave={() => setLoanHover(false)}
          style={{
            color: getColor(pathName === "/home/loan", loanHover),
          }}
          onClick={() => router.push("/home/loan")}
          className={`cursor-pointer text-base sm:text-lg 
         select-none font-semibold`}
        >
          Get Loan
        </div>
      )}
    </div>
  );
};

export default Navbar;
