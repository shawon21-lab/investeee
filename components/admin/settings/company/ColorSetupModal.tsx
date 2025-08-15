import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import { ColorPicker } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  company: CompanyProps;
}

const ColorSetupModal = (props: ModalProps) => {
  const { opened, onClose, company } = props;
  const [loading, setLoading] = useState(false);

  const [primary, setPrimary] = useState(company.color.primary);
  const [primaryLight, setPrimaryLight] = useState(company.color.primaryLight);
  const [primaryVeryLight, setPrimaryVeryLight] = useState(
    company.color.primaryVeryLight
  );

  const Handler = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/company/color-setup", {
        primary,
        primaryLight,
        primaryVeryLight,
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
      title="Switch Site Color"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div className="w-full flex gap-1 flex-col">
          <div className="text-rose-500 text-lg font-bold">Website Color</div>

          <div className="w-full flex gap-x-2 gap-y-2 flex-col sm:flex-row">
            <div className="w-full flex flex-col gap-2">
              <div className="font-semibold">Primary</div>
              <div
                style={{ backgroundColor: primary }}
                className={`h-[40px] rounded-md flex 
                justify-center items-center`}
              >
                PREVIEW
              </div>
              <ColorPicker
                size="xs"
                format="hex"
                fullWidth={true}
                withPicker={true}
                value={primary}
                onChange={setPrimary}
              />
              <TextInput
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <div className="font-semibold">Primary Light</div>
              <div
                style={{ backgroundColor: primaryLight }}
                className={`h-[40px] rounded-md flex 
                justify-center items-center`}
              >
                PREVIEW
              </div>
              <ColorPicker
                size="xs"
                format="hex"
                fullWidth={true}
                value={primaryLight}
                onChange={setPrimaryLight}
              />
              <TextInput
                value={primaryLight}
                onChange={(e) => setPrimaryLight(e.target.value)}
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <div className="font-semibold">Primary Very Light</div>
              <div
                style={{ backgroundColor: primaryVeryLight }}
                className={`h-[40px] rounded-md flex 
                justify-center items-center`}
              >
                PREVIEW
              </div>
              <ColorPicker
                size="xs"
                format="hex"
                fullWidth={true}
                value={primaryVeryLight}
                onChange={setPrimaryVeryLight}
              />
              <TextInput
                value={primaryVeryLight}
                onChange={(e) => setPrimaryVeryLight(e.target.value)}
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

export default ColorSetupModal;
