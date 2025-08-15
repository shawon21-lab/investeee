import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { isNumber } from "@/constants/isNumber";
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

const TransferSetupModal = (props: ModalProps) => {
  const { opened, onClose, company } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    minimum: company?.transfer?.minimum.toString(),
    maximum: company?.transfer?.maximum.toString(),
    mode: company.transfer.mode,
    percentToPay: company.transfer.percentToPay.toString(),
    allowTransferIfPendingAvailable:
      company.transfer.allowTransferIfPendingAvailable,
  });

  const Handler = async () => {
    try {
      if (+data.minimum > +data.maximum)
        throw new Error("Minimum amount cannot be greater than maximum amount");
      setLoading(true);
      const res = await axios.post(`/api/company/transfer-setup`, {
        minimum: data.minimum,
        maximum: data.maximum,
        mode: data.mode,
        percentToPay: data.percentToPay,
        allowTransferIfPendingAvailable: data.allowTransferIfPendingAvailable,
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
      size="lg"
      title="Setup Transfer "
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-5 min-h-[350px] justify-between">
        <div className="w-full flex gap-3 flex-col">
          <div className="text-rose-500 text-lg font-bold">Transfer</div>

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

          <div className="w-full flex gap-x-2 gap-y-2 flex-col">
            <div className="w-full flex flex-col">
              <div className="font-semibold">
                Allow Users Make Transfers if they have pending balance?:
              </div>
              <Select
                size="lg"
                value={data.allowTransferIfPendingAvailable}
                onChange={(e: "yes" | "no") =>
                  setData({ ...data, allowTransferIfPendingAvailable: e })
                }
                data={[
                  { label: "YES Allow", value: "yes" },
                  { label: "NO Don't allow", value: "no" },
                ]}
              />
            </div>

            <div className="w-full flex flex-col">
              <div className="font-semibold">Transfer Mode</div>
              <Select
                size="lg"
                value={data.mode}
                onChange={(e: "direct-mode" | "pending-mode") =>
                  setData({ ...data, mode: e })
                }
                data={[
                  {
                    label:
                      "Direct Mode(Tranfers will go directly to Receiver's Account balance)",
                    value: "direct-mode",
                  },
                  {
                    label:
                      "Pending Mode(Tranfers will pass through Receiver's Pending balance)",
                    value: "pending-mode",
                  },
                ]}
              />
            </div>

            <div className="w-full flex flex-col">
              <div className="font-semibold">
                Receiver&apos;s Percentage Fee(%)
              </div>
              <div className="font-semibold">
                If the transfer mode is set to Pending mode, the receiver would
                have to deposite this percent before the pending amount is moved
                to their account balance.
              </div>
              <TextInput
                value={data.percentToPay}
                onChange={(e) => {
                  isNumber(+e.target.value) &&
                    setData({ ...data, percentToPay: e.target.value });
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

export default TransferSetupModal;
