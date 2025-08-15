"use client";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import ModalContainer from "@/components/modals/ModalContainer";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface TopUpModalProps {
  opened: boolean;
  onClose: () => void;
  onAddCard: () => void;
}

const AddCardModal = (props: TopUpModalProps) => {
  const { opened, onClose, onAddCard } = props;
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    cardNumber: "",
    expireDate: "",
    cvc: "",
    cardholderName: "",
    country: "",
    city: "",
    address: "",
    zipCode: "",
  });

  function formatCardNumber(value: string) {
    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, "");
    // Add space every 4 digits to format the card number
    const formattedValue = numericValue.replace(/(\d{4}(?!\s))/g, "$1 ");

    return formattedValue.trim();
  }

  function formatExpiration(value: string) {
    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, "");
    // Add '/' after the first two digits
    const formattedValue = numericValue.replace(/^(\d{2})/, "$1/");

    return formattedValue;
  }

  const addCardHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/card", input);
      if (data.error) throw new Error(data.error);
      onClose();
      onAddCard();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalContainer title="Add card" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div>
          <div>Card Number</div>
          <TextInput
            maxLength={25}
            value={input.cardNumber}
            onChange={(e) =>
              setInput({
                ...input,
                cardNumber: formatCardNumber(e.target.value),
              })
            }
            placeholder="0000 0000 0000 0000"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div>Expire Date</div>
            <TextInput
              maxLength={5}
              value={input.expireDate}
              onChange={(e) =>
                setInput({
                  ...input,
                  expireDate: formatExpiration(e.target.value),
                })
              }
              placeholder="MM/YY E.g 02/24"
            />
          </div>

          <div>
            <div>CVC</div>
            <TextInput
              maxLength={4}
              value={input.cvc}
              onChange={(e) =>
                setInput({ ...input, cvc: e.target.value.replace(/\D/g, "") })
              }
              placeholder="000"
            />
          </div>
        </div>

        <div>
          <div>Cardholder name</div>
          <TextInput
            value={input.cardholderName}
            onChange={(e) =>
              setInput({ ...input, cardholderName: e.target.value })
            }
            placeholder="Name on card E.g John Doe"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div>Country</div>
            <TextInput
              value={input.country}
              onChange={(e) => setInput({ ...input, country: e.target.value })}
              placeholder="Enter your country"
            />
          </div>

          <div>
            <div>City/State</div>
            <TextInput
              value={input.city}
              onChange={(e) => setInput({ ...input, city: e.target.value })}
              placeholder="E.g New York"
            />
          </div>
        </div>

        <div>
          <div>Street Address</div>
          <TextInput
            value={input.address}
            onChange={(e) => setInput({ ...input, address: e.target.value })}
            placeholder="E.g No. 10 Minivan street"
          />
        </div>

        <div>
          <div>Postalcode/Zipcode</div>
          <TextInput
            value={input.zipCode}
            onChange={(e) => setInput({ ...input, zipCode: e.target.value })}
            placeholder="E.g 40032"
          />
        </div>

        <Button loading={loading} label="Add Card" onClick={addCardHandler} />
      </div>
    </ModalContainer>
  );
};

export default AddCardModal;
