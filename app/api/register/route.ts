import User from "@/models/User";
import mongooseConnect from "../../../../lib/mongoose";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import WelcomeEmail from "@/email-templates/WelcomeEmail";
import sendEmail from "@/constants/sendEmail";
import Transaction from "@/models/Transaction";
import TransactionEmail from "@/email-templates/TransactionEmail";
import formatNumber from "@/constants/formatNumber";
import Company from "@/models/Company";

interface UserType {
  fullname: string;
  email: string;
  username: string;
  password: string;
  refUsername: string;
}

export const POST = async (req: Request) => {
  try {
    const body: UserType = await req.json();
    const { fullname, email, username, password } = body;
    await mongooseConnect();

    const companies = await Company.find({});
    const company: CompanyProps | null = companies[0];
    if (!company) throw new Error("No Comany info");

    const hashedPassword = bcrypt.hashSync(password, 12);
    // const bonus = 500;

    const isEmailExist = await User.find({ email });
    if (isEmailExist.length > 0) {
      throw new Error("User already exist. You can login instead");
    }

    const isUsernameExist = await User.find({ username });
    if (isUsernameExist.length > 0) {
      throw new Error("This username is being used by another user");
    }

    if (body.refUsername !== "NO REF") {
      const checkReferral = await User.findOne<userSchemaType>({
        username: body.refUsername,
      });
      if (!checkReferral) throw new Error("No Referral with this username");
    }

    const users = await User.find<userSchemaType>({});

    const newUser = new User({
      fullname,
      email,
      username,
      password: hashedPassword,
      refUsername: body.refUsername,
      role: users.length <= 0 ? "admin" : "user",
      manager: users.length <= 0 ? "yes" : "no",
    });
    const savedUser: userSchemaType = await newUser.save();

    if (company.welcomeEmail.status === "on") {
      const welcomeEmailhtml = render(
        WelcomeEmail({
          userFirstname: savedUser.fullname,
          company,
        })
      );

      await sendEmail(
        savedUser.email,
        "Welcome",
        "The platform that helps you make payment locally and others round the world",
        welcomeEmailhtml,
        company
      );
    }

    if (company.signupBonus.status === "on") {
      await User.findByIdAndUpdate(savedUser._id, {
        $inc: { accountBalance: company.signupBonus.amount },
      });

      const newAccountBalTransaction = new Transaction<TransactionProps>({
        title: "Sign Up Bonus",
        amount: company.signupBonus.amount,
        status: "successful",
        userId: savedUser._id,
        receiverName: "To Account Balance",
        senderName: `From ${company.name}`,
        category: "money-received",
      });
      const savedTransaction = await newAccountBalTransaction.save();

      const transactionEmailText = `You just received a sum of ${
        company.currency.symbol
      }${formatNumber(
        company.signupBonus.amount
      )} Sign up bonus to your Account balance. Thank you for choosing ${
        company.name
      }`;
      const transactionEmailHtml = render(
        TransactionEmail({
          transaction: savedTransaction,
          fullname: savedUser.fullname,
          description: transactionEmailText,
          company,
        })
      );

      await sendEmail(
        savedUser.email,
        "Sign Up Bonus",
        transactionEmailText,
        transactionEmailHtml,
        company
      );
    }

    return NextResponse.json(savedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
