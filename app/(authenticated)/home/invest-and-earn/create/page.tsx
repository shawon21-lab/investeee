"use client";

import PlanCard from "@/components/authenticated/home/invest-and-earn/create/PlanCard";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { Loader } from "@mantine/core";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Page = () => {
  const { mode } = useTheme();
  const [plans, setPlans] = useState<PlanProps[]>([]);
  const [loading, setLoading] = useState(false);

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;

  const getPlans = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/plan`);
      if (data.error) throw new Error(data.error);
      setPlans(data);
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
    <div
      className={`${
        mode === "light" ? "text-slate-700" : "text-white"
      } flex gap-3 flex-col`}
    >
      <div>Choose a Plan</div>

      <div className={`flex flex-wrap justify-center sm:justify-start gap-y-5`}>
        {!loading &&
          plans.map((plan) => (
            <PlanCard
              key={plan._id}
              name={plan.planName}
              minAmount={plan.minAmount}
              maxAmount={plan.maxAmount}
              id={plan._id}
              roiDaily={plan.ROIDaily}
              duration={plan.duration}
              totalRoi={plan.totalROI}
              referralBonus={plan.referralBonus}
            />
          ))}

        {loading && (
          <div
            className="w-full flex justify-center items-center 
          min-h-[50vh]"
          >
            <Loader
              color={mode === "light" ? primaryColor : primaryLightColor}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
