"use client";
import { signOut, useSession } from "next-auth/react";
import Button from "@/components/Button";
import ImportWallerModal from "@/components/authenticated/account/ImportWalletModal";
import PersonalDetail from "@/components/authenticated/account/PersonalDetail";
import WalletAddress from "@/components/authenticated/account/WalletAddress";
import useTheme from "@/components/hooks/useTheme";
import { Accordion, Avatar, Loader } from "@mantine/core";
import React, { useState } from "react";
import {
  FaEdit,
  FaExclamation,
  FaFileImport,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IoMdPerson } from "react-icons/io";
import { CldUploadWidget } from "next-cloudinary";
import axios from "axios";
import AboutUsModal from "./AboutUsModal";
import useCompany from "@/components/hooks/useCompany";

const Account = ({ user }: { user: userSchemaType }) => {
  const { mode } = useTheme();
  const [importWalletModal, setImportWalletmodal] = useState(false);
  // const [aboutUsModal, setAboutUsModal] = useState(false);
  const [loadingSignOut, setLoadingSignOut] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const userSession = session?.user as { role: string } | undefined;
  const isAdmin = userSession?.role === "admin";

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;

  const signOutHandler = async () => {
    setLoadingSignOut(true);
    try {
      await signOut();
      toast.success("Logged Out");
    } catch (error: any) {
      toast.error(error?.message);
      setLoadingSignOut(false);
    }
  };

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

      const { data } = await axios.post("/api/users/upload-avatar", {
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
    } catch (error: any) {
      toast.error(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col items-center gap-8 pb-7 
      ${mode === "light" ? "text-slate-700" : "text-white"}`}
      >
        <div
          className={`text-xl sm:text-2xl font-bold 
        flex justify-center
      ${mode === "light" ? "text-slate-700" : "text-white"}`}
        >
          Account
        </div>

        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET || ""}
          onUpload={uploadAvatarHandler}
        >
          {({ open }) => (
            <div
              onClick={(e) => {
                e.preventDefault();
                open();
              }}
              className="flex justify-center flex-col 
               items-center sm:cursor-pointer"
            >
              {user.avatar?.url && (
                <Avatar
                  src={user.avatar.url}
                  alt="its me"
                  size="xl"
                  radius="md"
                />
              )}

              {!user.avatar?.url && (
                <Avatar alt="its me" size="xl" radius="md">
                  {!loading && <IoMdPerson />}
                  {loading && (
                    <Loader
                      color={
                        mode === "light" ? primaryColor : primaryLightColor
                      }
                    />
                  )}
                </Avatar>
              )}

              <div className="flex items-center gap-1">
                Edit Picture <FaEdit />
              </div>
            </div>
          )}
        </CldUploadWidget>

        <div className="flex flex-col gap-1 items-center">
          <div>Invite Friends.</div>
          <div>{`${company?.baseUrl}/register/${user.username}`}</div>
          <div>Share Referral Link</div>
        </div>

        <Accordion className="w-full" defaultValue="Account">
          <PersonalDetail user={user} />
          {/* <WalletAddress /> */}
        </Accordion>

        {/* <div
          onClick={() => setAboutUsModal(true)}
          className="flex items-center gap-1 sm:cursor-pointer"
        >
          <div>About Us</div> <FaExclamation />
        </div> */}

        <div
          className={`flex flex-col items-center 
      justify-center w-full sm:w-[60%] 
      gap-3`}
        >
          {isAdmin && (
            <Button
              onClick={() => router.push("/admin/dashboard")}
              label="Switch to admin"
            />
          )}
          <div
            className={`text-center 
        ${mode === "light" ? "text-slate-700" : "text-white"}`}
          >
            Do you have an existing crypto wallet? You can easly import your
            external wallet balance to your {company?.name} balance.
          </div>
          <Button
            icon={FaFileImport}
            outline
            label="Import Wallet"
            onClick={() => setImportWalletmodal(true)}
          />
        </div>

        <div
          onClick={signOutHandler}
          className={`flex items-center gap-3 
              cursor-pointer font-medium 
              ${mode === "light" ? "text-slate-700" : "text-white"}`}
        >
          Sign Out
          {loadingSignOut ? (
            <Loader color={primaryLightColor} />
          ) : (
            <FaSignOutAlt
              color={mode === "light" ? primaryColor : primaryLightColor}
            />
          )}
        </div>
      </div>

      <ImportWallerModal
        opened={importWalletModal}
        onClose={() => setImportWalletmodal(false)}
      />

      {/* <AboutUsModal
        opened={aboutUsModal}
        onClose={() => setAboutUsModal(false)}
      /> */}
    </>
  );
};

export default Account;
