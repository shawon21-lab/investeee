"use client";
import Button from "@/components/Button";
import AddNewInvestmentModal from "@/components/admin/settings/investment/AddNewInvestmentModal";
import InvestmentCard from "@/components/admin/settings/investment/InvestmentCard";
import useCompany from "@/components/hooks/useCompany";
import { Loader } from "@mantine/core";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineInbox } from "react-icons/ai";

const Page = () => {
  const [investments, setInvestments] = useState<InvestmentProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [investmentModal, setInvestmentModal] = useState(false);

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;

  const getInvestments = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/investment`);
      if (data.error) throw new Error(data.error);
      setInvestments(data.reverse());
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getInvestments();
  }, [getInvestments]);

  return (
    <>
      <div className="flex flex-col w-full gap-5">
        <div
          className={`text-xl sm:text-2xl font-bold 
        flex justify-center`}
        >
          Investments
        </div>

        <div className="flex w-full justify-center sm:justify-end">
          <div className="w-full max-w-[150px]">
            <Button
              small
              onClick={() => setInvestmentModal(true)}
              label="Add New"
            />
          </div>
        </div>

        <div
          className="flex gap-3 items-center 
      flex-wrap justify-center"
        >
          {!loading &&
            investments.map((item) => (
              <InvestmentCard
                key={item._id}
                name={item.planName}
                id={item._id}
                roiDaily={item.ROIDaily}
                roiReceived={item.ROIReceived}
                amountInvested={item.amountInvested}
                status={item.status}
                createdAt={item.createdAt}
              />
            ))}

          {!loading && investments.length <= 0 && (
            <div
              className="flex justify-center flex-col items-center 
                min-h-[70vh]"
            >
              <AiOutlineInbox color={primaryLightColor} size={100} />
              <div className={`font-semibold text-lg`}>
                No Investments Availaible
              </div>
            </div>
          )}

          {loading && <Loader color={primaryLightColor} />}
        </div>
      </div>

      <AddNewInvestmentModal
        opened={investmentModal}
        onClose={setInvestmentModal.bind(this, false)}
        getInvestments={getInvestments}
      />
    </>
  );
};

export default Page;
