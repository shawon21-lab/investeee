"use client";
import React, { useState } from "react";
import Container from "./Container";
import TextInput from "../TextInput";
import Button from "../Button";
import { useRouter } from "next/navigation";

import { FaArrowLeft } from "react-icons/fa";
import { AiFillMail } from "react-icons/ai";
import useTheme from "../hooks/useTheme";
import ThemeToggle from "../ThemeToggle";
import { toast } from "react-hot-toast";
import axios from "axios";
import useCompany from "../hooks/useCompany";

const ForgotPassword = () => {
  const router = useRouter();
  const { mode } = useTheme();
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [backHover, setBackHover] = useState(false);

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;
  const primaryVeryLightColor = company?.color.primaryVeryLight;

  const forgotPasswordHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/users/forgot-password", {
        email: emailInput,
      });
      if (data.error) throw new Error(data.error);
      router.push(`/forgot-password/otp/${emailInput.trim().toLowerCase()}`);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="flex flex-col items-center gap-3">
        <ThemeToggle />

        <div
          className={`font-bold text-2xl md:text-3xl 
        ${mode === "light" ? "text-slate-700" : "text-white"}`}
        >
          Forgot Password?
        </div>

        <div
          className={`font-semibold text-center
        ${mode === "light" ? "text-gray-500" : "text-gray-300"}`}
        >
          No worries, we&apos;ll send you reset instructions
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <TextInput
          id="email"
          placeholder="Enter Your Email"
          value={emailInput}
          icon={AiFillMail}
          onChange={(e) => {
            setEmailInput(e.target.value);
          }}
        />
        <Button
          loading={loading}
          label="Continue"
          onClick={forgotPasswordHandler}
        />
      </div>

      <div
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        onClick={() => router.push("/login")}
        style={{
          color: backHover
            ? primaryColor
            : mode === "light"
            ? "#334155"
            : "#cbd5e1",
        }}
        className={`sm:cursor-pointer active:scale-[.95] 
        duration-200 select-none text-center 
        flex items-center gap-2 
        text-sm font-semibold `}
      >
        <FaArrowLeft /> Back to log in
      </div>
    </Container>
  );
};

export default ForgotPassword;
