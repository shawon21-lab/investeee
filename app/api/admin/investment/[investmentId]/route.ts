import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import Investment from "@/models/Investment";
import User from "@/models/User";
import Return from "@/models/Return";

export const DELETE = async (
  request: Request,
  { params }: { params: { investmentId: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as { role: string } | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (userSession?.role !== "admin")
      throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic

    const investment = await Investment.findById<InvestmentProps>(
      params.investmentId
    );
    if (!investment) throw new Error("No Investment Found");
    if (investment.status === "active")
      throw new Error("You cannot delete an active investment");

    const deletedInvestment = await Investment.findByIdAndDelete(
      params.investmentId
    );
    
    await Return.deleteMany({ investmentId: investment._id });

    return NextResponse.json(deletedInvestment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
