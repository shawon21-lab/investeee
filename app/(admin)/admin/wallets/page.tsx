"use client";
import WalletCard from "@/components/admin/wallet/WalletCard";
import useCompany from "@/components/hooks/useCompany";
import { Loader } from "@mantine/core";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineInbox } from "react-icons/ai";

const Page = () => {
  const [wallets, setWallets] = useState<WalletProps[]>();
  const { company } = useCompany();
  const primaryLight = company?.color.primaryLight;

  const getWallets = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/admin/wallets");
      if (data.error) throw new Error(data.error);
      setWallets(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    getWallets();
  }, [getWallets]);

  if (!wallets) {
    return (
      <div className="flex justify-center">
        <Loader color={primaryLight} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div
        className={`text-xl sm:text-2xl font-bold 
        flex justify-center`}
      >
        Wallets
      </div>

      <div
        className="flex justify-center items-center flex-wrap 
        gap-4"
      >
        {wallets.map((wallet) => (
          <WalletCard
            getWallets={getWallets}
            key={wallet._id}
            wallet={wallet}
          />
        ))}

        {wallets.length <= 0 && (
          <div
            className="flex justify-center flex-col items-center 
          min-h-[80vh]"
          >
            <AiOutlineInbox color={primaryLight} size={100} />
            <div className={`font-semibold text-lg`}>
              No Imported Wallet Availaible
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
