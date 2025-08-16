import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Card from "@/models/Card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";

interface ParamsProps {
  params: { userId: string };
}

export const GET = async (request: Request, { params }: ParamsProps) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("UnAuthorized Access");
    const userId = (session.user as { id: string }).id;

    await mongooseConnect();

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found (UnAuthorized Access)");

    const cards = await Card.find({ userId: params.userId });
    return NextResponse.json(cards);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
