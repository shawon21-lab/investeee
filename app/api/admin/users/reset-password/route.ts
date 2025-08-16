import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import Company from "@/models/Company";
import bcrypt from "bcrypt";
import User from "@/models/User";
import CustomEmail from "@/email-templates/CustomEmail";

interface BodyProps {
  notifyUser: "yes" | "no";
  userId: string;
}

// Protectected route for admin
export const POST = async (request: Request) => {
  try {
    const session = await getServerSession(authOptions);
    const userSession = session?.user as
      | { role: string; id: string }
      | undefined;
    if (!session?.user) throw new Error("UnAuthorized Access");
    if (userSession?.role !== "admin")
      throw new Error("This is a protected route");
    await mongooseConnect();
    //code logic

    const companies = await Company.find({});
    const company: CompanyProps | null = companies[0];
    if (!company) throw new Error("No Comany info");

    const body: BodyProps = await request.json();

    const admin = await User.findById<userSchemaType>(userSession.id);
    if (!admin) throw new Error("You're not an Admin");

    const user = await User.findById<userSchemaType>(body.userId);
    if (!user) throw new Error("User Not Found");

    if (
      admin.manager !== "yes" &&
      user.role === "admin" &&
      user._id.toString() !== admin._id.toString()
    )
      throw new Error("Only manager can reset other admins password");

    const hashedPassword = bcrypt.hashSync("12345", 12);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    if (body.notifyUser === "yes") {
      const emailText = `We want to inform you that your password for ${company.name} has been reset to the default value: "12345".`;

      const emailHtml = render(
        CustomEmail({
          username: user.username,
          message: `We want to inform you that your password for ${company.name} has been reset to the default value: "12345".`,
          company,
        })
      );

      await sendEmail(
        user.email,
        "Password Reset",
        emailText,
        emailHtml,
        company
      );
    }
    return NextResponse.json({
      message: "Pass word has been reset successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
