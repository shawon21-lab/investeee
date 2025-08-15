import { Schema, model, models } from "mongoose";

interface InvestmentProps {
  planName: string;
  amountInvested: number;
  ROIReceived: number;
  ROIDaily: number;
  totalROI: number;
  duration: number;
  userId: string;
  status: "active" | "completed";
  _id: string;
  createdAt: Date;
}

const investmentSchema = new Schema<InvestmentProps>(
  {
    planName: { type: String, required: true },

    amountInvested: { type: Number, required: true },

    ROIReceived: { type: Number, default: 0 },

    duration: { type: Number, required: true },

    ROIDaily: { type: Number, required: true },

    totalROI: { type: Number, required: true },

    userId: { type: String, required: true },

    status: { type: String, enum: ["active", "completed"], default: "active" },
  },
  { timestamps: true }
);

export default models.Investment ||
  model<InvestmentProps>("Investment", investmentSchema);
