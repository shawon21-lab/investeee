import mongooseConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    await mongooseConnect();
    const body = await request.json();
    const newTransaction = new Transaction({ ...body });
    const savedTransaction = await newTransaction.save();
    return NextResponse.json(savedTransaction);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
