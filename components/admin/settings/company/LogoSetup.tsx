"use client";

import { Loader } from "@mantine/core";
import axios from "axios";
import { CldImage, CldOgImage, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";

const LogoSetup = ({ company }: { company: CompanyProps }) => {
  const [loading, setLoading] = useState(false);

  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;

  const uploadAvatarHandler = async (result: any, widget: any) => {
    try {
      widget.close();
      setLoading(true);
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

      const { data } = await axios.post("/api/company/logo-setup", {
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
      });

      if (data.error) throw new Error(data.error);
      location.reload();
    } catch (error: any) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!loading && (
        <div className="w-[100px] h-[auto]">
          <Image
            src={company.logo?.url}
            alt="logo"
            width={100}
            height={100}
            className="w-[100%] h-[100%]"
          />
        </div>
      )}

      {loading && <Loader color={primaryColor} />}

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET || ""}
        onUpload={uploadAvatarHandler}
      >
        {({ open }) => (
          <div
            onClick={() => open()}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div>Edit Logo</div>
            <FaEdit />
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default LogoSetup;
