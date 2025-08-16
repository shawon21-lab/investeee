import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import { isNumber } from "@/constants/isNumber";

interface BodyProps {
  accountBalance: number;
  investWithdrawableBalance: number;
  loanBalance: number;
  userId: string;
}

// Protectected route for admin
export const POST = async (request: Request) => {
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

    const body: BodyProps = await request.json();

    const admin = await User.findById<userSchemaType>(userSession.id);
    if (!admin) throw new Error("You're not an Admin");

    const user = await User.findById<userSchemaType>(body.userId);
    if (!user) throw new Error("User Not Found");

    if (
      admin.manager !== "yes" &&
      user.role === "admin" &&
      user._id.toString() !== admin._id.toString()
    )
      throw new Error("Only managers can Edit other admins balance");

    if (
      body.accountBalance < 0 ||
      !isNumber(body.accountBalance) ||
      body.investWithdrawableBalance < 0 ||
      !isNumber(body.investWithdrawableBalance) ||
      body.loanBalance < 0 ||
      !isNumber(body.loanBalance)
    )
      throw new Error("The value sent are invalid");

    const updatedUser = await User.findByIdAndUpdate(body.userId, {
      accountBalance: body.accountBalance,
      investWithdrawableBalance: body.investWithdrawableBalance,
      loanBalance: body.loanBalance,
    });

    if (!updatedUser) throw new Error("No User Available");
    return NextResponse.json("something");
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
