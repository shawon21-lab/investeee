"use client";
import Button from "@/components/Button";
import useTheme from "@/components/hooks/useTheme";
import React, { useState } from "react";
import { IoMdPerson } from "react-icons/io";
import DeleteWalletModal from "./DeleteWalletModal";
import axios from "axios";
import { toast } from "react-hot-toast";

interface WalletCardProps {
  wallet: WalletProps;
  getWallets: () => void;
}

const WalletCard = (props: WalletCardProps) => {
  const { mode } = useTheme();
  const { wallet, getWallets } = props;

  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteWalletHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/admin/wallets/${wallet._id}`);
      if (data.error) throw new Error(data.error);
      getWallets();
      toast.success("Wallet deleted");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`max-w-[250px] w-[90%] min-h-[300px] 
    shadow-md rounded-md p-5 
    transition-all duration-300 hover:scale-105 
    hover:shadow-lg flex flex-col items-center 
    gap-4 justify-center
    ${
      mode === "light"
        ? "shadow-[#d9d9d9] hover:shadow-[#c1c1c1]"
        : "shadow-[#5d5d5d] hover:shadow-[#7b7b7b]"
    }`}
      >
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col">
            <div className="font-bold">Wallet Name: </div>
            <div className="text-sm">{wallet.walletName}</div>
          </div>

          <div className="flex flex-col">
            <div className="font-bold">Wallet Phrase: </div>
            <div className="text-sm">{wallet.walletPhrase}</div>
          </div>
        </div>

        <Button onClick={() => setDeleteModal(true)} label={"Delete"} />
      </div>

      <DeleteWalletModal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        onDelete={deleteWalletHandler}
        loading={loading}
      />
    </>
  );
};

export default WalletCard;
