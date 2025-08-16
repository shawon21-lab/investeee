"use client";
import Button from "@/components/Button";
import AddNewPlanModal from "@/components/admin/settings/plan/AddNewPlanModal";
import PlanCard from "@/components/admin/settings/plan/PlanCard";
import useCompany from "@/components/hooks/useCompany";
import { Loader } from "@mantine/core";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineInbox } from "react-icons/ai";

const Page = () => {
  const [plans, setPlans] = useState<PlanProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [planModal, setPlanModal] = useState(false);

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;

  const getPlans = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/plan`);
      if (data.error) throw new Error(data.error);
      setPlans(data.reverse());
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPlans();
  }, [getPlans]);

  return (
    <>
      <div className="flex flex-col w-full gap-5">
        <div
          className={`text-xl sm:text-2xl font-bold 
        flex justify-center`}
        >
          Packages
        </div>

        <div className="flex w-full justify-center sm:justify-end">
          <div className="w-full max-w-[150px]">
            <Button small onClick={() => setPlanModal(true)} label="Add New" />
          </div>
        </div>

        <div
          className="flex gap-3 items-center 
      flex-wrap justify-center"
        >
          {!loading &&
            plans.map((item) => (
              <PlanCard
                key={item._id}
                id={item._id}
                planName={item.planName}
                minAmount={item.minAmount}
                maxAmount={item.maxAmount}
                ROIDaily={item.ROIDaily}
                totalROI={item.totalROI}
                duration={item.duration}
                createdAt={item.createdAt}
                referralBonus={item.referralBonus}
              />
            ))}

          {!loading && plans.length <= 0 && (
            <div
              className="flex justify-center flex-col items-center 
                min-h-[70vh]"
            >
              <AiOutlineInbox color={primaryLightColor} size={100} />
              <div className={`font-semibold text-lg`}>No Plans Availaible</div>
            </div>
          )}

          {loading && <Loader color={primaryColor} />}
        </div>
      </div>

      <AddNewPlanModal
        getPlans={getPlans}
        opened={planModal}
        onClose={() => setPlanModal(false)}
      />
    </>
  );
};

export default Page;
