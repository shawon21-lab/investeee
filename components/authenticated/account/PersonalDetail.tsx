import Button from "@/components/Button";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { Accordion, CopyButton } from "@mantine/core";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import { IconType } from "react-icons";
import {
  FaAddressBook,
  FaAngleDown,
  FaCalendar,
  FaCity,
  FaEdit,
  FaFlag,
  FaPhone,
} from "react-icons/fa";
import { IoMdCopy, IoMdMail, IoMdPerson } from "react-icons/io";

interface DetailCardProps {
  icon?: IconType;
  logo?: StaticImport | string;
  label?: string;
  content?: string;
}

const DetailCard = (props: DetailCardProps) => {
  const { icon: Icon, label, content, logo } = props;
  const { mode } = useTheme();

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;
  const primaryVeryLightColor = company?.color.primaryVeryLight;

  return (
    <CopyButton value={content ? content : ""}>
      {({ copied, copy }) => (
        <div
          style={{
            backgroundColor: copied ? primaryVeryLightColor : "inherit",
          }}
          onClick={() => {
            copy();
            toast.success(`${label} copied`);
          }}
          className={`shadow-md w-full 
            rounded-md flex items-center 
            justify-between p-4 gap-3 
            sm:cursor-pointer select-none active:scale-95 
            transition-all duration-200 
            ${
              mode === "light" ? "" : "shadow-[#3d3d3d] hover:shadow-[#4f4f4f]"
            } `}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon
                color={mode === "light" ? primaryColor : primaryLightColor}
                size={21}
                className={`flex-shrink-0`}
              />
            )}

            {logo && (
              <Image
                className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px]"
                width={40}
                height={40}
                alt="logo"
                src={logo}
              />
            )}

            <div className="flex flex-col">
              <div
                style={{
                  color:
                    mode === "light"
                      ? primaryLightColor
                      : primaryVeryLightColor,
                }}
                className={`font-semibold text-[16px]`}
              >
                {label}
              </div>

              <div
                className={`font-normal text-sm
              ${mode === "light" ? "text-gray-500" : "text-gray-300"}`}
              >
                {content}
              </div>
            </div>
          </div>

          <IoMdCopy
            color={mode === "light" ? primaryColor : primaryLightColor}
            size={24}
            className={`flex-shrink-0 `}
          />
        </div>
      )}
    </CopyButton>
  );
};

const PersonalDetail = ({ user }: { user: userSchemaType }) => {
  const { mode } = useTheme();
  const router = useRouter();
  const {
    fullname,
    email,
    username,
    phoneNumber,
    dateOfBirth,
    country,
    city,
    address,
  } = user;

  const filteredUser = {
    fullname,
    email,
    username,
    phoneNumber,
    dateOfBirth,
    country,
    city,
    address,
  };

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;

  return (
    <Accordion.Item value="customization">
      <Accordion.Control
        chevron={
          <FaAngleDown
            color={mode === "light" ? primaryColor : primaryLightColor}
          />
        }
        className={`
        ${mode == "light" ? "hover:bg-gray-100" : "hover:bg-gray-900"}`}
      >
        <div className="flex gap-2 py-2 items-center">
          <IoMdPerson
            size={24}
            color={mode === "light" ? primaryColor : primaryLightColor}
          />
          <div
            className={`${mode == "light" ? "text-slate-700" : "text-white"}`}
          >
            Personal Details
          </div>
        </div>
      </Accordion.Control>
      <Accordion.Panel>
        <div className="flex flex-col sm:flex-row items-center gap-4 py-2 ">
          <DetailCard
            label="Full Name"
            icon={IoMdPerson}
            content={user.fullname}
          />

          <DetailCard label="Email" icon={IoMdMail} content={user.email} />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 py-2 ">
          <DetailCard
            label="User Name"
            icon={IoMdPerson}
            content={user.username}
          />

          {user.phoneNumber && (
            <DetailCard
              label="Phone Number"
              icon={FaPhone}
              content={user.phoneNumber}
            />
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 py-2 ">
          {user.dateOfBirth && (
            <DetailCard
              label="Date of birth"
              icon={FaCalendar}
              content={user.dateOfBirth}
            />
          )}

          {user.country && (
            <DetailCard label="Country" icon={FaFlag} content={user.country} />
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 py-2 ">
          {user.city && (
            <DetailCard label="City/Sate" icon={FaCity} content={user.city} />
          )}

          {user.address && (
            <DetailCard
              label={user.address}
              icon={FaAddressBook}
              content="no. 10 bingo street"
            />
          )}
        </div>

        <Button
          icon={FaEdit}
          label={"Edit info"}
          onClick={() =>
            router.push(
              `/account/edit-info?user=${JSON.stringify(filteredUser)}`
            )
          }
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default PersonalDetail;
