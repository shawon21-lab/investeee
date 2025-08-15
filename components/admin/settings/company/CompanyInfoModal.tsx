import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FaUpload } from "react-icons/fa";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  company: CompanyProps;
}

const CompanyInfoModal = (props: ModalProps) => {
  const { opened, onClose, company } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: company?.name,
    baseUrl: company?.baseUrl,
    address: company?.address,
    title: company.head.title,
    iconUrl: company.head.iconUrl,
    description: company.head.description,
  });

  const uploadIconHandler = async (result: any, widget: any) => {
    widget.close();
    const {
      public_id,
      url,
      secure_url,
      format,
      width,
      height,
      bytes,
      original_filename,
      created_at,
      etag,
      thumbnail_url,
    } = result.info;
    setData({ ...data, iconUrl: secure_url });
    toast.success(
      "Icon Url generated. You can now click on the update button to continue"
    );
  };

  const removeSlash = (url: string): string => {
    if (!url.endsWith("/")) {
      return url;
    } else {
      const firstUrl = url.split("");
      firstUrl.pop();
      const finalUrl = firstUrl.join("");
      return removeSlash(finalUrl);
    }
  };

  const Handler = async () => {
    const formattedUrl = removeSlash(data.baseUrl);
    try {
      setLoading(true);
      const res = await axios.post("/api/company/company-info", {
        name: data.name,
        baseUrl: formattedUrl,
        address: data.address,
        title: data.title,
        iconUrl: data.iconUrl,
        description: data.description,
      });
      if (res.data.error) throw new Error(res.data.error);
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
      title="Edit Company Info"
      opened={opened}
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <div className="w-full flex gap-3 flex-col">
          <div className="text-rose-500 text-lg font-bold">Company Info</div>

          <div className="w-full flex gap-x-2 gap-y-2 flex-col sm:flex-row">
            <div className="w-full flex flex-col">
              <div className="font-semibold">Company Name</div>
              <TextInput
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>

            <div className="w-full flex flex-col">
              <div className="font-semibold">Company Base Url</div>
              <TextInput
                value={data.baseUrl}
                onChange={(e) => setData({ ...data, baseUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="w-full flex gap-x-2 gap-y-2 flex-col sm:flex-row">
            <div className="w-full flex flex-col">
              <div className="font-semibold">Company Title(Metadata)</div>
              <TextInput
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>

            <div className="w-full gap-1  flex flex-col">
              <div className="font-semibold">
                Icon Url(Enter icon Url or Upload)
              </div>
              <TextInput
                value={data.iconUrl}
                onChange={(e) => setData({ ...data, iconUrl: e.target.value })}
              />

              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET || ""}
                onUpload={uploadIconHandler}
              >
                {({ open }) => (
                  <Button
                    icon={FaUpload}
                    outline
                    label={"Upload Icon"}
                    onClick={() => open()}
                    small
                  />
                )}
              </CldUploadWidget>
            </div>
          </div>

          <div className="w-full flex flex-col">
            <div className="font-semibold">Company Description</div>
            <TextInput
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </div>

          <div className="w-full flex flex-col">
            <div className="font-semibold">Company Address</div>
            <TextInput
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <Button loading={loading} label="Update" onClick={Handler} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default CompanyInfoModal;
