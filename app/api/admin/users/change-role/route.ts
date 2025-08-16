import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import User from "@/models/User";

interface BodyProps {
  role: "admin" | "user";
  userId: string;
}

// Protectected route for admin manager
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

    const body: BodyProps = await request.json();

    const admin = await User.findById<userSchemaType>(userSession.id);
    if (!admin) throw new Error("You're not an Admin");

    if (admin.manager !== "yes")
      throw new Error("Only Manager can change user role");

    if (admin._id.toString() === body.userId && body.role === "user")
      throw new Error(
        "Unfortunately, as a manager you cannot change role to user"
      );

    const user = await User.findById<userSchemaType>(body.userId);
    if (!user) throw new Error("No user found");

    await User.findByIdAndUpdate(user._id, { role: body.role });

    return NextResponse.json({ message: "Role changed" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
