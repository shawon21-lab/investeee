"use client";
import TextInput from "@/components/TextInput";
import AdminTransactionCard from "@/components/admin/transaction/TransactionCard";
import useCompany from "@/components/hooks/useCompany";
import { Loader, SegmentedControl } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineInbox } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";

const Page = () => {
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const adminId = (session?.user as { id: string })?.id;

  const [segmentValue, setSegmentValue] = useState("all");
  const matches = useMediaQuery("(min-width: 56.25em)");

  const [searchInput, setSearchInput] = useState("");
  const [displayTransaction, setDisplayTransaction] = useState(transactions);

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;

  const searchInputChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const enteredText = e.target.value;
      setSearchInput(enteredText);
      const copyTransactions = transactions.slice(0);
      const filteredTransactions = copyTransactions.filter(
        (item) =>
          item.title.toLowerCase().includes(enteredText.toLowerCase()) ||
          item.status.toLowerCase().includes(enteredText.toLowerCase())
      );
      setDisplayTransaction(filteredTransactions);
    },
    [transactions]
  );

  const segmentChangeHandler = (text: string) => {
    setSegmentValue(text);
    const copyTransactions = transactions.slice(0);
    if (text === "all") {
      setDisplayTransaction(copyTransactions);
    } else {
      const filteredTransactions = copyTransactions.filter(
        (item) => item.status === text
      );
      setDisplayTransaction(filteredTransactions);
    }
  };

  const getTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/transactions/${adminId}`);
      if (data.error) {
        console.log(data.error);
        throw new Error("Something went wrong");
      }
      setTransactions(data.reverse());
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    if (adminId) getTransactions();
  }, [adminId, getTransactions]);

  useEffect(() => {
    setDisplayTransaction(transactions);
  }, [transactions]);

  return (
    <div className="flex flex-col w-full gap-10">
      <div
        className={`text-xl sm:text-2xl font-bold 
        flex justify-center`}
      >
        Transactions ({transactions.length})
      </div>

      <div className="flex justify-center w-full">
        <SegmentedControl
          fullWidth={true}
          orientation={matches ? "horizontal" : "vertical"}
          color="dark"
          value={segmentValue}
          onChange={segmentChangeHandler}
          data={[
            { label: "All", value: "all" },
            { label: "Successful", value: "successful" },
            { label: "Pending", value: "pending" },
            { label: "Processing (For admin)", value: "processing" },
            { label: "Action Needed", value: "action-needed" },
            { label: "Rejected", value: "rejected" },
          ]}
        />
      </div>

      <div className="flex justify-center w-full">
        <div className="w-[80%] sm:w-[50%]">
          <TextInput
            icon={FaSearch}
            value={searchInput}
            onChange={searchInputChangeHandler}
            placeholder="Search Transactions"
          />
        </div>
      </div>

      <div
        className="flex gap-3 items-center 
      flex-wrap justify-center"
      >
        {displayTransaction.map((item) => (
          <AdminTransactionCard
            key={item._id}
            title={item.title}
            amount={item.amount}
            status={item.status}
            category={item.category}
            senderName={item.senderName}
            id={item._id}
            createdAt={item.createdAt}
          />
        ))}

        {!loading && displayTransaction.length <= 0 && (
          <div className="flex justify-center flex-col items-center">
            <AiOutlineInbox color={primaryLightColor} size={100} />
            <div className={`font-semibold text-lg`}>
              No Availaible transactions
            </div>
          </div>
        )}

        {loading && displayTransaction.length <= 0 && (
          <Loader color={primaryLightColor} />
        )}
      </div>
    </div>
  );
};

export default Page;
