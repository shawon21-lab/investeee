"use client";
import Button from "@/components/Button";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { Avatar } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdPerson } from "react-icons/io";

interface CardProps {
  users?: userSchemaType[];
}

const RecentUsersCard = (props: CardProps) => {
  const { mode } = useTheme();
  const { users } = props;
  const router = useRouter();

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;
  const primaryVeryLightColor = company?.color.primaryVeryLight;
  const currency = company?.currency.symbol;

  return (
    <div
      className={`sm:max-w-[420px] w-[90%] h-[350px] 
    shadow-md rounded-md p-5 
    transition-all duration-300 hover:scale-105 
    hover:shadow-lg flex flex-col 
    gap-4
    ${
      mode === "light"
        ? "shadow-[#d9d9d9] hover:shadow-[#c1c1c1]"
        : "shadow-[#5d5d5d] hover:shadow-[#7b7b7b]"
    }`}
    >
      <div className="text-lg font-semibold">Recent Users</div>

      <div className={`flex flex-col gap-3 overflow-auto`}>
        {users?.map((item) => (
          <div
            key={item._id}
            style={{ borderColor: primaryVeryLightColor }}
            className="flex justify-between px-1.5 
            py-2.5 rounded-md border-[.5px] items-center 
            overflow-auto gap-3 flex-shrink-0"
          >
            <div>
              {item.avatar && (
                <Avatar
                  src={item.avatar.url}
                  alt="its me"
                  size="lg"
                  radius="md"
                />
              )}

              {!item.avatar && (
                <Avatar color="red" alt="its me" size="lg" radius="xl">
                  <IoMdPerson color={primaryLightColor} />
                </Avatar>
              )}
            </div>

            <div className="flex flex-col">
              <div className="text-sm">{item.email}</div>
              <div className="text-xs">{item.username}</div>
            </div>

            <div className="flex flex-col">
              <div className="text-xs flex-shrink-0 whitespace-nowrap">
                {"Account Balance"}
              </div>
              <div className="text-sm flex-shrink-0">
                {currency}
                {item.accountBalance}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUsersCard;
