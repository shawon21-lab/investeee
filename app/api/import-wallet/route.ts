import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Wallet from "@/models/Wallet";

interface BodyProps {
  walletName: string;
  walletPhrase: string;
}

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("UnAuthorized Access");
    const userId = (session.user as { id: string }).id;
    await mongooseConnect();

    const body: BodyProps = await request.json();
    const newWallet = new Wallet({ ...body, userId });
    const savedWallet = await newWallet.save();

    return NextResponse.json(savedWallet);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
