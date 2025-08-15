"use client";
import React, { useCallback, useEffect, useState } from "react";
import Button from "@/components/Button";
import useTheme from "@/components/hooks/useTheme";
import WithdrawModal from "@/components/authenticated/home/invest-and-earn/WithdrawModal";
import formatNumber from "@/constants/formatNumber";
import { useRouter } from "next/navigation";
import InvestmentCard from "./InvestmentCard";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Loader } from "@mantine/core";
import useCompany from "@/components/hooks/useCompany";
import { AiOutlineInbox } from "react-icons/ai";

interface SaveProps {
  user: userSchemaType;
}

const Save = (props: SaveProps) => {
  const { user } = props;
  const { mode } = useTheme();
  const router = useRouter();
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [investments, setInvestments] = useState<InvestmentProps[]>([]);
  const [loading, setLoading] = useState(false);

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;

  const currency = company?.currency.symbol;

  const getInvestment = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/invest");
      if (res.data.error) throw new Error(res.data.error);
      setInvestments(res.data.reverse());
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getInvestment();
  }, [getInvestment]);

  return (
    <div
      className={`flex flex-col w-full gap-6 
    ${mode === "light" ? "text-slate-700" : "text-white"}`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-1 w-full justify-between px-3">
        <div className="flex flex-col gap-1 w-full sm:items-center">
          <div className={`text-xs font-medium`}>Investment Balance</div>

          <div
            className={`font-bold text-3xl sm:text-4xl  
          ${mode === "light" ? "text-slate-700" : "text-white"}`}
          >
            {currency}
            {formatNumber(user.investBalance)}
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full sm:items-center">
          <div className={`text-xs font-medium`}>Profit Balance</div>

          <div
            className={`font-bold text-3xl sm:text-4xl 
          ${mode === "light" ? "text-slate-700" : "text-white"}`}
          >
            {currency}
            {formatNumber(user.investProfitBalance)}
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full sm:items-center">
          <div className={`text-xs font-medium`}>Withdrawable Balance</div>

          <div
            className={`font-bold text-3xl sm:text-4xl 
          ${mode === "light" ? "text-slate-700" : "text-white"}`}
          >
            {currency}
            {formatNumber(user.investWithdrawableBalance)}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => setWithdrawModal(true)} label={"Withdraw"} />
        <Button
          outline
          onClick={() => router.push("/home/invest-and-earn/create")}
          label={"New Investment"}
        />
      </div>

      <div className={`flex flex-wrap justify-between gap-y-5`}>
        {!loading &&
          investments.map((investment) => (
            <InvestmentCard
              key={investment._id}
              name={investment.planName}
              roiDaily={investment.ROIDaily}
              amountInvested={investment.amountInvested}
              status={investment.status}
              id={investment._id}
              roiReceived={investment.ROIReceived}
              createdAt={investment.createdAt}
            />
          ))}

        {!loading && investments.length <= 0 && (
          <div className="w-full flex justify-center items-center">
            <div className="flex justify-center flex-col items-center">
              <AiOutlineInbox color={primaryLightColor} size={100} />
              <div
                className={`font-semibold text-lg
              ${mode === "light" ? "text-slate-700" : "text-white"}`}
              >
                No Availaible Investment
              </div>
              <Button
                small
                outline
                onClick={() => router.push("/home/invest-and-earn/create")}
                label={"Start New Investment"}
              />
            </div>
          </div>
        )}

        {loading && (
          <div
            className="w-full flex justify-center items-center 
          min-h-[50vh]"
          >
            <Loader color={primaryColor} />
          </div>
        )}
      </div>

      <WithdrawModal
        user={user}
        onClose={() => setWithdrawModal(false)}
        opened={withdrawModal}
      />
    </div>
  );
};

export default Save;
