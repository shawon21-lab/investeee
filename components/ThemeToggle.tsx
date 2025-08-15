"use client";
import React from "react";
import useTheme from "./hooks/useTheme";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import useCompany from "./hooks/useCompany";

const ThemeToggle = () => {
  const { mode, onLightMode, onDarkMode } = useTheme();
  const { company } = useCompany();
  const primaryColor = company?.color.primary;

  return (
    <>
      {mode === "dark" && (
        <IoMdSunny
          color={primaryColor}
          onClick={onLightMode}
          className="cursor-pointer"
          size={24}
        />
      )}

      {mode === "light" && (
        <IoMdMoon
          onClick={onDarkMode}
          className="text-gray-500 cursor-pointer"
          size={24}
        />
      )}
    </>
  );
};

export default ThemeToggle;
