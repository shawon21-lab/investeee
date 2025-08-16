"use client";

import Button from "@/components/Button";
import AddInvestmentBonusModal from "@/components/admin/settings/investment/AddInvestmentBonusModal";
import DeleteInvestmentModal from "@/components/admin/settings/investment/DeleteInvestmentModal";
import EditInvestmentModal from "@/components/admin/settings/investment/EditInvestmentModal";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import formatDate from "@/constants/formatDate";
import { Loader } from "@mantine/core";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Page = () => {
  const { mode } = useTheme();
  const [loading, setLoading] = useState(false);
  const investmentId = useParams().investmentId;

  //   const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addBonusModal, setAddBonusModal] = useState(false);

  const [investmentInfo, setInvestmentInfo] = useState<{
    investment: InvestmentProps;
    returns: ReturnProps[];
  }>();
  const router = useRouter();

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;
  const currency = company?.currency.symbol;

  const getInvestmentInfo = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/invest/${investmentId}`);
      if (data.error) throw new Error(data.error);
      setInvestmentInfo(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [investmentId]);

  useEffect(() => {
    if (investmentId) getInvestmentInfo();
  }, [getInvestmentInfo, investmentId]);

  if (!investmentInfo) {
    return (
      <div className="flex w-full justify-center">
        <Loader color={primaryLightColor} />
      </div>
    );
  }

  const { investment } = investmentInfo;
  const { returns } = investmentInfo;

  return (
    <>
      <div className={`flex justify-center pb-7`}>
        <div
          className={`w-[500px] max-w-full p-5 
        rounded-md shadow-md transition 
        flex flex-col items-center gap-7
         ${
           mode === "light"
             ? "shadow-gray-200 hover:shadow-gray-300 text-slate-700"
             : " shadow-[#292929] hover:shadow-[#585858] text-white"
         } `}
        >
          <div className="font-bold text-lg">{investment.planName}</div>

          <div className="flex flex-col w-full gap-2">
            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Amount Invested:</div>
              <div>
                {currency}
                {investment.amountInvested}
              </div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Status:</div>
              <div>{investment.status}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Profit Received:</div>
              <div>
                {currency}
                {investment.ROIReceived.toFixed(1)}
              </div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Expected Profit:</div>
              <div>
                {currency}
                {(
                  investment.amountInvested *
                  (investment.totalROI / 100)
                ).toFixed(1)}
              </div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Duration (days):</div>
              <div>
                {investment.duration}{" "}
                {investment.duration <= 1 ? "day" : "days"} Left
              </div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Total ROI (%):</div>
              <div>{investment.totalROI}%</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Daily ROI (%):</div>
              <div>{investment.ROIDaily}%</div>
            </div>

            <div className="flex items-center w-full gap-3">
              <Button
                outline
                onClick={() => setDeleteModal(true)}
                label="Delete Investment"
              />
              <Button
                onClick={() => router.push(`/admin/users/${investment.userId}`)}
                label="View Owner"
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-3 max-h-[50vh]">
            <div className="font-bold text-lg">Returns</div>

            <div className="w-full flex flex-col gap-3 max-h-[50vh] overflow-auto">
              {returns.map((item) => {
                const date = new Date(`${item.createdAt}`);
                return (
                  <div
                    key={item._id}
                    className="flex justify-between px-1.5 py-2.5 rounded-md border"
                  >
                    <div
                      style={{ color: primaryLightColor }}
                      className="text-sm font-bold"
                    >
                      {item.title}
                    </div>
                    <div className="text-xs">{formatDate(date)}</div>
                    <div className="text-sm">
                      {currency}
                      {item.amount.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <Button
                onClick={() => setAddBonusModal(true)}
                label="Add Bonus"
              />
            </div>
          </div>
        </div>
      </div>

      <DeleteInvestmentModal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        investmentId={investment._id}
      />

      <AddInvestmentBonusModal
        opened={addBonusModal}
        onClose={() => setAddBonusModal(false)}
        getInvestment={getInvestmentInfo}
        investment={investment}
      />

      {/* <EditInvestmentModal
        opened={editModal}
        onClose={() => setEditModal(false)}
        getInvestment={getInvestmentInfo}
        investment={investmentInfo.investment}
      /> */}
    </>
  );
};

export default Page;
