import mongooseConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";

interface ParamsProps {
  params: { transactionId: string };
}

export const GET = async (request: Request, { params }: ParamsProps) => {
  try {
    await mongooseConnect();
    const transaction = await Transaction.findOne({
      _id: params.transactionId,
    });
    if (!transaction) throw new Error("This transaction does not exist");
    return NextResponse.json(transaction);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
