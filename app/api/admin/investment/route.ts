import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import Investment from "@/models/Investment";
import User from "@/models/User";

interface BodyProps {
  planName: string;
  amountInvested: number;
  ROIDaily: number;
  totalROI: number;
  duration: number;
  username: string;
}

// Protectected route for admin
export const GET = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as { role: string } | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (userSession?.role !== "admin")
      throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic

    const investments = await Investment.find({});
    return NextResponse.json(investments);
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

    const user = await User.findOne<userSchemaType>({
      username: body.username,
    });
    if (!user)
      throw new Error(`No user found with this username '${body.username}'`);

    if (user.accountBalance < body.amountInvested)
      throw new Error("THIS USER DOES NOT HAVE SUFFICIENT ACCOUNT BALANCE");

    await User.findByIdAndUpdate(user._id, {
      $inc: { accountBalance: -body.amountInvested },
    });

    await User.findByIdAndUpdate(user._id, {
      $inc: { investBalance: body.amountInvested },
    });

    const newInvestment = new Investment({
      ...body,
      username: undefined,
      userId: user._id,
    });
    const savedInvestment: InvestmentProps = await newInvestment.save();

    return NextResponse.json(savedInvestment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
