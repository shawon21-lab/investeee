"use client";
import React from "react";
import Button from "./Button";
import { signOut } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";

const Logout = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-[400px]">
        <Button
          icon={FaSignOutAlt}
          onClick={() => signOut()}
          label={"Logout"}
        />
      </div>
    </div>
  );
};

export default Logout;
