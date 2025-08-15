import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
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

const WelcomeEmailSetupModal = (props: ModalProps) => {
  const { opened, onClose, company } = props;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"on" | "off">(
    company?.welcomeEmail?.status
  );
  const [emailMessage, setEmailMessage] = useState(
    company?.welcomeEmail.emailMessage
  );

  const Handler = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/company/welcome-email-setup", {
        status,
        emailMessage,
      });
      if (res.data.error) throw new Error(res.data.error);
      toast.success(res.data.message);
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
      title="Welcome Email"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3 min-h-[230px] justify-between">
        <div className="w-full flex gap-1 flex-col">
          <div
            style={{ color: company?.color?.primaryLight }}
            className="text-lg font-bold"
          >
            Setup Welcome Email
          </div>

          <div className="w-full flex gap-x-2 gap-y-2 flex-col items-center">
            <div className="w-full flex flex-col">
              <div className="font-semibold">
                Status(Activate or deactivate sending of welcome email)
              </div>
              <Select
                size="lg"
                value={status}
                onChange={(e: "on" | "off") => setStatus(e)}
                data={[
                  { label: "ON", value: "on" },
                  { label: "OFF", value: "off" },
                ]}
              />
            </div>

            <div className="w-full flex flex-col">
              <div className="font-semibold">Email Message</div>
              <TextInput
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
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

export default WelcomeEmailSetupModal;
