"use client";

import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import useTheme from "@/components/hooks/useTheme";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";

const Page = () => {
  const { mode } = useTheme();
  const searchParams = useSearchParams();
  const userJson = searchParams.get("user");
  const user: userSchemaType = JSON.parse(userJson || "");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    username: "",
    phoneNumber: "",
    dateOfBirth: "",
    country: "",
    city: "",
    address: "",
  });

  const updateData = {
    fullname: input.fullname,
    phoneNumber: input.phoneNumber,
    dateOfBirth: input.dateOfBirth,
    country: input.country,
    city: input.city,
    address: input.address,
  };

  useEffect(() => {
    setInput({
      fullname: user.fullname || "",
      email: user.email || "",
      username: user.username || "",
      phoneNumber: user.phoneNumber || "",
      dateOfBirth: user.dateOfBirth || "",
      country: user.country || "",
      city: user.city || "",
      address: user.address || "",
    });
  }, [
    user.address,
    user.city,
    user.country,
    user.dateOfBirth,
    user.email,
    user.fullname,
    user.phoneNumber,
    user.username,
  ]);

  const updateInfoHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.patch("/api/users/anything", updateData);
      if (data.error) throw new Error(data.error);
      toast.success("Details Updated");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center gap-3
    ${mode === "light" ? "text-slate-700" : "text-white"}`}
    >
      <div className="text-2xl flex font-bold items-center gap-2">
        Edit Info
        <FaEdit />
      </div>

      <div
        className={`w-full sm:w-[100%] shadow-md 
      rounded-md px-5 pt-5 pb-10 flex flex-col gap-4
      ${mode === "light" ? "shadow-gray-200" : "shadow-[#1d1d1d]"}`}
      >
        <div className="flex items-center gap-4 flex-col sm:flex-row">
          <div className="w-full">
            <div>Full Name</div>
            <TextInput
              value={input.fullname}
              onChange={(e) => setInput({ ...input, fullname: e.target.value })}
              placeholder=""
            />
          </div>

          <div className="w-full">
            <div>Email</div>
            <TextInput
              disabled={true}
              value={input.email}
              onChange={(e) => setInput({ ...input, email: e.target.value })}
              placeholder=""
            />
          </div>
        </div>

        <div className="flex items-center gap-4 flex-col sm:flex-row">
          <div className="w-full">
            <div>User Name</div>
            <TextInput
              disabled
              value={input.username}
              onChange={(e) => setInput({ ...input, username: e.target.value })}
              placeholder=""
            />
          </div>

          <div className="w-full">
            <div>Phone Number</div>
            <TextInput
              value={input.phoneNumber}
              onChange={(e) =>
                setInput({ ...input, phoneNumber: e.target.value })
              }
              placeholder=""
            />
          </div>
        </div>

        <div className="flex items-center gap-4 flex-col sm:flex-row">
          <div className="w-full">
            <div>Date of birth</div>
            <TextInput
              value={input.dateOfBirth}
              onChange={(e) =>
                setInput({ ...input, dateOfBirth: e.target.value })
              }
              placeholder="dd-mm-yyy E.g 24-07-1985"
            />
          </div>

          <div className="w-full">
            <div>Country</div>
            <TextInput
              value={input.country}
              onChange={(e) => setInput({ ...input, country: e.target.value })}
              placeholder=""
            />
          </div>
        </div>

        <div className="flex items-center gap-4 flex-col sm:flex-row">
          <div className="w-full">
            <div>City/State</div>
            <TextInput
              value={input.city}
              onChange={(e) => setInput({ ...input, city: e.target.value })}
              placeholder=""
            />
          </div>

          <div className="w-full">
            <div>Address</div>
            <TextInput
              value={input.address}
              onChange={(e) => setInput({ ...input, address: e.target.value })}
              placeholder=""
            />
          </div>
        </div>

        <Button
          loading={loading}
          label="Update Info"
          onClick={updateInfoHandler}
        />
      </div>
    </div>
  );
};

export default Page;
