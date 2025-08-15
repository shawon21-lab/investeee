"use client";
import Button from "@/components/Button";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { Avatar } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";
import { IoMdPerson } from "react-icons/io";

interface CardProps {
  icon?: IconType;
  detail?: string | number;
  title?: string;
}

const DashboardCard = (props: CardProps) => {
  const { mode } = useTheme();
  const { icon: Icon, detail, title } = props;
  const router = useRouter();

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;

  return (
    <div
      className={`sm:max-w-[200px] w-[90%] h-[200px] 
    shadow-md rounded-md p-5 
    transition-all duration-300 hover:scale-105 
    hover:shadow-lg flex flex-col items-center 
    gap-4 justify-center
    ${
      mode === "light"
        ? "shadow-[#d9d9d9] hover:shadow-[#c1c1c1]"
        : "shadow-[#5d5d5d] hover:shadow-[#7b7b7b]"
    }`}
    >
      <div>{Icon && <Icon size={30} color={primaryLightColor} />}</div>

      <div className="font-bold w-full text-3xl text-center truncate">
        {detail}
      </div>

      <div className="font-semibold text-lg text-center">{title}</div>
    </div>
  );
};

export default DashboardCard;
