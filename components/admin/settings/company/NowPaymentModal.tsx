import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  company: CompanyProps;
}

const NowPaymentModal = (props: ModalProps) => {
  const { opened, onClose, company } = props;
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(company?.nowPaymentApi);

  const Handler = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`/api/company/now-payment`, {
        nowPaymentApi: input,
      });
      if (res.data.error) throw new Error(res.data.error);
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
      title="Add or Edit NowPayment Api"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div className="w-full flex gap-1 flex-col">
          <div className="text-rose-500 text-lg font-bold">
            Now Payment Setup <br />
            <span className="underline">
              <a href="https://nowpayments.io/">Visit website</a>
            </span>
          </div>

          <div className="w-full flex gap-x-2 gap-y-2 flex-col sm:flex-row">
            <div className="w-full flex flex-col">
              <div className="font-semibold">Now Payment API Key</div>
              <TextInput
                placeholder="Api Key"
                value={input}
                onChange={(e) => setInput(e.target.value)}
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

export default NowPaymentModal;
