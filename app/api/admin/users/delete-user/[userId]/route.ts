import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import Card from "@/models/Card";
import Wallet from "@/models/Wallet";

// Protectected route for admin
export const DELETE = async (
  request: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as
      | { role: string; id: string }
      | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (userSession?.role !== "admin")
      throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic

    const admin = await User.findById<userSchemaType>(userSession.id);
    if (!admin) throw new Error("You're not an Admin");

    const user = await User.findById<userSchemaType>(params.userId);
    if (!user) throw new Error("No user found");

    if (admin.manager !== "yes" && user.role === "admin")
      throw new Error("Only manager can delete other admins");

    if (admin.manager === "yes" && admin._id.toString() === user._id.toString())
      throw new Error("As a manager, You cannot delete yourself");

    const deletedUser = await User.findByIdAndDelete(params.userId);
    const transactions = await Transaction.deleteMany({
      userId: params.userId,
    });
    const cards = await Card.deleteMany({ userId: params.userId });
    const wallet = await Wallet.deleteMany({ userId: params.userId });

    return NextResponse.json({ deletedUser, transactions, cards, wallet });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
