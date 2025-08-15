import { Schema, model, models } from "mongoose";

interface PlanProps {
  planName: string;
  minAmount: number;
  maxAmount: number;
  ROIDaily: number;
  totalROI: number;
  duration: number;
  referralBonus: number;
  _id: string;
  createdAt: Date;
}

const planSchema = new Schema<PlanProps>(
  {
    planName: { type: String, required: true },

    minAmount: { type: Number, required: true },

    maxAmount: { type: Number, required: true },

    ROIDaily: { type: Number, required: true },

    totalROI: { type: Number, required: true },

    duration: { type: Number, required: true },

    referralBonus: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default models.Plan || model<PlanProps>("Plan", planSchema);
