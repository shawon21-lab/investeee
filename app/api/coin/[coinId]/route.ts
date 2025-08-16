import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Coin from "@/models/Coin";
// import { render } from "@react-email/render";
// import sendEmail from "@/constants/sendEmail";

// Protectected route for admin
export const GET = async (
  request: Request,
  { params }: { params: { coinId: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as { role: string } | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (userSession?.role !== "admin")
      throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic

    const coin = await Coin.findById<CoinProps>(params.coinId);
    if (!coin) throw new Error("This Coin is not Available");

    return NextResponse.json(coin);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};

export const PATCH = async (
  request: Request,
  { params }: { params: { coinId: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as { role: string } | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (userSession?.role !== "admin")
      throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic

    const body: { walletAddress: string; allowed: string } =
      await request.json();

    const coin = await Coin.findById(params.coinId);
    if (!coin) throw new Error("This Coin is not Available");

    await Coin.findByIdAndUpdate<CoinProps>(params.coinId, {
      walletAddress: body.walletAddress,
      allowed: body.allowed,
    });

    const updatedCoin = await Coin.findById(params.coinId);
    return NextResponse.json(updatedCoin);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};

export const DELETE = async (
  request: Request,
  { params }: { params: { coinId: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as { role: string } | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (userSession?.role !== "admin")
      throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic

    const deletedCoin = await Coin.findByIdAndDelete<CoinProps>(params.coinId);
    if (!deletedCoin) throw new Error("This Coin is not Available");

    return NextResponse.json(deletedCoin);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
