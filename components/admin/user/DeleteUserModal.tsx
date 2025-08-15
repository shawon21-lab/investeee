import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface DeleteUserModalProps {
  opened: boolean;
  onClose: () => void;
  user: userSchemaType;
}

const DeleteUserModal = (props: DeleteUserModalProps) => {
  const { opened, onClose, user } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `/api/admin/users/delete-user/${user._id}`
      );
      if (data.error) throw new Error(data.error);
      toast.success(`${user.fullname} Deleted`);
      router.push("/admin/users");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer
      title={`Delete ${user.fullname}`}
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div>
          Are you sure you want to delete {user.fullname}? all associated
          transactions will also be deleted.
        </div>
        <div className="flex gap-3">
          <Button outline loading={loading} label="Yes" onClick={handler} />
          <Button label="No" onClick={onClose} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default DeleteUserModal;
