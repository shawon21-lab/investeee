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

const ChangeUserStatusModal = (props: ModalProps) => {
  const { opened, onClose, user } = props;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(user.status);

  const handler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/admin/users/change-status`, {
        status,
        userId: user._id,
      });
      if (data.error) throw new Error(data.error);
      toast.success(data.message);
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
      size="md"
      title={`Change ${user.fullname} status`}
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3 justify-between min-h-[200px]">
        <div>Block or Activate user</div>

        <div>
          <Select
            value={status}
            onChange={(e: "blocked" | "active") => setStatus(e)}
            data={[
              { label: "Block User", value: "blocked" },
              { label: "Activate User", value: "active" },
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

export default ChangeUserStatusModal;
