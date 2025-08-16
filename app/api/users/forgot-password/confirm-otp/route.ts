import mongooseConnect from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

interface BodyProps {
  email: string;
  otp: string;
}

// Protectected route for user
export const POST = async (request: Request) => {
  try {
    await mongooseConnect();
    //code logic
    const { email, otp }: BodyProps = await request.json();

    const user = await User.findOne<userSchemaType>({ email });
    if (!user) throw new Error("User Not Found");

    if (user.recoveryCode !== otp) throw new Error("Invalid code");
    if (Date.now() > user.recoveryCodeExpiry)
      throw new Error("The code you entered is expired");

    return NextResponse.json({ email, otp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
