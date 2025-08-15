import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import useCompany from "@/components/hooks/useCompany";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface DepositTypeModalProps {
  opened: boolean;
  onClose: () => void;
  setSelectedDepositType: (
    depositType:
      | "automatic-coin-payment"
      | "manual-coin-payment"
      | "bank-transfer"
      | ""
  ) => void;
}

// React.Dispatch<React.SetStateAction<string>>

const DepositTypeModal = (props: DepositTypeModalProps) => {
  const { opened, onClose, setSelectedDepositType } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { company } = useCompany();
  const isAutoCoinDepositDisabled =
    company?.payment.automaticCoinPayment === "off";
  const isManualCoinDepositDisabled =
    company?.payment.manualCoinPayment === "off";
  const isBankTransferDisabled = company?.payment.bankTransfer === "off";

  return (
    <ModalContainer title="Deposit" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <Button
          outline
          disabled={isAutoCoinDepositDisabled}
          loading={loading}
          label={`Automatic Coin Payment ${
            isAutoCoinDepositDisabled ? "(not available)" : ""
          } `}
          onClick={() => {
            onClose();
            setSelectedDepositType("automatic-coin-payment");
          }}
        />
        <Button
          disabled={isManualCoinDepositDisabled}
          loading={loading}
          label={`Manual Coin Payment ${
            isManualCoinDepositDisabled ? "(not available)" : ""
          }`}
          onClick={() => {
            onClose();
            setSelectedDepositType("manual-coin-payment");
          }}
        />

        <Button
          disabled={isBankTransferDisabled}
          loading={loading}
          label={`Bank Transfer ${
            isBankTransferDisabled ? "(not available)" : ""
          } `}
          onClick={() => {
            onClose();
            setSelectedDepositType("bank-transfer");
          }}
        />
      </div>
    </ModalContainer>
  );
};

export default DepositTypeModal;
