import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { isNumber } from "@/constants/isNumber";
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

const EmailSetupModal = (props: ModalProps) => {
  const { opened, onClose, company } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    host: company.emailSetup.host,
    port: company.emailSetup.port.toString(),
    secure: company.emailSetup.secure === true ? "yes" : "no",
    from: company.emailSetup.from,
    user: company.emailSetup.auth.user,
    pass: company.emailSetup.auth.pass,
  });

  const Handler = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/company/email-setup", {
        host: data.host,
        port: data.port,
        secure: data.secure,
        from: data.from,
        auth: { user: data.user, pass: data.pass },
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
      title="Setup Email"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div className="w-full flex gap-1 flex-col">
          <div className="text-rose-500 text-lg font-bold">Email Setup</div>

          <div className="w-full flex gap-x-2 gap-y-2 flex-col sm:flex-row items-center">
            <div className="w-full flex flex-col">
              <div className="font-semibold">Host:</div>
              <TextInput
                value={data.host}
                onChange={(e) => setData({ ...data, host: e.target.value })}
              />
            </div>

            <div className="w-full flex flex-col">
              <div className="font-semibold">Port:</div>
              <TextInput
                value={data.port}
                onChange={(e) => {
                  isNumber(+e.target.value) &&
                    setData({ ...data, port: e.target.value });
                }}
              />
            </div>
          </div>

          <div className="w-full flex gap-x-2 gap-y-2 flex-col sm:flex-row">
            <div className="w-full flex flex-col">
              <div className="font-semibold">Secure</div>
              <Select
                size="lg"
                value={data.secure}
                onChange={(e: string) => setData({ ...data, secure: e })}
                data={[
                  { label: "True", value: "yes" },
                  { label: "False", value: "no" },
                ]}
              />
            </div>
            <div className="w-full flex flex-col">
              <div className="font-semibold">From (Company Email):</div>
              <TextInput
                value={data.from}
                onChange={(e) => setData({ ...data, from: e.target.value })}
              />
            </div>
          </div>

          <div className="w-full flex gap-x-2 gap-y-2 flex-col sm:flex-row items-center">
            <div className="w-full flex flex-col">
              <div className="font-semibold">User(auth)(company Email):</div>
              <TextInput
                value={data.user}
                onChange={(e) => setData({ ...data, user: e.target.value })}
              />
            </div>

            <div className="w-full flex flex-col">
              <div className="font-semibold">Password(auth):</div>
              <TextInput
                value={data.pass}
                onChange={(e) => setData({ ...data, pass: e.target.value })}
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

export default EmailSetupModal;
