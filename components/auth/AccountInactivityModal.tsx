import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface AccountInactivityModalProps {
  opened: boolean;
  onClose: () => void;
  signUp: () => void;
  loading: boolean;
}

const AccountInactivityModal = (props: AccountInactivityModalProps) => {
  const { opened, onClose, signUp, loading } = props;
  const router = useRouter();

  const signUpHandler = async () => {
    signUp();
    onClose();
  };

  return (
    <ModalContainer
      title={`Account Inactivity Notice`}
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div>
          If you plan to change your country location after registration, please
          note that your account will be temporarily inactive for a few months
          during this transition. This measure ensures the security of your
          account. You will regain access once the transition is complete.
        </div>
        <div className="flex gap-3">
          <Button
            loading={loading}
            label="I Understand, Continue"
            onClick={signUpHandler}
          />
        </div>
      </div>
    </ModalContainer>
  );
};

export default AccountInactivityModal;
