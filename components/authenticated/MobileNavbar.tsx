"use client";
import React, { useEffect, useState } from "react";
import { Loader, Transition } from "@mantine/core";
import {
  FaCreditCard,
  FaHome,
  FaPaperPlane,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import useMobileNavbar from "../hooks/useMobileNavbar";
import useTheme from "../hooks/useTheme";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import useCompany from "../hooks/useCompany";

const MobileNavbar = () => {
  const { isOpen, onClose } = useMobileNavbar();
  const { mode } = useTheme();
  const pathName = usePathname();
  const router = useRouter();
  const [loadingSignOut, setLoadingSignOut] = useState(false);

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;
  const primaryVeryLightColor = company?.color.primaryVeryLight;

  const [homeHover, setHomeHover] = useState(false);
  const [moneyHover, setMoneyHover] = useState(false);
  const [cardHover, setCardHover] = useState(false);

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

  useEffect(() => {
    onClose();
  }, [onClose, pathName]);

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

  return (
    <>
      <Transition transition="slide-left" duration={400} mounted={isOpen}>
        {(styles) => (
          <div
            onClick={onClose}
            style={styles}
            className="fixed z-40 bg-[#00000077] inset-0 sm:hidden"
          />
        )}
      </Transition>

      <Transition transition="slide-left" duration={400} mounted={isOpen}>
        {(styles) => (
          <div
            style={styles}
            className={`z-50 h-screen min-w-[260px] 
            w-[50vw] sm:hidden fixed right-0 
            flex flex-row py-24 px-7 gap-5
            ${mode === "light" ? "bg-white" : "bg-[#121212]"}`}
          >
            <div
              className={`w-full h-full 
            flex flex-col gap-10 justify-between`}
            >
              <div className="flex justify-center">
                <FaTimes
                  onClick={onClose}
                  className={`cursor-pointer
                  ${mode === "light" ? "text-slate-700" : "text-white"}`}
                  size={30}
                />
              </div>

              <div className="flex flex-col gap-5">
                <div
                  onMouseEnter={() => setHomeHover(true)}
                  onMouseLeave={() => setHomeHover(false)}
                  style={{
                    color: getColor(pathName.startsWith("/home"), homeHover),
                  }}
                  onClick={() => router.push("/home")}
                  className={`flex cursor-pointer 
        text-lg items-center gap-1 font-semibold`}
                >
                  Home
                  <FaHome />
                </div>

                <div
                  onMouseEnter={() => setMoneyHover(true)}
                  onMouseLeave={() => setMoneyHover(false)}
                  style={{
                    color: getColor(
                      pathName.startsWith("/send-money"),
                      moneyHover
                    ),
                  }}
                  onClick={() => router.push("/send-money")}
                  className={`flex cursor-pointer text-lg 
                  items-center gap-1 font-semibold`}
                >
                  Send Money
                  <FaPaperPlane />
                </div>

                <div
                  onMouseEnter={() => setCardHover(true)}
                  onMouseLeave={() => setCardHover(false)}
                  style={{
                    color: getColor(pathName.startsWith("/card"), cardHover),
                  }}
                  onClick={() => router.push("/card")}
                  className={`flex cursor-pointer text-lg items-center 
                  gap-1 font-semibold`}
                >
                  Cards
                  <FaCreditCard />
                </div>
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
          </div>
        )}
      </Transition>
    </>
  );
};

export default MobileNavbar;
