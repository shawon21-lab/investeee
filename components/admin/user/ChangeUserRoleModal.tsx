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

const ChangeUserRoleModal = (props: ModalProps) => {
  const { opened, onClose, user } = props;
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(user.role);

  const handler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/admin/users/change-role`, {
        role,
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
      title={`Change ${user.fullname} role`}
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3 justify-between min-h-[230px]">
        <div>
          Changing a user to admin will give a user full access to the admin
          section.
        </div>

        <div>
          <Select
            size="md"
            value={role}
            onChange={(e: "admin" | "user") => setRole(e)}
            data={[
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
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

export default ChangeUserRoleModal;
