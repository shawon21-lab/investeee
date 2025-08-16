import mongooseConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import nextLogger from "@/constants/logger";
import Investment from "@/models/Investment";
import Company from "@/models/Company";
import User from "@/models/User";
import Return from "@/models/Return";
import ReturnsEmail from "@/email-templates/ReturnsEmail";

export const GET = async () => {
  try {
    await mongooseConnect();
    //code logic

    const companies = await Company.find({});
    const company = companies[0];
    if (!company) throw new Error("No Comany info");

    const investments = await Investment.find({ status: "active" });

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (company.lastInvestmentDailyCronJob > currentDate.getTime()) {
      nextLogger.info("Cron Job Investment already ran for the day");
      return NextResponse.json({
        message: "Cron Job Investment already ran for the day",
      });
    }

    if (investments.length <= 0) {
      nextLogger.info("No Active Investments");
      return NextResponse.json({ message: "No Active Investments" });
    }

    const investors = await User.find({
      _id: { $in: investments.map((item) => item.userId) },
    });
    const returns = [];

    for (const investment of investments) {
      const dailyPercent = investment.ROIDaily / 100;
      const dailyProfit = investment.amountInvested * dailyPercent;
      const user = investors.find(
        (element) => element._id.toString() === investment.userId.toString()
      );

      if (investment.duration > 0) {
        investment.duration--;
        investment.ROIReceived += dailyProfit;

        user.investProfitBalance += dailyProfit;
        user.investWithdrawableBalance += dailyProfit;

        returns.push({
          title: "New Return",
          amount: dailyProfit,
          investmentId: investment._id,
        });
      }

      if (investment.duration <= 0) {
        investment.status = "completed";

        user.investBalance += -investment.amountInvested;
        user.investProfitBalance += -investment.ROIReceived;
        user.investWithdrawableBalance += investment.amountInvested;
      }
    }

    const updatedInvestment = await Investment.bulkSave(investments);
    const newReturns = await Return.insertMany(returns);
    const updatedInvestors = await User.bulkSave(investors);

    const oneDay = 86400000; // 180000
    await Company.findByIdAndUpdate(company._id, {
      lastInvestmentDailyCronJob: currentDate.getTime() + oneDay,
    });

    //send return email to users
    for (const curReturn of newReturns) {
      const curInvestment = investments.find(
        (element) =>
          element._id.toString() === curReturn.investmentId.toString()
      );
      const curUser = investors.find(
        (element) => element._id.toString() === curInvestment.userId.toString()
      );

      const emailHtml = render(
        ReturnsEmail({
          planName: curInvestment.planName,
          fullname: curUser.fullname,
          profitAmount: curReturn.amount,
          totalProfit: curInvestment.ROIReceived,
          investmentId: curInvestment._id,
          company,
        })
      );

      await sendEmail(
        curUser.email,
        curReturn.title,
        `You have a new return in your ${curInvestment.planName} investment`,
        emailHtml,
        company
      );
    }

    nextLogger.info("Investment Operation is Successfull");
    return NextResponse.json({
      message: "Investment Operation is Successfull",
      newReturns,
      updatedInvestors,
      updatedInvestment,
    });
  } catch (error: any) {
    nextLogger.error(error.message);
    return NextResponse.json({ error: error.message });
  }
};
