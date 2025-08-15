import { Schema, model, models } from "mongoose";

interface ReturnProps {
  title: string;
  amount: number;
  investmentId: string;
  _id: string;
  createdAt: Date;
}

const returnSchema = new Schema<ReturnProps>(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    investmentId: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Return || model<ReturnProps>("Return", returnSchema);
