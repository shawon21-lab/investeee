import Button from "@/components/Button";
import ModalContainer from "@/components/modals/ModalContainer";
import { Select } from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  user: userSchemaType;
}

const ResetPasswordModal = (props: ModalProps) => {
  const { opened, onClose, user } = props;
  const [loading, setLoading] = useState(false);
  const [notifyUser, setNotifyUser] = useState<"yes" | "no">("no");

  const handler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/admin/users/reset-password`, {
        notifyUser,
        userId: user._id,
      });
      if (data.error) throw new Error(data.error);
      toast.success(`Password hs been reset`);
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer
      title={`Reset ${user.fullname} password`}
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3 justify-between min-h-[220px]">
        <div>
          Are you sure you want to reset {user.fullname} password? Password
          would be reset to *12345*
        </div>

        <div>
          <div>Do you want to notify this user via email?</div>
          <Select
            value={notifyUser}
            onChange={(e: "yes" | "no") => setNotifyUser(e)}
            data={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
        </div>

        <div className="flex gap-3">
          <Button
            outline
            loading={loading}
            label="Continue"
            onClick={handler}
          />
          <Button label="Close" onClick={onClose} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default ResetPasswordModal;
