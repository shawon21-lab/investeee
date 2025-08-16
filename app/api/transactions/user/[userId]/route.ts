import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";

interface ParamsProps {
  params: { userId: string };
}

export const GET = async (request: Request, { params }: ParamsProps) => {
  try {
    await mongooseConnect();
    const transactions = await Transaction.find({ userId: params.userId });
    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
