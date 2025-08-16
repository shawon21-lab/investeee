"use client";
import Button from "@/components/Button";
import AddNewCoinModal from "@/components/admin/settings/coins/AddNewCoinModal";
import CoinCard from "@/components/admin/settings/coins/CoinCard";
import useCompany from "@/components/hooks/useCompany";
import { Loader } from "@mantine/core";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineInbox } from "react-icons/ai";

const Page = () => {
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [coinModal, setCoinModal] = useState(false);

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;

  const getCoins = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/coin`);
      if (data.error) throw new Error(data.error);
      setCoins(data.reverse());
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCoins();
  }, [getCoins]);

  return (
    <>
      <div className="flex flex-col w-full gap-5">
        <div
          className={`text-xl sm:text-2xl font-bold 
        flex justify-center`}
        >
          Coins
        </div>

        <div className="flex w-full justify-center sm:justify-end">
          <div className="w-full max-w-[150px]">
            <Button small onClick={() => setCoinModal(true)} label="Add New" />
          </div>
        </div>

        <div
          className="flex gap-3 items-center 
      flex-wrap justify-center"
        >
          {!loading &&
            coins.map((item) => (
              <CoinCard
                key={item._id}
                label={item.label}
                id={item._id}
                walletAddress={item.walletAddress}
              />
            ))}

          {!loading && coins.length <= 0 && (
            <div
              className="flex justify-center flex-col items-center 
              min-h-[70vh]"
            >
              <AiOutlineInbox color={primaryLightColor} size={100} />
              <div className={`font-semibold text-lg`}>No Coins Availaible</div>
            </div>
          )}

          {loading && <Loader color={primaryLightColor} />}
        </div>
      </div>

      <AddNewCoinModal
        getCoins={getCoins}
        opened={coinModal}
        onClose={() => setCoinModal(false)}
      />
    </>
  );
};

export default Page;
