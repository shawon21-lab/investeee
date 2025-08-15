import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { Textarea } from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import validator from "validator";

interface SendEmailModalProps {
  opened: boolean;
  onClose: () => void;
  user: userSchemaType;
}

const SendEmailModal = (props: SendEmailModalProps) => {
  const { opened, onClose, user } = props;
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({ message: "", subject: "" });

  const handler = async () => {
    try {
      if (
        validator.isEmpty(input.message.trim()) ||
        validator.isEmpty(input.subject.trim())
      )
        throw new Error("Input cannot be empty");

      setLoading(true);
      const { data } = await axios.post(`/api/admin/users/send-email`, {
        message: input.message.trim(),
        userId: user._id,
        subject: input.subject.trim(),
      });
      if (data.error) throw new Error(data.error);
      toast.success(`Email sent to ${user.fullname}: ${data}`);
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer
      title={`Email ${user.fullname}`}
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div>Use &apos;|&apos; to create a new paragraph for message.</div>

        <TextInput
          onChange={(e) => setInput({ ...input, subject: e.target.value })}
          placeholder="Subject"
          value={input.subject}
        />

        <Textarea
          placeholder="Enter message"
          minRows={3}
          maxRows={7}
          autosize
          value={input.message}
          onChange={(e) => setInput({ ...input, message: e.target.value })}
        />

        <div className="flex gap-3">
          <Button
            outline
            loading={loading}
            label="Send Email"
            onClick={handler}
          />
          <Button label="Close" onClick={onClose} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default SendEmailModal;
