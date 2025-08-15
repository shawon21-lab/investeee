"use client";
import React, { useEffect, useRef, useState } from "react";
import Container from "./Container";
import { useParams, useRouter } from "next/navigation";
import Button from "../Button";
import { FaArrowLeft } from "react-icons/fa";
import ThemeToggle from "../ThemeToggle";
import useTheme from "../hooks/useTheme";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Loader } from "@mantine/core";
import useCompany from "../hooks/useCompany";

const Otp = () => {
  const router = useRouter();
  const { mode } = useTheme();
  const params = useParams();
  const email = (params as { email: string }).email;
  const cleanEmail = email.replaceAll("%40", "@");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [sec, setSec] = useState<number>(59);
  const [min, setMin] = useState<number>(1);
  const timerRef = useRef<number | null>(null);
  const [isTimer, setIsTimer] = useState(true);

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;

  const [backHover, setBackHover] = useState(false);
  const [resendHover, setResendHover] = useState(false);

  useEffect(() => {
    if (isTimer) {
      timerRef.current = window.setInterval(() => {
        if (sec === 0 && min === 0) {
          // Timer has reached 0:00
          clearInterval(timerRef.current as number);
          setIsTimer(false);
          setMin(5);
          setSec(59);
          // Handle any actions you want to perform when the timer is done
        } else if (sec === 0) {
          setSec(59);
          setMin((prevMin) => prevMin - 1);
        } else {
          setSec((prevSec) => prevSec - 1);
        }
      }, 1000);
    }

    // Clear the interval when the component unmounts
    return () => clearInterval(timerRef.current as number);
  }, [sec, min, isTimer]);

  const firstInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);
  const thirdInputRef = useRef<HTMLInputElement>(null);
  const fourthInputRef = useRef<HTMLInputElement>(null);
  const fifthInputRef = useRef<HTMLInputElement>(null);
  const sixthInputRef = useRef<HTMLInputElement>(null);

  const [inputs, setInputs] = useState({
    firstInput: "",
    secondInput: "",
    thirdInput: "",
    fourthInput: "",
    fifthInput: "",
    sixthInput: "",
  });

  const otpCode = `${inputs.firstInput}${inputs.secondInput}${inputs.thirdInput}${inputs.fourthInput}${inputs.fifthInput}${inputs.sixthInput}`;

  const confirmInputHandler = async () => {
    try {
      setLoading(true);
      if (otpCode.length < 6) throw new Error("OTP code must be 6");
      const { data } = await axios.post(
        "/api/users/forgot-password/confirm-otp",
        { email: cleanEmail, otp: otpCode }
      );
      if (data.error) throw new Error(data.error);

      router.push(`/forgot-password/new-password/${data.email}/${data.otp}`);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const resendOtpHandler = async () => {
    try {
      if (isTimer)
        throw new Error(
          `Please wait for ${min}mins and ${sec}secs before resending`
        );

      setResendLoading(true);
      const { data } = await axios.post("/api/users/forgot-password", {
        email: cleanEmail,
      });
      if (data.error) throw new Error(data.error);
      toast.success(
        "We sent a new code to your email. check your Inbox or spam folder",
        { duration: 10000 }
      );
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setResendLoading(false);
      setIsTimer(true);
    }
  };

  const firstInputChangeHanler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value)) || e.target.value === " ") return;

    setInputs({ ...inputs, firstInput: e.target.value });
    if (e.target.value === "") {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
        firstInputRef.current.selectionEnd = inputs.firstInput.length;
        firstInputRef.current.selectionStart = inputs.firstInput.length;
      }
    } else {
      secondInputRef.current?.focus();
    }
  };

  const secondInputChangeHanler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value)) || e.target.value === " ") return;

    setInputs({ ...inputs, secondInput: e.target.value });
    if (e.target.value === "") {
      firstInputRef.current?.focus();
    } else {
      thirdInputRef.current?.focus();
    }
  };

  const thirdInputChangeHanler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value)) || e.target.value === " ") return;

    setInputs({ ...inputs, thirdInput: e.target.value });
    if (e.target.value === "") {
      secondInputRef.current?.focus();
    } else {
      fourthInputRef.current?.focus();
    }
  };

  const fourthInputChangeHanler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value)) || e.target.value === " ") return;

    setInputs({ ...inputs, fourthInput: e.target.value });
    if (e.target.value === "") {
      thirdInputRef.current?.focus();
    } else {
      fifthInputRef.current?.focus();
    }
  };

  const fifthInputChangeHanler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value)) || e.target.value === " ") return;

    setInputs({ ...inputs, fifthInput: e.target.value });
    if (e.target.value === "") {
      fourthInputRef.current?.focus();
    } else {
      sixthInputRef.current?.focus();
    }
  };

  const sixthInputChangeHanler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value)) || e.target.value === " ") return;

    setInputs({ ...inputs, sixthInput: e.target.value });
    if (e.target.value === "") {
      fifthInputRef.current?.focus();
    } else {
      sixthInputRef.current?.focus();
    }
  };

  return (
    <Container>
      <ThemeToggle />
      <div className="flex flex-col items-center gap-3 w-full">
        <div
          className={`font-bold text-2xl md:text-3xl 
        ${mode === "light" ? "text-slate-700" : "text-white"}`}
        >
          Password reset
        </div>

        <div
          className={` text-lg text-center font-medium 
        ${mode === "light" ? "text-gray-500" : "text-gray-300"}`}
        >
          <span>We sent a code to </span>
          <span className="font-bold">{cleanEmail}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 w-full">
        <div
          className="flex items-center justify-between 
        w-full flex-wrap"
        >
          <input
            style={{
              borderColor: inputs.firstInput !== "" ? primaryLightColor : "",
            }}
            onChange={firstInputChangeHanler}
            ref={firstInputRef}
            value={inputs.firstInput}
            maxLength={1}
            type="tel"
            className={`w-[50px] h-[50px] rounded-md 
            border-2 outline-none text-center 
            text-slate-600 text-3xl`}
          />
          <input
            style={{
              borderColor: inputs.secondInput !== "" ? primaryLightColor : "",
            }}
            onChange={secondInputChangeHanler}
            ref={secondInputRef}
            value={inputs.secondInput}
            maxLength={1}
            type="tel"
            className={`w-[50px] h-[50px] rounded-md 
            border-2 outline-none text-center 
            text-slate-600 text-3xl`}
          />
          <input
            style={{
              borderColor: inputs.thirdInput !== "" ? primaryLightColor : "",
            }}
            onChange={thirdInputChangeHanler}
            ref={thirdInputRef}
            value={inputs.thirdInput}
            maxLength={1}
            type="tel"
            className={`w-[50px] h-[50px] rounded-md 
            border-2 outline-none text-center 
            text-slate-600 text-3xl`}
          />
          <input
            style={{
              borderColor: inputs.fourthInput !== "" ? primaryLightColor : "",
            }}
            onChange={fourthInputChangeHanler}
            ref={fourthInputRef}
            value={inputs.fourthInput}
            maxLength={1}
            type="tel"
            className={`w-[50px] h-[50px] rounded-md 
            border-2 outline-none text-center 
            text-slate-600 text-3xl`}
          />
          <input
            style={{
              borderColor: inputs.fifthInput !== "" ? primaryLightColor : "",
            }}
            onChange={fifthInputChangeHanler}
            ref={fifthInputRef}
            value={inputs.fifthInput}
            maxLength={1}
            type="tel"
            className={`w-[50px] h-[50px] rounded-md 
            border-2 outline-none text-center 
            text-slate-600 text-3xl`}
          />
          <input
            style={{
              borderColor: inputs.sixthInput !== "" ? primaryLightColor : "",
            }}
            onChange={sixthInputChangeHanler}
            ref={sixthInputRef}
            value={inputs.sixthInput}
            maxLength={1}
            type="tel"
            className={`w-[50px] h-[50px] rounded-md 
            border-2 outline-none text-center 
            text-slate-600 text-3xl`}
          />
        </div>

        <Button
          loading={loading}
          label="Continue"
          onClick={confirmInputHandler}
        />
      </div>

      <div
        className={`text-center text-sm font-medium 
        ${resendLoading && "flex items-center gap-2"} 
      ${mode === "light" ? "text-gray-500" : "text-gray-300"}`}
      >
        <span>Didn&apos;t receive the email? </span>
        {!resendLoading && (
          <span
            style={{
              color: resendHover
                ? primaryColor
                : mode === "light"
                ? "#334155"
                : "#e2e8f0",
            }}
            onMouseEnter={() => setResendHover(true)}
            onMouseLeave={() => setResendHover(false)}
            onClick={resendOtpHandler}
            className="underline font-semibold sm:cursor-pointer 
        select-none"
          >
            Click to resend{" "}
            {isTimer && (
              <span>
                after {min}min:{sec}sec
              </span>
            )}
          </span>
        )}

        {resendLoading && <Loader color="#fb7185" />}
      </div>

      <div
        style={{
          color: backHover
            ? primaryColor
            : mode === "light"
            ? "#334155"
            : "#e2e8f0",
        }}
        onMouseEnter={() => setBackHover(true)}
        onMouseLeave={() => setBackHover(false)}
        onClick={() => router.push("/login")}
        className={`sm:cursor-pointer active:scale-[.95] 
        duration-200 select-none text-center 
        flex items-center gap-2 
        text-sm font-semibold`}
      >
        <FaArrowLeft /> Back to log in
      </div>
    </Container>
  );
};

export default Otp;
