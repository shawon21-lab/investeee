"use client";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Loader } from "@mantine/core";

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    session?.user && redirect("/home");
    // !session?.user && redirect("/login");

    timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [session?.user]);

  if (!isReady) {
    return (
      <div
        className="h-[100vh] w-full flex items-center
        justify-center bg-black"
      >
        <Loader color="#ffffff" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <Footer />
    </>
  );
};

export default Home;
