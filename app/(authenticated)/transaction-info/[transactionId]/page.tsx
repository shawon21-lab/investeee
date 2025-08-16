"use client";
import TransactionInfo from "@/components/authenticated/transaction-info";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { Loader } from "@mantine/core";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Page = ({ params }: { params: { transactionId: string } }) => {
  const [transaction, setTransaction] = useState<TransactionProps>();
  const { data: session } = useSession();
  const userId = (session?.user as { id: string })?.id;

  const { company } = useCompany();
  const { mode } = useTheme();
  const primary = company?.color.primary;
  const primaryLight = company?.color.primaryLight;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios(
          `/api/transactions/${params.transactionId}`
        );

        if (data.error) {
          throw new Error(data.error);
        }

        setTransaction(data);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    if (params.transactionId) fetchData();
  }, [params.transactionId]);

  if (!transaction) {
    return (
      <div
        className="flex w-full justify-center items-center 
      min-h-[60vh]"
      >
        <Loader color={mode === "light" ? primary : primaryLight} />
      </div>
    );
  }

  if (userId !== transaction.userId)
    return <div>You do not have access to this transaction</div>;

  return <TransactionInfo transaction={transaction} />;
};

export default Page;
