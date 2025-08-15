import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { IconType } from "react-icons";
import { FaAngleRight } from "react-icons/fa";

interface PaymentCardProps {
  label?: string;
  icon?: IconType;
  logo?: string | StaticImport;
  onClick?: () => void;
  disabled?: boolean;
}

const PaymentCard = (props: PaymentCardProps) => {
  const { mode } = useTheme();
  const { label, logo, onClick, icon: Icon, disabled } = props;

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`w-full flex flex-col items-center 
       duration-200 transition 
       ${
         disabled
           ? "opacity-50 cursor-not-allowed"
           : "active:scale-[.95] sm:cursor-pointer"
       }`}
    >
      <div
        className={`w-[95%] sm:w-[60%] shadow-md 
          rounded-lg px-3 py-4 gap-2
          flex justify-between transition-all 
           duration-400
          ${
            mode === "light"
              ? "shadow-gray-200 hover:shadow-gray-300"
              : " shadow-[#1d1d1d] hover:shadow-[#585858]"
          } 
          `}
      >
        <div className="flex items-center gap-2">
          {logo && (
            <Image
              className="w-[auto] h-[auto]"
              width={40}
              height={40}
              alt="logo"
              src={logo}
            />
          )}
          {Icon && (
            <Icon
              color={mode === "light" ? primaryColor : primaryLightColor}
              size={24}
            />
          )}

          <div
            className={`font-semibold text-center 
              ${mode === "light" ? "text-slate-700" : "text-white"}
              `}
          >
            {label} {disabled && "(Not Available)"}
          </div>
        </div>
        <FaAngleRight
          color={mode === "light" ? primaryColor : primaryLightColor}
          size={24}
        />
      </div>
    </div>
  );
};

export default PaymentCard;
