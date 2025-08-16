import mongoogeConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import Company from "@/models/Company";

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("UnAuthorized Access");
    const userId = (session.user as { id: string }).id;
    await mongoogeConnect();

    const companies = await Company.find({});
    const company: CompanyProps | null = companies[0];
    if (!company) throw new Error("No Comany info");

    const user = await User.findById<userSchemaType>(userId);
    if (!user) throw new Error("User Not Found");

    const {
      amount,
      loanDuration,
      loanReason,
    }: { amount: number; loanDuration: string; loanReason: string } =
      await request.json();

    if (amount <= 0 || !loanDuration || !loanReason)
      throw new Error("One or more Fields are missing value");

    if (Number(amount) < Number(company?.loan.minimum))
      throw new Error(
        `Minimum amount to Request is ${company.currency.symbol}${company?.loan.minimum}`
      );
    if (Number(amount) > Number(company?.loan.maximum))
      throw new Error(
        `Maximum amount to Request is ${company.currency.symbol}${company?.loan.maximum}`
      );

    const newTransaction = new Transaction<TransactionProps>({
      title: "Loan Request",
      amount,
      userId,
      status: "processing",
      category: "loan",
      loanDuration,
      loanReason,
      note: "We are processing your loan, you will receive the loan shortly once approved",
    });
    const savedTransaction = await newTransaction.save();

    return NextResponse.json(savedTransaction);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
