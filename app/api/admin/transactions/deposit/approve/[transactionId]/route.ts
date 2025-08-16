import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import sendEmail from "@/constants/sendEmail";
import { render } from "@react-email/render";
import TransactionEmail from "@/email-templates/TransactionEmail";
import formatNumber from "@/constants/formatNumber";
import Company from "@/models/Company";

// Protectected route for admin
export const PATCH = async (
  request: Request,
  { params }: { params: { transactionId: string } }
) => {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { role: string; id: string } | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (user?.role !== "admin") throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic

    const companies = await Company.find({});
    const company: CompanyProps | null = companies[0];
    if (!company) throw new Error("No Comany info");

    const admin = await User.findById(user.id);
    if (!admin) throw new Error("User not found (UnAuthorized Access)");

    const transaction = await Transaction.findByIdAndUpdate<TransactionProps>(
      params.transactionId,
      { status: "successful", note: undefined }
    );
    if (!transaction) throw new Error("Transaction not found");

    const updatedUser = await User.findByIdAndUpdate<userSchemaType>(
      transaction.userId,
      { $inc: { accountBalance: transaction.amount } }
    );
    if (!updatedUser) throw new Error("Transaction owner not found");

    // cheking if this transaction is linked to a pending transaction
    if (transaction.linkedTransactionId) {
      const pendingTransaction = await Transaction.findById<TransactionProps>(
        transaction.linkedTransactionId
      );
      if (!pendingTransaction) throw new Error("Pending Transaction not found");

      // const companyPercent = company.transfer.percentToPay / 100; //pecent in decimal
      // const percentCal =
      //   transaction.amount *
      //   (pendingTransaction.amount /
      //     (pendingTransaction.amount * companyPercent));

      if (transaction.amount >= Number(pendingTransaction.amountToDeposit)) {
        await User.findByIdAndUpdate(pendingTransaction.userId, {
          $inc: { accountBalance: pendingTransaction.pendingBalance },
        });

        await Transaction.findByIdAndUpdate(transaction.linkedTransactionId, {
          pendingBalance: 0,
          status: "successful",
          amountToDeposit: 0,
          $inc: { despositedAmount: transaction.amount },
        });
      } else {
        // await User.findByIdAndUpdate(pendingTransaction.userId, {
        //   $inc: { accountBalance: percentCal },
        // });

        await Transaction.findByIdAndUpdate(transaction.linkedTransactionId, {
          $inc: {
            amountToDeposit: -transaction.amount,
            despositedAmount: transaction.amount,
          },
        });
      }
    }

    const latestUserUpdate = await User.findById<userSchemaType>(
      transaction.userId
    );
    if (!latestUserUpdate) throw new Error("Latest User not found");

    const updatedTransaction = await Transaction.findById<TransactionProps>(
      params.transactionId
    );
    if (!updatedTransaction) throw new Error("No updated transaction found");

    const emailText = `Your deposit of ${company.currency.symbol}${formatNumber(
      updatedTransaction.amount
    )} is approved. Your new balance is ${
      company.currency.symbol
    }$${formatNumber(latestUserUpdate.accountBalance)}`;
    const emailHtml = render(
      TransactionEmail({
        transaction: updatedTransaction,
        description: emailText,
        fullname: updatedUser.fullname,
        company,
      })
    );

    await sendEmail(
      updatedUser.email,
      "Deposit Approved",
      emailText,
      emailHtml,
      company
    );

    return NextResponse.json({ updatedUser, transaction });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
