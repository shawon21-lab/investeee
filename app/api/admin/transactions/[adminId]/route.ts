import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

// Protectected route for admin
export const GET = async (
  request: Request,
  { params }: { params: { adminId: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { role: string; id: string } | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (user?.role !== "admin") throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic
    const admin = await User.findById<userSchemaType>(params.adminId);

    if (!admin || params.adminId !== user.id || admin.role !== "admin")
      throw new Error("You're not authorized");

    const transactions = await Transaction.find({});
    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
