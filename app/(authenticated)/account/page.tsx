"use client";
import Account from "@/components/authenticated/account";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { Loader } from "@mantine/core";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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

  return <Account user={user} />;
};

export default Page;
