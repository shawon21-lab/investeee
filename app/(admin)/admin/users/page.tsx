"use client";
import TextInput from "@/components/TextInput";
import UserCard from "@/components/admin/user/UserCard";
import useCompany from "@/components/hooks/useCompany";
import { Loader } from "@mantine/core";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";

const Page = () => {
  const [users, setUsers] = useState<userSchemaType[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const adminId = (session?.user as { id: string })?.id;

  const [searchInput, setSearchInput] = useState("");
  const [displayUsers, setDisplayUsers] = useState(users);

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;

  const getTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/users/${adminId}`);
      if (data.error) {
        console.log(data.error);
        throw new Error("Something went wrong");
      }
      setUsers(data.reverse());
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  const searchInputChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const enteredText = e.target.value;
      setSearchInput(enteredText);
      const copyTransactions = users.slice(0);
      const filteredTransactions = copyTransactions.filter(
        (item) =>
          item.fullname.toLowerCase().includes(enteredText.toLowerCase()) ||
          item.username.toLowerCase().includes(enteredText.toLowerCase()) ||
          item.email.toLowerCase().includes(enteredText.toLowerCase())
      );
      setDisplayUsers(filteredTransactions);
    },
    [users]
  );

  useEffect(() => {
    if (adminId) getTransactions();
  }, [adminId, getTransactions]);

  useEffect(() => {
    setDisplayUsers(users);
  }, [users]);

  return (
    <div
      className="flex flex-col w-full 
    gap-10 pb-5"
    >
      <div
        className={`text-xl sm:text-2xl font-bold 
        flex justify-center`}
      >
        Users ({users.length})
      </div>

      <div className="flex justify-center w-full">
        <div className="w-[80%] sm:w-[50%]">
          <TextInput
            icon={FaSearch}
            value={searchInput}
            onChange={searchInputChangeHandler}
            placeholder="Search Users"
          />
        </div>
      </div>

      <div
        className="flex gap-3 items-center 
      flex-wrap justify-center "
      >
        {displayUsers.map((item) => (
          <UserCard
            key={item._id}
            fullname={item.fullname}
            username={item.username}
            email={item.email}
            avatar={item.avatar}
            id={item._id}
          />
        ))}

        {loading && displayUsers.length <= 0 && (
          <Loader color={primaryLightColor} />
        )}
      </div>
    </div>
  );
};

export default Page;
