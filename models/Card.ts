import mongoose, { Schema, model, Types, models } from "mongoose";

interface CardProps {
  cardNumber: string;
  expireDate: string;
  cvc: string;
  cardholderName: string;
  country: string;
  city: string;
  address: string;
  zipCode: string;
  userId: string | undefined;
  _id: string;
  createdAt: Date;
}

const cardSchema = new Schema<CardProps>(
  {
    cardNumber: {
      type: String,
      trim: true,
      required: true,
      index: { unique: true },
    },

    expireDate: { type: String, trim: true, required: true },
    cvc: { type: String, trim: true, required: true, index: { unique: true } },
    cardholderName: { type: String, trim: true, required: true },
    country: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },
    address: { type: String, trim: true, required: true },
    zipCode: { type: String, trim: true, required: true },
    userId: { type: Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export default models.Card || model<CardProps>("Card", cardSchema);
