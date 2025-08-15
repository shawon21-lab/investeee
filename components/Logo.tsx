"use client";
import React from "react";
import useTheme from "./hooks/useTheme";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useCompany from "./hooks/useCompany";

interface LogoProps {
  home?: boolean;
  onClick?: () => void;
}

const Logo = (props: LogoProps) => {
  const { home, onClick } = props;
  const { mode } = useTheme();
  const router = useRouter();
  const goHome = () => {
    router.push("/home");
  };

  const { company } = useCompany();

  return (
    <>
      {!home && (
        <div
          onClick={onClick || goHome}
          className={`text-[12px] font-[700] italic 
          flex flex-col items-center sm:cursor-pointer
      ${mode === "light" ? "text-rose-500" : "text-rose-300"}`}
        >
          <div className="w-[auto] h-[auto] max-h-[50px]">
            <Image
              priority
              src={company?.logo?.url || ""}
              alt="logo"
              width={60}
              height={60}
              className="w-[100%] h-[100%]"
            />
          </div>
        </div>
      )}

      {home && (
        <div
          onClick={onClick}
          className={`text-[20px] font-[700] italic flex items-center 
          text-rose-300`}
        >
          <div className="w-[100px] h-[auto]">
            <Image
              priority
              src={company?.logo?.url || ""}
              alt="logo"
              width={100}
              height={100}
              className="w-[100%] h-[100%]"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Logo;
