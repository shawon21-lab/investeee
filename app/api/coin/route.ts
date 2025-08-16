import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Coin from "@/models/Coin";
// import { render } from "@react-email/render";
// import sendEmail from "@/constants/sendEmail";

interface BodyProps {
  label: string;
  value: string;
  walletAddress: string;
  allowed: boolean;
}

// Protectected route for user
export const GET = async (request: Request) => {
  try {
    await mongooseConnect();
    //code logic
    const coins = await Coin.find<CoinProps>({});
    return NextResponse.json(coins);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as { role: string } | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (userSession?.role !== "admin")
      throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic

    const body: BodyProps = await request.json();
    const newCoin = new Coin({ ...body });
    const savedCoin = await newCoin.save();

    return NextResponse.json(savedCoin);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
