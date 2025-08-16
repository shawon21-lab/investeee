import mongooseConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    await mongooseConnect();
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
