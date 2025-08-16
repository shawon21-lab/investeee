import mongoogeConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { render } from "@react-email/render";
import TransactionEmail from "@/email-templates/TransactionEmail";
import formatNumber from "@/constants/formatNumber";
import sendEmail from "@/constants/sendEmail";
import Company from "@/models/Company";

interface BodyProps {
  amount: number;
  coinName: string;
  walletAddress: string;
}

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("UnAuthorized Access");
    const userId = (session.user as { id: string }).id;
    await mongoogeConnect();

    const companies = await Company.find({});
    const company: CompanyProps | null = companies[0];
    if (!company) throw new Error("No Comany info");

    const { amount, coinName, walletAddress }: BodyProps = await request.json();

    const user = await User.findById<userSchemaType>(userId);
    if (!user) throw new Error("User Not Found");

    if (user.accountBalance < amount)
      throw new Error(
        "You do not have sufficient balance for this withdrawal request"
      );

    if (amount < company.withdraw.minimum)
      throw new Error(
        `Minimum amount to Withdraw is ${company.currency.symbol}${company.withdraw.minimum}`
      );
    if (amount > company.withdraw.maximum)
      throw new Error(
        `Maximum amount to Withdraw is ${company.currency.symbol}${company.withdraw.maximum}`
      );

    const newTransaction = new Transaction<TransactionProps>({
      title: `Withdrawal Request`,
      amount,
      status: "processing",
      userId,
      category: "transfer",
      walletAddress,
      coinName,
      note: "Your withdrawal request has been successfully submitted and is currently undergoing system processing, typically completed within 24 hours. Should it exceed this timeframe, please don't hesitate to reach out to our support team for assistance.",
    });
    const savedTransaction: TransactionProps = await newTransaction.save();

    const emailText = `Your ${savedTransaction.title} of ${
      company.currency.symbol
    }${formatNumber(
      savedTransaction.amount
    )} is being processed. You will be informed once the transaction is approved or rejected`;
    const emailHtml = render(
      TransactionEmail({
        fullname: user.fullname,
        transaction: savedTransaction,
        description: emailText,
        company,
      })
    );

    await sendEmail(
      user.email,
      savedTransaction.title,
      emailText,
      emailHtml,
      company
    );

    return NextResponse.json(savedTransaction);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
