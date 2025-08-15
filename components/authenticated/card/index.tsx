"use client";
import CreditCard from "@/components/CreditCard";
import AddCardModal from "@/components/authenticated/card/AddCardModal";
import useCompany from "@/components/hooks/useCompany";
import useTheme from "@/components/hooks/useTheme";
import { Loader } from "@mantine/core";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaAngleRight, FaCreditCard } from "react-icons/fa";

const Card = () => {
  const { mode } = useTheme();
  const [addCardModal, setAddCardModal] = useState(false);
  const [cards, setCards] = useState<CardProps[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const userId = (session?.user as { id: string })?.id;

  const { company } = useCompany();
  const primaryColor = company?.color.primary;
  const primaryLightColor = company?.color.primaryLight;
  const primaryVeryLightColor = company?.color.primaryVeryLight;

  const getUserCards = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/card/user/${userId}`);
      if (data.error) throw new Error(data.error);
      setCards(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) getUserCards();
  }, [getUserCards, userId]);

  return (
    <>
      <div
        className={`rounded-md px-2 sm:px-7 py-10 shadow-lg
      flex flex-col gap-10
    ${
      mode === "light"
        ? "shadow-gray-200 hover:shadow-gray-300"
        : " shadow-[#1d1d1d] hover:shadow-[#585858]"
    } `}
      >
        <div
          className={`text-xl sm:text-2xl font-bold 
        flex justify-center
      ${mode === "light" ? "text-slate-700" : "text-white"}`}
        >
          Cards
        </div>

        <div className={`flex flex-wrap items-center justify-center gap-2`}>
          {!loading && cards.length <= 0 && (
            <CreditCard
              onClick={() => setAddCardModal(true)}
              ownerName="your name"
              cardNumber="your - card - num - 0968"
              cardExpire="01/34"
              cvc="456"
            />
          )}

          {loading && <Loader color={primaryLightColor} />}

          {!loading &&
            cards.length > 0 &&
            cards.map((item) => (
              <CreditCard
                onClick={() => {}}
                key={item._id}
                ownerName={item.cardholderName}
                cardNumber={item.cardNumber}
                cardExpire={item.expireDate}
                cvc={item.cvc}
              />
            ))}
        </div>

        <div className={`flex flex-col items-center justify-center gap-5`}>
          <div
            className={`text-center font-semibold
        ${mode === "light" ? "text-gray-500" : "text-gray-300"}`}
          >
            {cards.length <= 0 ? "Add your credit/debit card" : "Add New Card"}
          </div>

          <div
            onClick={() => setAddCardModal(true)}
            className={`shadow-md w-[400px] max-w-full 
          rounded-md flex items-center 
          justify-between p-4 gap-3 
          sm:cursor-pointer select-none active:scale-95 
          transition-all duration-200
          ${mode === "light" ? "" : "shadow-[#3d3d3d] hover:shadow-[#4f4f4f]"}`}
          >
            <div className="flex items-center gap-3">
              <FaCreditCard
                color={mode === "light" ? primaryColor : primaryLightColor}
              />

              <div className="flex flex-col">
                <div
                  style={{
                    color:
                      mode === "light"
                        ? primaryLightColor
                        : primaryVeryLightColor,
                  }}
                  className={`font-bold text-lg`}
                >
                  Link your card
                </div>

                <div
                  className={`font-semibold text-sm 
              ${mode === "light" ? "text-gray-500" : "text-gray-300"}`}
                >
                  Withdraw funds directly to your bank
                </div>
              </div>
            </div>

            <FaAngleRight
              color={mode === "light" ? primaryColor : primaryLightColor}
            />
          </div>
        </div>
      </div>

      <AddCardModal
        onAddCard={getUserCards}
        opened={addCardModal}
        onClose={() => setAddCardModal(false)}
      />
    </>
  );
};

export default Card;
