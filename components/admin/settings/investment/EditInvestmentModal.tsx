import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { isNumber } from "@/constants/isNumber";
import { Select } from "@mantine/core";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

interface EditInvestmentModalProps {
  opened: boolean;
  onClose: () => void;
  getInvestment: () => void;
  investment: InvestmentProps;
}

const EditInvestmentModal = (props: EditInvestmentModalProps) => {
  const { opened, onClose, getInvestment, investment } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    planName: investment.planName,
    duration: investment.duration.toString(),
    ROIDaily: investment.ROIDaily.toString(),
    totalROI: investment.totalROI.toString(),
    amountInvested: investment.amountInvested.toString(),
    status: investment.status,
  });

  const dailyRoi = useMemo(() => {
    return isNumber(Number(data.totalROI) / Number(data.duration))
      ? (Number(data.totalROI) / Number(data.duration)).toFixed(1)
      : "";
  }, [data.duration, data.totalROI]);

  useEffect(() => {
    setData({
      ...data,
      ROIDaily: dailyRoi,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyRoi]);

  const addPlanHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.patch("/api/admin/investment", data);
      if (res.data.error) throw new Error(res.data.error);
      onClose();
      getInvestment();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer
      size="lg"
      title="Edit Investment"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div>Package Name:</div>
          <TextInput
            value={data.planName}
            onChange={(e) => setData({ ...data, planName: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div>Duration (days):</div>
          <TextInput
            value={data.duration}
            onChange={(e) => {
              isNumber(+e.target.value) &&
                setData({ ...data, duration: e.target.value });
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col w-full gap-1.5">
            <div>Total ROI (%):</div>
            <TextInput
              value={data.totalROI}
              onChange={(e) => {
                isNumber(+e.target.value) &&
                  setData({ ...data, totalROI: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col w-full gap-1.5">
            <div>Daily ROI (%):</div>
            <TextInput value={data.ROIDaily} disabled onChange={() => {}} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col w-full gap-1.5">
            <div>Amount to invest:</div>
            <TextInput
              value={data.amountInvested}
              onChange={(e) => {
                isNumber(+e.target.value) &&
                  setData({ ...data, amountInvested: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col w-full gap-1.5">
            <div>Status:</div>
            <Select
              value={data.status}
              onChange={(e: "active" | "completed") => {
                setData({ ...data, status: e });
              }}
              data={[
                { label: "Active", value: "active" },
                { label: "Completed", value: "completed" },
              ]}
            />
          </div>
        </div>
        <Button loading={loading} label="Update" onClick={addPlanHandler} />
      </div>
    </ModalContainer>
  );
};

export default EditInvestmentModal;
