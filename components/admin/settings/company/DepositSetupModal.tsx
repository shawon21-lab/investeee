import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { isNumber } from "@/constants/isNumber";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  company: CompanyProps;
}

const DepositSetupModal = (props: ModalProps) => {
  const { opened, onClose, company } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    minimum: company?.desposit?.minimum.toString(),
    maximum: company?.desposit?.maximum.toString(),
  });

  const Handler = async () => {
    try {
      if (+data.minimum > +data.maximum)
        throw new Error("Minimum amount cannot be greater than maximum amount");
      setLoading(true);
      const res = await axios.post(`/api/company/deposit-setup`, {
        minimum: data.minimum,
        maximum: data.maximum,
      });
      if (res.data.error) throw new Error(res.data.error);
      location.reload();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer title="Setup Deposit" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="w-full flex gap-1 flex-col">
          <div className="text-rose-500 text-lg font-bold">Deposit</div>

          <div className="w-full flex gap-x-2 gap-y-2 flex-col sm:flex-row">
            <div className="w-full flex flex-col">
              <div className="font-semibold">Minimum Amount</div>
              <TextInput
                value={data.minimum}
                onChange={(e) => {
                  isNumber(+e.target.value) &&
                    setData({ ...data, minimum: e.target.value });
                }}
              />
            </div>

            <div className="w-full flex flex-col">
              <div className="font-semibold">Maximum Amount</div>
              <TextInput
                value={data.maximum}
                onChange={(e) => {
                  isNumber(+e.target.value) &&
                    setData({ ...data, maximum: e.target.value });
                }}
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

export default DepositSetupModal;
