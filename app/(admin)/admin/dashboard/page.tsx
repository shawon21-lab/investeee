"use client";
import DashboardCard from "@/components/admin/dashboard/DashboardCard";
import RecentTransactionCard from "@/components/admin/dashboard/RecentTransactionCard";
import RecentUsersCard from "@/components/admin/dashboard/RecentUsersCard";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import formatNumber from "@/constants/formatNumber";
import { Badge, Indicator, Loader } from "@mantine/core";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaBell, FaUsers } from "react-icons/fa";
import { MdArrowDownward, MdArrowUpward, MdSwapHoriz } from "react-icons/md";

const AdminDashboard = () => {
  const { data: session } = useSession();
  const adminId = (session?.user as { id: string })?.id;
  const [users, setUsers] = useState<userSchemaType[]>();
  const [transactions, setTransactions] = useState<TransactionProps[]>();

  const [recentUsers, setRecentUsers] = useState<userSchemaType[]>();
  const [recentTransaction, setRecentTransaction] =
    useState<TransactionProps[]>();

  const { company } = useCompany();
  const { mode } = useTheme();
  const primaryLight = company?.color.primaryLight;
  const currency = company?.currency.symbol;

  const fetchData = useCallback(async () => {
    try {
      //code
      const { data: fetchedUsers } = await axios.get(
        `/api/admin/users/${adminId}`
      );
      if (fetchedUsers.error) throw new Error(fetchedUsers.error);
      const { data: fetchedTransactions } = await axios.get(
        `/api/admin/transactions/${adminId}`
      );
      if (fetchedTransactions.error) throw new Error(fetchedTransactions.error);

      setUsers(fetchedUsers);
      setTransactions(fetchedTransactions);

      const recentUsersFetched = fetchedUsers.reverse().slice(0, 7);
      const recentTransactionFetched = fetchedTransactions
        .reverse()
        .slice(0, 7);

      setRecentUsers(recentUsersFetched);
      setRecentTransaction(recentTransactionFetched);
    } catch (error: any) {
      //catch error
      toast.error(error.message);
    }
  }, [adminId]);

  useEffect(() => {
    if (adminId) fetchData();
  }, [adminId, fetchData]);

  if (!users || !transactions || !recentUsers || !recentTransaction) {
    return (
      <div className="flex justify-center items-center">
        <Loader color={primaryLight} />
      </div>
    );
  }

  const totalUsers = users.length;
  const totalTransactions = transactions.length;
  const adminUser = users.find((admin) => admin._id === adminId);

  const deposits = transactions.filter(
    (item) => item.category === "deposit" && item.status === "successful"
  );
  const totalDeposit = deposits.reduce((acc, cur) => acc + cur.amount, 0);

  const withdrawals = transactions.filter(
    (item) =>
      item.category === "transfer" &&
      item.title === "Withdrawal Request" &&
      item.status === "successful"
  );
  const totalWithdrawals = withdrawals.reduce(
    (acc, cur) => acc + cur.amount,
    0
  );

  return (
    <>
      <div className="flex flex-col w-full gap-10">
        <div
          className={`h-[50px] rounded-md 
        flex px-5 items-center justify-between z-10
      ${mode === "light" ? "bg-[#ebebeb]" : "bg-[#3e3e3e]"}`}
        >
          <div className="flex items-center gap-2">
            {adminUser?.fullname}{" "}
            <Badge color={"dark"}>
              {adminUser?.manager === "yes" ? "Manager" : "Admin"}
            </Badge>
          </div>

          <Indicator>
            <FaBell size={24} />
          </Indicator>
        </div>

        <div
          className={`text-xl sm:text-2xl font-bold 
    flex justify-center`}
        >
          Dashboard
        </div>

        <div className="w-full flex items-center gap-4 justify-center flex-wrap">
          <DashboardCard
            title="Total Users"
            detail={totalUsers}
            icon={FaUsers}
          />
          <DashboardCard
            title="Total Deposits"
            detail={`${currency}${formatNumber(totalDeposit)}`}
            icon={MdArrowDownward}
          />
          <DashboardCard
            title="Total Withdrawals"
            detail={`${currency}${formatNumber(totalWithdrawals)}`}
            icon={MdArrowUpward}
          />
          <DashboardCard
            title="Number of Transactions"
            detail={totalTransactions}
            icon={MdSwapHoriz}
          />
        </div>

        <div
          className="w-full flex flex-col sm:flex-row flex-wrap
      items-center gap-4 justify-center"
        >
          <RecentUsersCard users={recentUsers} />
          <RecentTransactionCard transactions={recentTransaction} />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
