import mongoose, { Schema, model, Types, models } from "mongoose";

interface CoinProps {
  label: string;
  value: string;
  allowed: "yes" | "no";
  _id: string;
  createdAt: Date;
  walletAddress: string;
}

const coinSchema = new Schema<CoinProps>(
  {
    label: { type: String, required: true },

    value: { type: String, required: true },

    allowed: { type: String, default: "yes", enum: ["yes", "no"] },

    walletAddress: { type: String, trim: true },
  },
  { timestamps: true }
);

export default models.Coin || model<CoinProps>("Coin", coinSchema);
