"use client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Save from "@/components/authenticated/home/invest-and-earn";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { Loader } from "@mantine/core";
import axios from "axios";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const getUser = async (userId: string) => {
  const res = await fetch(`${process.env.SITE_URL}/api/users/${userId}`);
  return res.json();
};

const getUserTransactions = async (userId: string) => {
  const res = await fetch(
    `${process.env.SITE_URL}/api/transactions/user/${userId}`
  );
  return res.json();
};

const Page = () => {
  const { data: session } = useSession();
  const userId = (session?.user as { id: string })?.id;
  const [user, setUser] = useState<userSchemaType>();

  const { company } = useCompany();
  const { mode } = useTheme();
  const primary = company?.color.primary;
  const primaryLight = company?.color.primaryLight;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios(`/api/users/${userId}`);

        if (data.error) {
          throw new Error(data.error);
        }

        setUser(data);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  if (!user) {
    return (
      <div
        className="flex w-full justify-center items-center 
      min-h-[60vh]"
      >
        <Loader color={mode === "light" ? primary : primaryLight} />
      </div>
    );
  }

  return <Save user={user} />;
};

export default Page;
