import Button from "@/components/Button";
import ModalContainer from "@/components/modals/ModalContainer";
import React, { useState } from "react";

interface DeleteUserModalProps {
  opened: boolean;
  onClose: () => void;
  onDelete: () => void;
  loading: boolean;
}

const DeleteCardModal = (props: DeleteUserModalProps) => {
  const { opened, onClose, onDelete, loading } = props;

  return (
    <ModalContainer title={`Delete Card`} opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div>Are you sure you want to delete this card</div>
        <div className="flex gap-3">
          <Button outline loading={loading} label="Yes" onClick={onDelete} />
          <Button label="No" onClick={onClose} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default DeleteCardModal;
