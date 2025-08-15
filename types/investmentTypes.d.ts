declare interface InvestmentProps {
  planName: string;
  amountInvested: number;
  ROIReceived: number;
  ROIDaily: number;
  totalROI: number;
  duration: number;
  userId: string;
  _id: string;
  createdAt: Date;
  status: "active" | "completed";
}
