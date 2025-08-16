"use client";
import Button from "@/components/Button";
import DeletePlanModal from "@/components/admin/settings/plan/DeletePlanModal";
import EditPlanModal from "@/components/admin/settings/plan/EditPlanModal";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import formatDate from "@/constants/formatDate";
import { Loader } from "@mantine/core";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Page = () => {
  const { mode } = useTheme();
  const planId = useParams().planId;
  const [plan, setPlan] = useState<PlanProps | undefined>();
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;
  const currency = company?.currency.symbol;

  const date = new Date(`${plan?.createdAt}`);

  const getPlan = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/plan/${planId}`);
      if (data.error) throw new Error(data.error);
      setPlan(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [planId]);

  useEffect(() => {
    if (planId) getPlan();
  }, [planId, getPlan]);

  if (!plan) {
    return (
      <div className="flex w-full justify-center">
        <Loader color={primaryLightColor} />
      </div>
    );
  }

  return (
    <>
      <div className={`flex justify-center pb-7`}>
        <div
          className={`w-[500px] max-w-full p-5 
        rounded-md shadow-md transition 
        flex flex-col items-center gap-7
         ${
           mode === "light"
             ? "shadow-gray-200 hover:shadow-gray-300"
             : " shadow-[#292929] hover:shadow-[#585858]"
         } `}
        >
          <div className="font-bold text-lg">{plan.planName}</div>

          <div className="flex flex-col w-full gap-3">
            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Mini Deposit ({currency}):</div>
              <div>{plan.minAmount}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Max Deposit ({currency}):</div>
              <div>{plan.maxAmount}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Total ROI (%):</div>
              <div>{plan.totalROI}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>ROI Daily (%):</div>
              <div>{plan.ROIDaily}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Duration (days):</div>
              <div>{plan.duration}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Created At:</div>
              <div>{formatDate(date)}</div>
            </div>

            <div className="flex w-full justify-between gap-3">
              <Button
                outline
                label="Delete"
                onClick={() => setDeleteModal(true)}
              />
              <Button label="Edit" onClick={() => setEditModal(true)} />
            </div>
          </div>
        </div>
      </div>

      <DeletePlanModal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        planId={plan._id}
      />

      <EditPlanModal
        getPlan={getPlan}
        opened={editModal}
        onClose={() => setEditModal(false)}
        planId={plan._id}
        planName={plan.planName}
        minAmount={plan.minAmount}
        maxAmount={plan.maxAmount}
        ROIDaily={plan.ROIDaily}
        totalROI={plan.totalROI}
        duration={plan.duration}
      />
    </>
  );
};

export default Page;
