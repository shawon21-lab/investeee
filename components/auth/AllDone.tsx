"use client";
import React from "react";
import Container from "./Container";
import Button from "../Button";
import { useRouter } from "next/navigation";
import useTheme from "../hooks/useTheme";
import ThemeToggle from "../ThemeToggle";

const AllDone = () => {
  const router = useRouter();
  const { mode } = useTheme();

  return (
    <Container>
      <ThemeToggle />
      <div className="flex flex-col w-full items-center gap-3">
        <div
          className={`font-bold text-2xl md:text-3xl 
        ${mode === "light" ? "text-slate-700" : "text-white"}`}
        >
          All done!
        </div>

        <div
          className={`text-center text-lg font-medium 
        ${mode === "light" ? "text-gray-500" : "text-gray-300"}`}
        >
          Your password has been reset. Would you like to login into your
          account as well:
        </div>
      </div>

      <div className="flex flex-col w-full items-center gap-3">
        <Button label="Login" onClick={() => router.push("/login")} />
        <Button
          label={"I'll do that later"}
          outline
          onClick={() => router.push("/")}
        />
      </div>
    </Container>
  );
};

export default AllDone;
