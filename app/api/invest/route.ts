import mongoogeConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import Investment from "@/models/Investment";

interface BodyProps {
  planName: string;
  amountInvested: number;
  ROIDaily: number;
  totalROI: number;
  duration: number;
  referralBonus: number;
}

export const GET = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("UnAuthorized Access");
    const userId = (session.user as { id: string }).id;
    await mongoogeConnect();

    const investments = await Investment.find({ userId });
    return NextResponse.json(investments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("UnAuthorized Access");
    const userId = (session.user as { id: string }).id;
    await mongoogeConnect();

    const body: BodyProps = await request.json();
    const user = await User.findById<userSchemaType>(userId);
    if (!user) throw new Error("No user found");

    if (user.accountBalance < body.amountInvested)
      throw new Error("YOU DO NOT HAVE SUFFICIENT ACCOUNT BALANCE");

    await User.findByIdAndUpdate(userId, {
      $inc: { accountBalance: -body.amountInvested },
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { investBalance: body.amountInvested },
    });

    if (user.refUsername && user.refUsername !== "no ref") {
      const percentageRef = body.referralBonus / 100;
      await User.findOneAndUpdate(
        { username: user.refUsername },
        {
          $inc: { accountBalance: body.amountInvested * percentageRef },
        }
      );
    }

    const newInvestment = new Investment({
      ...body,
      userId,
      referralBonus: undefined,
    });
    const savedInvestment: InvestmentProps = await newInvestment.save();

    return NextResponse.json(savedInvestment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
