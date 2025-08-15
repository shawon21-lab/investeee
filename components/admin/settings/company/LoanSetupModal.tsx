import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { Select } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  company: CompanyProps;
}

const LoanSetupModal = (props: ModalProps) => {
  const { opened, onClose, company } = props;
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState<"on" | "off">(company?.loan?.status);
  const [minimumAmount, setMinimumAmount] = useState(
    company?.loan?.minimum.toString()
  );
  const [maximumAmount, setMaximumAmount] = useState(
    company?.loan?.maximum.toString()
  );

  const Handler = async () => {
    try {
      if (+minimumAmount > +maximumAmount)
        throw new Error("Minimum amount cannot be greater than Maximum amount");
      setLoading(true);

      const res = await axios.post("/api/company/loan-setup", {
        status,
        minimum: minimumAmount,
        maximum: maximumAmount,
      });
      if (res.data.error) throw new Error(res.data.error);
      toast.success(res.data.message);
      onClose();
      location.reload();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer
      size="lg"
      title="Loan Setup"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3 min-h-[230px] justify-between">
        <div className="w-full flex gap-1 flex-col">
          <div className="text-rose-500 text-lg font-bold">Loan</div>

          <div className="w-full flex gap-x-2 gap-y-2 flex-col sm:flex-row items-center">
            <div className="w-full flex flex-col">
              <div className="font-semibold">Status</div>
              <Select
                size="lg"
                value={status}
                onChange={(e: "off" | "on") => setStatus(e)}
                data={[
                  { label: "ON", value: "on" },
                  { label: "OFF", value: "off" },
                ]}
              />
            </div>

            <div className="w-full flex flex-col">
              <div className="font-semibold">Minimum Amount</div>
              <TextInput
                value={minimumAmount}
                onChange={(e) => setMinimumAmount(e.target.value)}
              />
            </div>

            <div className="w-full flex flex-col">
              <div className="font-semibold">Maximum Amount</div>
              <TextInput
                value={maximumAmount}
                onChange={(e) => setMaximumAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <Button loading={loading} label="Update" onClick={Handler} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default LoanSetupModal;
