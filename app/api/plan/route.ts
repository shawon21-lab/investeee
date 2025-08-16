import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Plan from "@/models/Plan";
// import { render } from "@react-email/render";
// import sendEmail from "@/constants/sendEmail";

interface BodyProps {
  planName: string;
  minAmount: number;
  maxAmount: number;
  ROIDaily: number;
  totalROI: number;
  duration: number;
  referralBonus: number;
}

// Protectected route for user
export const GET = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("UnAuthorized Access");
    await mongooseConnect();
    //code logic
    const plans = await Plan.find({});
    return NextResponse.json(plans);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("UnAuthorized Access");
    const user = session.user as { id: string; role: string };
    if (user.role !== "admin") throw new Error("this is a protected route");
    await mongooseConnect();
    //code logic

    const body: BodyProps = await request.json();
    const newPlan = new Plan({ ...body });

    const savedPlan = await newPlan.save();
    return NextResponse.json(savedPlan);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
