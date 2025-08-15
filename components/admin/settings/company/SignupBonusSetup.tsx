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

const SignupBonusModal = (props: ModalProps) => {
  const { opened, onClose, company } = props;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"on" | "off">(
    company?.signupBonus?.status
  );
  const [amount, setAmount] = useState(company?.signupBonus?.amount.toString());

  const Handler = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/company/signup-bonus-setup", {
        status,
        amount,
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
      title="Setup signup Bonus"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3 min-h-[230px] justify-between">
        <div className="w-full flex gap-1 flex-col">
          <div className="text-rose-500 text-lg font-bold">SignUp Bonus</div>

          <div className="w-full flex gap-x-2 gap-y-2 flex-col sm:flex-row items-center">
            <div className="w-full flex flex-col">
              <div className="font-semibold">Status</div>
              <Select
                size="lg"
                value={status}
                onChange={(e: "on" | "off") => setStatus(e)}
                data={[
                  { label: "ON", value: "on" },
                  { label: "OFF", value: "off" },
                ]}
              />
            </div>

            <div className="w-full flex flex-col">
              <div className="font-semibold">Bonus Amount</div>
              <TextInput
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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

export default SignupBonusModal;
