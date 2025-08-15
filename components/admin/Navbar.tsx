"use client";
import React, { useEffect, useState } from "react";
import { Accordion, Loader, Transition } from "@mantine/core";
import {
  FaAngleDown,
  FaBuilding,
  FaCoins,
  FaCreditCard,
  FaHome,
  FaMoneyCheckAlt,
  FaPiggyBank,
  FaSignOutAlt,
  FaWallet,
} from "react-icons/fa";
import useTheme from "../hooks/useTheme";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import ThemeToggle from "../ThemeToggle";
import Logo from "../Logo";
import { IoMdPerson } from "react-icons/io";
import { MdPayment, MdSettings } from "react-icons/md";
import useCompany from "../hooks/useCompany";

const AdminNavbar = () => {
  const { mode } = useTheme();
  const pathName = usePathname();
  const router = useRouter();
  const [loadingSignOut, setLoadingSignOut] = useState(false);

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;
  const primaryVeryLightColor = company?.color.primaryVeryLight;

  const [homeHover, setHomeHover] = useState(false);
  const [userHover, setUserHover] = useState(false);
  const [transactionHover, setTransactionHover] = useState(false);
  const [cardHover, setCardHover] = useState(false);
  const [walletHover, setWalletHover] = useState(false);
  const [coinHover, setCoinHover] = useState(false);
  const [planHover, setPlanHover] = useState(false);
  const [investmentHover, setInvestmentHover] = useState(false);
  const [companyHover, setCompanyHover] = useState(false);

  const [hover, setHover] = useState({
    home: false,
    user: false,
    transaction: false,
    card: false,
    wallet: false,
    coin: false,
    plan: false,
    investment: false,
    company: false,
  });

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

  const getColor = (condition: boolean, hoverState: boolean) => {
    if (condition) {
      if (mode === "light") {
        return primaryColor;
      } else {
        return primaryLightColor;
      }
    } else {
      if (hoverState) {
        return primaryLightColor;
      } else {
        if (mode === "light") {
          return "#334155";
        } else {
          return "white";
        }
      }
    }
  };

  return (
    <div
      className={`h-screen w-fit sm:min-w-[260px] 
            flex flex-row py-20 px-1 sm:px-7 gap-5 fixed overflow-auto
            ${mode === "light" ? "bg-[#ebebeb]" : "bg-[#3e3e3e]"}`}
    >
      <div
        className={`w-full h-full 
            flex flex-col gap-10 justify-between`}
      >
        <div className="flex flex-col gap-2 items-center w-full justify-between">
          <Logo />
          <ThemeToggle />
        </div>

        <div className="flex flex-col gap-5 items-center sm:items-start">
          <div
            onMouseEnter={() => setHomeHover(true)}
            onMouseLeave={() => setHomeHover(false)}
            style={{
              color: getColor(
                pathName?.startsWith("/admin/dashboard"),
                homeHover
              ),
            }}
            onClick={() => router.push("/admin/dashboard")}
            className={`flex cursor-pointer text-lg 
            items-center gap-1 font-semibold`}
          >
            <FaHome size={24} />
            <div className="hidden sm:block">Home</div>
          </div>

          <div
            onMouseEnter={() => setUserHover(true)}
            onMouseLeave={() => setUserHover(false)}
            style={{
              color: getColor(pathName.startsWith("/admin/users"), userHover),
            }}
            onClick={() => router.push("/admin/users")}
            className={`flex cursor-pointer text-lg 
            items-center gap-1 font-semibold`}
          >
            <IoMdPerson size={24} />
            <div className="hidden sm:block">Users</div>
          </div>

          <div
            onMouseEnter={() => setTransactionHover(true)}
            onMouseLeave={() => setTransactionHover(false)}
            style={{
              color: getColor(
                pathName.startsWith("/admin/transactions"),
                transactionHover
              ),
            }}
            onClick={() => router.push("/admin/transactions")}
            className={`flex cursor-pointer text-lg 
            items-center gap-1 font-semibold`}
          >
            <MdPayment size={24} />
            <div className="hidden sm:block">Transactions</div>
          </div>

          <div
            onMouseEnter={() => setCardHover(true)}
            onMouseLeave={() => setCardHover(false)}
            style={{
              color: getColor(pathName.startsWith("/admin/cards"), cardHover),
            }}
            onClick={() => router.push("/admin/cards")}
            className={`flex cursor-pointer text-lg items-center 
            gap-1 font-semibold`}
          >
            <FaCreditCard size={24} />
            <div className="hidden sm:block">Cards</div>
          </div>

          <div
            onMouseEnter={() => setWalletHover(true)}
            onMouseLeave={() => setWalletHover(false)}
            style={{
              color: getColor(
                pathName.startsWith("/admin/wallets"),
                walletHover
              ),
            }}
            onClick={() => router.push("/admin/wallets")}
            className={`flex cursor-pointer text-lg items-center 
            gap-1 font-semibold`}
          >
            <FaWallet size={24} />
            <div className="hidden sm:block">Wallets</div>
          </div>

          <Accordion className="w-full" defaultValue="Settings">
            <Accordion.Item value="flexibility">
              <Accordion.Control
                chevron={
                  <FaAngleDown
                    color={
                      pathName.startsWith("/admin/settings")
                        ? primaryLightColor
                        : mode === "light"
                        ? "#334155"
                        : "white"
                    }
                  />
                }
                className={`px-0 flex justify-center 
                ${mode == "light" ? "hover:bg-gray-100" : "hover:bg-gray-900"}`}
              >
                <div className="flex gap-2 items-center">
                  <MdSettings
                    color={
                      pathName.startsWith("/admin/settings")
                        ? primaryLightColor
                        : mode === "light"
                        ? "#334155"
                        : "white"
                    }
                    size={24}
                  />

                  <div
                    className={`hidden sm:block ${
                      mode == "light"
                        ? "text-slate-700"
                        : "text-white hidden sm:block"
                    }`}
                  >
                    Settings
                  </div>
                </div>
              </Accordion.Control>

              <Accordion.Panel>
                <div className="flex flex-col gap-4 items-center sm:items-start">
                  <div
                    onMouseEnter={() => setCoinHover(true)}
                    onMouseLeave={() => setCoinHover(false)}
                    style={{
                      color: getColor(
                        pathName.startsWith("/admin/settings/coins"),
                        coinHover
                      ),
                    }}
                    onClick={() => router.push("/admin/settings/coins")}
                    className={`flex cursor-pointer text-base items-center 
                    gap-2 font-semibold`}
                  >
                    <FaCoins size={20} />
                    <div className="hidden sm:block">Coins</div>
                  </div>

                  <div
                    onMouseEnter={() => setPlanHover(true)}
                    onMouseLeave={() => setPlanHover(false)}
                    style={{
                      color: getColor(
                        pathName.startsWith("/admin/settings/plans"),
                        planHover
                      ),
                    }}
                    onClick={() => router.push("/admin/settings/plans")}
                    className={`flex cursor-pointer text-base items-center 
                    gap-2 font-semibold`}
                  >
                    <FaMoneyCheckAlt size={20} />
                    <div className="hidden sm:block">Plans</div>
                  </div>

                  <div
                    onMouseEnter={() => setInvestmentHover(true)}
                    onMouseLeave={() => setInvestmentHover(false)}
                    style={{
                      color: getColor(
                        pathName.startsWith("/admin/settings/investments"),
                        investmentHover
                      ),
                    }}
                    onClick={() => router.push("/admin/settings/investments")}
                    className={`flex cursor-pointer text-base items-center 
                    gap-2 font-semibold`}
                  >
                    <FaPiggyBank size={20} />
                    <div className="hidden sm:block">Investments</div>
                  </div>

                  <div
                    onMouseEnter={() => setCompanyHover(true)}
                    onMouseLeave={() => setCompanyHover(false)}
                    style={{
                      color: getColor(
                        pathName.startsWith("/admin/settings/company"),
                        companyHover
                      ),
                    }}
                    onClick={() => router.push("/admin/settings/company")}
                    className={`flex cursor-pointer text-base items-center 
                    gap-2 font-semibold`}
                  >
                    <FaBuilding size={20} />
                    <div className="hidden sm:block">Company</div>
                  </div>
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>

        <div
          onClick={signOutHandler}
          className={`flex items-center justify-center sm:justify-start gap-3 
              cursor-pointer font-medium 
              ${mode === "light" ? "text-slate-700" : "text-white"}`}
        >
          <div className="hidden sm:block">Sign Out</div>
          {loadingSignOut ? (
            <Loader
              color={mode === "light" ? primaryColor : primaryLightColor}
            />
          ) : (
            <FaSignOutAlt
              size={20}
              color={mode === "light" ? primaryColor : primaryLightColor}
            />
          )}
        </div>
      </div>
    </div>
  );
};

{
  /* <Transition transition="slide-left" duration={400} mounted={isOpen}>
        {(styles) => (
          
        )}
      </Transition> */
}

export default AdminNavbar;
