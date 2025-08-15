"use client";
import Button from "@/components/Button";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { Avatar } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";
import { IoMdPerson } from "react-icons/io";

interface UserCardProps {
  fullname: string;
  username: string;
  email: string;
  id?: string;
  avatar?: { url: string };
}

const UserCard = (props: UserCardProps) => {
  const { mode } = useTheme();
  const { fullname, username, email, id, avatar } = props;
  const router = useRouter();

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;

  return (
    <div
      className={`max-w-[250px] w-[90%] h-[300px] 
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
      <div>
        {avatar && (
          <Avatar src={avatar.url} alt="its me" size="xl" radius="md" />
        )}

        {!avatar && (
          <Avatar color="red" alt="its me" size="xl" radius="xl">
            <IoMdPerson color={primaryLightColor} />
          </Avatar>
        )}
      </div>

      <div className="flex flex-col gap-1.5 items-center text-center">
        <div className="font-semibold text-sm">{fullname}</div>
        <div className="font-thin ">{`*${username}*`}</div>
        <div className="font-thin text-xs">{email}</div>
      </div>

      <Button
        onClick={() => router.push(`/admin/users/${id}`)}
        label={"View Details"}
      />
    </div>
  );
};

export default UserCard;
