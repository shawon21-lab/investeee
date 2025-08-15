import Button from "@/components/Button";
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

const PaymentSetupModal = (props: ModalProps) => {
  const { opened, onClose, company } = props;
  const [loading, setLoading] = useState(false);
  const [autoCoinPayment, setAutoCoinPayment] = useState(
    company?.payment?.automaticCoinPayment
  );
  const [manualCoinPayment, setManualCoinPayment] = useState(
    company?.payment?.manualCoinPayment
  );
  const [bankTransfer, setBankTransfer] = useState(
    company?.payment?.bankTransfer
  );

  const Handler = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/company/payment-setup", {
        bankTransfer,
        manualCoinPayment,
        automaticCoinPayment: autoCoinPayment,
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
      title="Payment Setting"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3 min-h-[220px] justify-between">
        <div className="w-full flex gap-1 flex-col">
          <div className="text-rose-500 text-lg font-bold">Payments</div>

          <div className="w-full flex gap-x-2 gap-y-2 flex-col sm:flex-row items-center">
            <div className="w-full flex flex-col">
              <div className="font-semibold">Automatic Coin Payment</div>
              <Select
                size="lg"
                value={autoCoinPayment}
                onChange={(e: "on" | "off") => setAutoCoinPayment(e)}
                data={[
                  { label: "ON", value: "on" },
                  { label: "OFF", value: "off" },
                ]}
              />
            </div>

            <div className="w-full flex flex-col">
              <div className="font-semibold">Manual Coin Payment</div>
              <Select
                size="lg"
                value={manualCoinPayment}
                onChange={(e: "on" | "off") => setManualCoinPayment(e)}
                data={[
                  { label: "ON", value: "on" },
                  { label: "OFF", value: "off" },
                ]}
              />
            </div>

            <div className="w-full flex flex-col">
              <div className="font-semibold">Bank Transfer</div>
              <Select
                size="lg"
                value={bankTransfer}
                onChange={(e: "on" | "off") => setBankTransfer(e)}
                data={[
                  { label: "ON", value: "on" },
                  { label: "OFF", value: "off" },
                ]}
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

export default PaymentSetupModal;
