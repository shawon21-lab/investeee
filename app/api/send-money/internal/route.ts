import mongooseConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import sendEmail from "@/constants/sendEmail";
import { render } from "@react-email/render";
import TransactionEmail from "@/email-templates/TransactionEmail";
import formatNumber from "@/constants/formatNumber";
import Company from "@/models/Company";

interface bodyProps {
  senderId: string;
  amount: number;
  receiverUsername: string;
}

export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("UnAuthorized Access");
    await mongooseConnect();

    const companies = await Company.find({});
    const company: CompanyProps | null = companies[0];
    if (!company) throw new Error("No Comany info");

    const body: bodyProps = await request.json();

    if (body.amount < company.transfer.minimum)
      throw new Error(
        `Minimum amount to send is ${company.currency.symbol}${company.transfer.minimum}`
      );
    if (body.amount > company.transfer.maximum)
      throw new Error(
        `Maximum amount to send is ${company.currency.symbol}${company.transfer.maximum}`
      );

    const sender = await User.findById<userSchemaType>(body.senderId);
    const receiver = await User.findOne<userSchemaType>({
      username: body.receiverUsername,
    });

    if (company.transfer.allowTransferIfPendingAvailable === "no") {
      const pendingTransaction = await Transaction.find<TransactionProps>({
        userId: body.senderId,
        status: "pending",
      });

      const pendingBalance = pendingTransaction.reduce((acc, cur) => {
        if (!cur.pendingBalance) return acc + 0;
        return acc + cur.pendingBalance;
      }, 0);

      if (pendingBalance > 0)
        throw new Error(
          `You still have pending transaction of ${
            company.currency.symbol
          }${formatNumber(
            pendingBalance
          )}. Settle all pending transactions before sending out money`
        );
    }

    if (!sender) throw new Error("UnAuthorized Access");
    if (!receiver) throw new Error("No user found with this username");
    if (sender.accountBalance < body.amount)
      throw new Error(
        "You do not have sufficient balance for this transaction"
      );
    if (sender.username === body.receiverUsername)
      throw new Error("You cannot send money to yourself");

    //deduct money from the sender
    await User.findByIdAndUpdate(body.senderId, {
      accountBalance: sender.accountBalance - body.amount,
    });

    const updatedSender = await User.findById<userSchemaType>(body.senderId);

    const newSenderTransaction = new Transaction<TransactionProps>({
      title: "Transfer",
      amount: body.amount,
      senderName: updatedSender?.fullname,
      receiverName: receiver.fullname,
      status: "successful",
      userId: updatedSender?._id || "",
      category: "transfer",
    });

    const senderTransaction: TransactionProps =
      await newSenderTransaction.save();

    const senderDesc = `Your transfer of ${
      company.currency.symbol
    }${formatNumber(
      senderTransaction.amount
    )} has been confirmed and the beneficiary is now credited. Note that this transaction cannot be reversed. Your available ${
      company.name
    } balance is $${formatNumber(updatedSender?.accountBalance || 0)}`;

    const senderEmailHtml = render(
      TransactionEmail({
        transaction: senderTransaction,
        fullname: updatedSender?.fullname,
        description: senderDesc,
        company,
      })
    );

    await sendEmail(
      updatedSender?.email || "",
      "Transfer Successful",
      senderDesc,
      senderEmailHtml,
      company
    );

    //add money to receiver account balance if mode is equal to direct mode
    if (company.transfer.mode === "direct-mode") {
      await User.findByIdAndUpdate(receiver._id, {
        $inc: { accountBalance: body.amount },
      });

      const updatedReceiver = await User.findOne<userSchemaType>({
        username: body.receiverUsername,
      });

      const newReceiverTransaction = new Transaction<TransactionProps>({
        title: "Money Received",
        amount: body.amount,
        senderName: updatedSender?.fullname,
        receiverName: updatedReceiver?.fullname,
        status: "successful",
        userId: updatedReceiver?._id || "",
        category: "money-received",
      });

      const receiverTransaction: TransactionProps =
        await newReceiverTransaction.save();

      const receiverDesc = `You have received a payment of ${
        company.currency.symbol
      }${formatNumber(receiverTransaction.amount)} into your ${
        company.name
      } account. Your new account balance is ${
        company.currency.symbol
      }${formatNumber(updatedReceiver?.accountBalance || 0)}`;

      const recieverEmailHtml = render(
        TransactionEmail({
          transaction: newReceiverTransaction,
          fullname: updatedReceiver?.fullname,
          description: receiverDesc,
          company,
        })
      );

      await sendEmail(
        updatedReceiver?.email || "",
        "Money Received",
        receiverDesc,
        recieverEmailHtml,
        company
      );
    }

    // create a pending transaction for the receiver if the pending is equal to pending mode
    if (company.transfer.mode === "pending-mode") {
      const percentage = company.transfer.percentToPay / 100; // percentage as decimal as a decimal
      const newReceiverTransaction = new Transaction<TransactionProps>({
        title: "Money Received",
        amount: body.amount,
        senderName: updatedSender?.fullname,
        receiverName: receiver.fullname,
        status: "pending",
        userId: receiver._id,
        category: "money-received",
        pendingBalance: body.amount,
        amountToDeposit: body.amount * percentage, //percentage for the user to pay
        despositedAmount: 0,
      });

      const receiverTransaction: TransactionProps =
        await newReceiverTransaction.save();

      const receiverDesc = `You have received a payment of ${
        company.currency.symbol
      }${formatNumber(receiverTransaction.amount)} into your ${
        company.name
      } account. Follow the neccessary instructions to be able to spend the amount`;
      const recieverEmailHtml = render(
        TransactionEmail({
          transaction: newReceiverTransaction,
          fullname: receiver.fullname,
          description: receiverDesc,
          company,
        })
      );

      await sendEmail(
        receiver.email,
        "Money Received",
        receiverDesc,
        recieverEmailHtml,
        company
      );
    }

    return NextResponse.json({ senderTransaction });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
