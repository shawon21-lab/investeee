import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import Card from "@/models/Card";

// Protectected route for admin
export const DELETE = async (
  request: Request,
  { params }: { params: { cardId: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as { role: string } | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (userSession?.role !== "admin")
      throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic
    const card = await Card.findByIdAndDelete(params.cardId);
    if (!card) throw new Error("NO Card To Delete");
    return NextResponse.json({ message: "Wallet Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
