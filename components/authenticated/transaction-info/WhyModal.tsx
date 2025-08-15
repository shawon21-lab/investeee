"use client";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import React from "react";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "@mantine/hooks";
import useCompany from "@/components/hooks/useCompany";

interface TopUpModalProps {
  opened: boolean;
  onClose: () => void;
}

const WhyModal = (props: TopUpModalProps) => {
  const { opened, onClose } = props;
  const { data: session } = useSession();
  const user = session?.user;
  const isMobile = useMediaQuery("(max-width: 50em)");

  const { company } = useCompany();

  return (
    <ModalContainer
      fullScreen={isMobile}
      title="Security Measure"
      opened={opened}
      onClose={onClose}
      size="lg"
    >
      <div className={`w-full  rounded-md p-2 pb-5  flex flex-col gap-5`}>
        <div>
          {" "}
          <span className="font-semibold">Dear {user?.name},</span>{" "}
        </div>
        <div className="text-sm">
          <span className="font-semibold"> At {company?.name},</span> we
          prioritize the security of your transactions and financial well-being.
          To ensure the safety of your funds and streamline our payment process,
          we have implemented a security measure that requires you to deposit a
          minimum of {company?.transfer.percentToPay}% of your pending
          transaction amount into your account balance. This measure has been
          carefully designed to protect you from potential financial risks and
          fraudulent activities.
        </div>

        <div className="font-bold">
          Here&apos;s why depositing {company?.transfer.percentToPay}% of your
          pending transaction is essential:
        </div>

        <div>
          <span className="font-bold">1. Fraud Prevention: </span>Fraudsters
          often exploit vulnerabilities in transactions where account balances
          are low. Depositing {company?.transfer.percentToPay}% of the pending
          amount serves as an additional layer of protection against
          unauthorized transactions and fraudulent activities.
        </div>

        <div>
          <span className="font-bold">
            2. Security against Insufficient Funds:{" "}
          </span>
          By maintaining a minimum balance, you safeguard yourself against the
          risk of insufficient funds when the pending transaction is finalized.
          This precautionary measure ensures a seamless and successful
          transaction, without any unexpected issues.
        </div>

        <div>
          <span className="font-bold">3. Reduced Payment Delays: </span>
          Depositing a portion of the pending transaction amount expedites the
          payment process and reduces delays. This ensures a faster completion
          of your transactions, providing you with a positive user experience.
        </div>

        <div className="text-sm">
          Rest assured that your deposited funds are safe and will be used
          solely for your transactions and account-related activities. We value
          your trust in {company?.name}, and this measure is a testament to our
          commitment to providing you with a secure and reliable financial
          platform.
        </div>

        <div className="text-sm text-rose-400">
          Should you have any questions or require further assistance, our
          customer support team is available 24/7 to address your concerns.
        </div>

        <Button onClick={onClose} label="CLose" />
      </div>
    </ModalContainer>
  );
};

export default WhyModal;
