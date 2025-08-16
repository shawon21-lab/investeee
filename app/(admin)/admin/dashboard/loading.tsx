"use client";
import useCompany from "@/components/hooks/useCompany";
import { Loader } from "@mantine/core";
import React from "react";

const Loading = () => {
  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  // const primaryVeryLightColor = company?.color.primaryVeryLight;

  return (
    <div className="h-[70vh] w-full flex items-center justify-center">
      <Loader color={primaryColor} />
    </div>
  );
};

export default Loading;
