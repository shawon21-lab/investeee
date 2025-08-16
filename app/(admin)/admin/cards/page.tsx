"use client";

import CardCard from "@/components/admin/card/CardCard";
import useCompany from "@/components/hooks/useCompany";
import { Loader } from "@mantine/core";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineInbox } from "react-icons/ai";

const Page = () => {
  const [cards, setCards] = useState<CardProps[]>();
  const { company } = useCompany();
  const primaryLight = company?.color.primaryLight;

  const getCards = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/admin/cards");
      if (data.error) throw new Error(data.error);
      setCards(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    getCards();
  }, [getCards]);

  if (!cards) {
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
        Cards
      </div>

      <div
        className="flex justify-center items-center flex-wrap 
        gap-4"
      >
        {cards.map((card) => (
          <CardCard getCards={getCards} key={card._id} card={card} />
        ))}

        {cards.length <= 0 && (
          <div
            className="flex justify-center flex-col items-center 
          min-h-[80vh]"
          >
            <AiOutlineInbox color={primaryLight} size={100} />
            <div className={`font-semibold text-lg`}>No Cards Availaible</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
