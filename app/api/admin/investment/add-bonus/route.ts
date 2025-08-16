import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import ReturnsEmail from "@/email-templates/ReturnsEmail";

import Investment from "@/models/Investment";
import Return from "@/models/Return";
import User from "@/models/User";
import Company from "@/models/Company";

interface BodyProps {
  bonusTitle: string;
  bonusAmount: string;
  investmentId: string;
}

// Protectected route for admin
export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as { role: string } | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (userSession?.role !== "admin")
      throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic

    const companies = await Company.find({});
    const company: CompanyProps | null = companies[0];
    if (!company) throw new Error("No Comany info");

    const body: BodyProps = await request.json();
    const investment = await Investment.findById<InvestmentProps>(
      body.investmentId
    );

    if (!investment) throw new Error("No Investment Found");

    if (investment.duration > 0 && investment.status === "active") {
      await Investment.findByIdAndUpdate(investment._id, {
        $inc: {
          ROIReceived: body.bonusAmount,
        },
      });

      await User.findByIdAndUpdate(investment.userId, {
        $inc: {
          investProfitBalance: body.bonusAmount,
          investWithdrawableBalance: body.bonusAmount,
        },
      });
    } else {
      await Investment.findByIdAndUpdate(investment._id, {
        $inc: {
          ROIReceived: body.bonusAmount,
        },
      });

      await User.findByIdAndUpdate(investment.userId, {
        $inc: {
          investWithdrawableBalance: body.bonusAmount,
        },
      });
    }

    const newReturn = new Return({
      title: body.bonusTitle,
      amount: body.bonusAmount,
      investmentId: investment._id,
    });
    const savedReturn: ReturnProps = await newReturn.save();

    const user = await User.findById<userSchemaType>(investment.userId);
    if (!user) throw new Error("No user found");
    const updatedInvestment = await Investment.findById<InvestmentProps>(
      investment._id
    );
    if (!updatedInvestment) throw new Error("No Investment Found");

    const emailHtml = render(
      ReturnsEmail({
        planName: updatedInvestment.planName,
        fullname: user.fullname,
        profitAmount: savedReturn.amount,
        totalProfit: updatedInvestment.ROIReceived,
        investmentId: updatedInvestment._id,
        company,
      })
    );

    await sendEmail(
      user.email,
      savedReturn.title,
      `You have a new return in your ${updatedInvestment.planName} investment`,
      emailHtml,
      company
    );

    return NextResponse.json("Bonus Added");
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
