import mongoogeConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Card from "@/models/Card";
import User from "@/models/User";

interface BodyProp {
  cardNumber: string;
  expireDate: string;
  cvc: string;
  cardholderName: string;
  country: string;
  city: string;
  address: string;
  zipCode: string;
}

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session?.user) throw new Error("UnAuthorized Access");
    const userId = (session.user as { id: string }).id;

    await mongoogeConnect();

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found (UnAuthorized Access)");

    const body: BodyProp = await request.json();
    const newCard = new Card({ ...body, userId });
    const savedCard = await newCard.save();
    return NextResponse.json(savedCard);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
