"use client";
import Button from "@/components/Button";
import DeleteCoinModal from "@/components/admin/settings/coins/DeleteCoinModal";
import EditCoinModal from "@/components/admin/settings/coins/EditCoinModal";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { Loader } from "@mantine/core";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Page = () => {
  const { mode } = useTheme();
  const coinId = useParams().coinId;
  const [coin, setCoin] = useState<CoinProps | undefined>();
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;

  const getCoin = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/coin/${coinId}`);
      if (data.error) throw new Error(data.error);
      setCoin(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [coinId]);

  useEffect(() => {
    if (coinId) getCoin();
  }, [coinId, getCoin]);

  if (!coin) {
    return (
      <div className="flex w-full justify-center">
        <Loader color={primaryLightColor} />
      </div>
    );
  }

  return (
    <>
      <div className={`flex justify-center pb-7`}>
        <div
          className={`w-[500px] max-w-full p-5 
        rounded-md shadow-md transition 
        flex flex-col items-center gap-7
         ${
           mode === "light"
             ? "shadow-gray-200 hover:shadow-gray-300"
             : " shadow-[#292929] hover:shadow-[#585858]"
         } `}
        >
          <div className="font-bold text-lg">{coin?.label}</div>

          <div className="flex flex-col w-full">
            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>label:</div>
              <div>{coin?.label}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Value:</div>
              <div>{coin?.value}</div>
            </div>

            <div
              className="w-full flex justify-between 
          items-center py-4 border-b gap-x-3"
            >
              <div>Wallet Address:</div>
              <div className="break-all">{coin?.walletAddress}</div>
            </div>

            <div className="w-full flex justify-between items-center py-4 border-b">
              <div>Enabled:</div>
              <div>{coin?.allowed === "yes" ? "Yes" : "No"}</div>
            </div>
          </div>

          <div className="flex w-full justify-between gap-3">
            <Button
              outline
              label="Delete"
              onClick={() => setDeleteModal(true)}
            />
            <Button label="Edit" onClick={() => setEditModal(true)} />
          </div>
        </div>
      </div>

      <DeleteCoinModal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        coinId={coin._id}
      />

      <EditCoinModal
        getCoin={getCoin}
        opened={editModal}
        onClose={() => setEditModal(false)}
        coinId={coin._id}
        currentWallet={coin.walletAddress}
        currentAllowed={coin.allowed}
      />
    </>
  );
};

export default Page;
