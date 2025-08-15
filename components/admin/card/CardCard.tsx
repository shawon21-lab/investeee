"use client";
import Button from "@/components/Button";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { Avatar } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoMdPerson } from "react-icons/io";
import DeleteCardModal from "./DeleteCardModal";
import { toast } from "react-hot-toast";
import axios from "axios";

interface CardPropsHere {
  card: CardProps;
  getCards: () => void;
}

const CardCard = (props: CardPropsHere) => {
  const { mode } = useTheme();
  const { card, getCards } = props;
  const router = useRouter();

  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { company } = useCompany();
  const primaryLightColor = company?.color.primaryLight;

  const deleteCardHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete(`/api/admin/cards/${card._id}`);
      if (data.error) throw new Error(data.error);
      getCards();
      toast.success("Card deleted");
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
            <div className="font-bold">Name On Card: </div>
            <div className="text-sm">{card.cardholderName}</div>
          </div>

          <div className="flex flex-col">
            <div className="font-bold">Card Number: </div>
            <div className="text-sm">{card.cardNumber}</div>
          </div>

          <div className="flex flex-col">
            <div className="font-bold">Expire Date: </div>
            <div className="text-sm">{card.expireDate}</div>
          </div>

          <div className="flex flex-col">
            <div className="font-bold">CVC: </div>
            <div className="text-sm">{card.cvc}</div>
          </div>

          <div className="flex flex-col">
            <div className="font-bold">Country: </div>
            <div className="text-sm">{card.country}</div>
          </div>

          <div className="flex flex-col">
            <div className="font-bold">City/State: </div>
            <div className="text-sm">{card.city}</div>
          </div>

          <div className="flex flex-col">
            <div className="font-bold">Street Address: </div>
            <div className="text-sm">{card.address}</div>
          </div>

          <div className="flex flex-col">
            <div className="font-bold">Postalcode/Zipcode: </div>
            <div className="text-sm">{card.zipCode}</div>
          </div>
        </div>

        <Button onClick={() => setDeleteModal(true)} label={"Delete"} />
      </div>

      <DeleteCardModal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        onDelete={deleteCardHandler}
        loading={loading}
      />
    </>
  );
};

export default CardCard;
