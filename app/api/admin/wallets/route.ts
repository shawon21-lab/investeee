import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import Wallet from "@/models/Wallet";

// Protectected route for admin
export const GET = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as { role: string } | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (userSession?.role !== "admin")
      throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic
    const cards = await Wallet.find({});
    return NextResponse.json(cards.reverse());
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};

export const dynamic = "force-dynamic";
