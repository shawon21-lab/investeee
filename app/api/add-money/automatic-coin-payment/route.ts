import mongooseConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import sendEmail from "@/constants/sendEmail";
import { render } from "@react-email/render";
import TransactionEmail from "@/email-templates/TransactionEmail";
import formatNumber from "@/constants/formatNumber";
import axios from "axios";
import Company from "@/models/Company";

interface BodyProps {
  amount: number;
  linkedTransaction?: string;
  type: "automatic-coin-payment" | "manual-coin-payment" | "bank-transfer";
  coinName: string;
  nowPaymentResult: any;
}

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("UnAuthorized Access");
    const userId = (session.user as { id: string }).id;

    await mongooseConnect();

    const companies = await Company.find({});
    const company: CompanyProps | null = companies[0];
    if (!company) throw new Error("No Comany info");

    const user = await User.findById<userSchemaType>(userId);
    if (!user) throw new Error("User Not Found (UnAuthorized Access)");

    // const actionNeededTransactions = await Transaction.find<TransactionProps>({
    //   userId: user._id,
    //   status: "action-needed",
    // });

    // if (actionNeededTransactions.length >= 2)
    //   throw new Error(
    //     `You have ${actionNeededTransactions.length} Transaction that still requires your action(Upload Proof of payment). Settle the transaction before creating a new one.`
    //   );

    const body: BodyProps = await request.json();
    // if (body.amount < company.desposit.minimum)
    //   throw new Error(
    //     `You cannot deposit less than ${company.currency.symbol}${company.desposit.minimum}`
    //   );
    // if (body.amount > company.desposit.maximum)
    //   throw new Error(
    //     `You cannot deposit greater than ${company.currency.symbol}${company.desposit.maximum}`
    //   );

    // const nowPaymentData = {
    //   price_amount: body.amount,
    //   price_currency: company.currency.code.toLowerCase(),
    //   pay_currency: body.coinName,
    //   ipn_callback_url: company.baseUrl,
    //   order_id: userId,
    //   order_description: `Automatic coin payment deposit of ${body.amount}`,
    //   is_fixed_rate: true,
    //   is_fee_paid_by_user: false,
    // };

    // const { data: nowPaymentResult } = await axios.post(
    //   `https://api.nowpayments.io/v1/payment`,
    //   nowPaymentData,
    //   {
    //     headers: { "x-api-key": company.nowPaymentApi },
    //   }
    // );
    // // console.log(nowPaymentResult.error);
    // if (nowPaymentResult.message) throw new Error(nowPaymentResult.message);

    const newTransaction = new Transaction<TransactionProps>({
      title: "Deposit",
      amount: body.amount,
      status: "action-needed",
      userId,
      category: "deposit",
      type: body.type,
      coinName: body.coinName,
      automaticCoinPayment: body.nowPaymentResult,
      linkedTransactionId:
        body.linkedTransaction?.trim() === ""
          ? undefined
          : body.linkedTransaction,
    });
    const savedTransaction: TransactionProps = await newTransaction.save();

    const emailDesc = `You have a deposit of ${
      company.currency.symbol
    }${formatNumber(
      savedTransaction.amount
    )} that requires your attention. This payment will expire in 20 minutes`;
    const emailHtml = render(
      TransactionEmail({
        transaction: savedTransaction,
        fullname: user.fullname,
        description: emailDesc,
        company,
      })
    );

    await sendEmail(user.email, "Deposit", emailDesc, emailHtml, company);

    return NextResponse.json(savedTransaction);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
};
