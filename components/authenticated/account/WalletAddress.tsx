import useTheme from "@/components/hooks/useTheme";
import { Accordion, CopyButton } from "@mantine/core";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React from "react";
import { toast } from "react-hot-toast";
import { IconType } from "react-icons";
import { FaWallet, FaAngleDown } from "react-icons/fa";
import { IoMdCopy } from "react-icons/io";

interface WalletCardProps {
  icon?: IconType;
  logo?: StaticImport | string;
  walletName?: string;
  walletAddress?: string;
  info?: string;
}

export const WalletCard = (props: WalletCardProps) => {
  const { icon: Icon, walletName, walletAddress, info, logo } = props;
  const { mode } = useTheme();

  return (
    <CopyButton value={walletAddress ? walletAddress : ""}>
      {({ copied, copy }) => (
        <div
          onClick={() => {
            copy();
            toast.success("Wallet address copied");
          }}
          className={`shadow-md w-full 
          rounded-md flex items-center 
          justify-between p-4 gap-3 
          sm:cursor-pointer select-none active:scale-95 
          transition-all duration-200 
          ${mode === "light" ? "" : "shadow-[#3d3d3d] hover:shadow-[#4f4f4f]"} 
          ${copied ? "bg-rose-300" : "bg-inherit"}`}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <Icon
                size={24}
                className={`flex-shrink-0 
            ${mode === "light" ? "text-rose-500" : "text-rose-300"}`}
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
                className={`font-bold text-lg 
            ${mode === "light" ? "text-rose-400" : "text-rose-200"}`}
              >
                {walletName}
              </div>

              <div
                className={`font-normal text-sm mb-2 
            ${mode === "light" ? "text-gray-500" : "text-gray-300"}`}
              >
                {info}
              </div>

              <div
                className={`font-medium text-xs select-text 
            border-t py-1 
            ${
              mode === "light"
                ? "text-gray-500 border-gray-200"
                : "text-gray-300 border-gray-600"
            }`}
              >
                {walletAddress}
              </div>
            </div>
          </div>

          <IoMdCopy
            size={24}
            className={`flex-shrink-0 
            ${mode === "light" ? "text-rose-500" : "text-rose-300"}`}
          />
        </div>
      )}
    </CopyButton>
  );
};

const WalletAddress = () => {
  const { mode } = useTheme();

  return (
    <Accordion.Item value="flexibility">
      <Accordion.Control
        chevron={
          <FaAngleDown
            className={`${
              mode === "light" ? "text-rose-500" : "text-rose-300"
            }`}
          />
        }
        className={`
        ${mode == "light" ? "hover:bg-gray-100" : "hover:bg-gray-900"}`}
      >
        <div className="flex gap-2 py-2 items-center">
          <FaWallet
            size={24}
            className={`${mode == "light" ? "text-rose-500" : "text-rose-300"}`}
          />

          <div
            className={`${mode == "light" ? "text-slate-700" : "text-white"}`}
          >
            Wallet address
          </div>
        </div>
      </Accordion.Control>

      <Accordion.Panel>
        <div className={`${mode == "light" ? "text-slate-700" : "text-white"}`}>
          Note: These are your personal address, any transaction sent to these
          wallets will be added to your account balance.
        </div>

        <div className="flex flex-col gap-5 py-2">
          <WalletCard
            walletAddress="bc1q5vdxnmpuj5207mku92z0g7mdgccnzafjzgss2w"
            info="Copy, and send only Bitcoin (BTC - Mainnet) to this wallet address:"
            walletName="Bitcoin"
            logo={"/bitcoin-logo.svg"}
          />

          <WalletCard
            walletAddress="TS3jYSnMvLH1SN4PsE5qqznWaac94WHbJt"
            walletName="Tether (USDT)"
            info="Copy, and send only Tether USD (TRC20 - Tron) to this wallet address:"
            logo="/tether-usdt-logo.svg"
          />

          <WalletCard
            walletAddress="bnb1djrx6gl50tmv7mjlhlkcghnj7h9eak0q7auaju"
            walletName="BNB"
            info="Copy, and send only BNB (BNB - Mainnet) to this wallet address:"
            logo="/bnb-logo.svg"
          />

          <WalletCard
            walletAddress="rskpWrgno88AvR5GbHtr38f48oMBrojdoN"
            walletName="XRP"
            info="Copy, and send only XRP (XRP - Mainnet) to this wallet address:"
            logo="/xrp-logo.svg"
          />
        </div>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default WalletAddress;
