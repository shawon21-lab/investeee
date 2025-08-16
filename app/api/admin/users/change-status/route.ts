import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import User from "@/models/User";

interface BodyProps {
  status: "blocked" | "active";
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

    const body: BodyProps = await request.json();

    const admin = await User.findById<userSchemaType>(userSession.id);
    if (!admin) throw new Error("You're not an Admin");

    const user = await User.findById<userSchemaType>(body.userId);
    if (!user) throw new Error("No user found");

    if (
      admin.manager === "no" &&
      user.role === "admin" &&
      body.status === "blocked"
    )
      throw new Error("You don't have the permission to block an admin");

    if (
      admin.manager === "yes" &&
      admin._id.toString() === user._id.toString() &&
      body.status === "blocked"
    )
      throw new Error("As a manager, you can't block yourself");

    await User.findByIdAndUpdate(user._id, { status: body.status });

    return NextResponse.json({ message: "Status changed" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
