import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";

interface BodyProps {
  fullname: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  country: string;
  city: string;
  address: string;
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
    if (!user) throw new Error("User Not Found");

    if (
      admin.manager !== "yes" &&
      user.role === "admin" &&
      user._id.toString() !== admin._id.toString()
    )
      throw new Error("Only managers can Edit other admins details");

    const updatedUser = await User.findByIdAndUpdate(body.userId, {
      fullname:
        body.fullname.trim() === ("" || undefined) ? undefined : body.fullname,

      username:
        body.username.trim() === ("" || undefined) ? undefined : body.username,

      email: body.email.trim() === ("" || undefined) ? undefined : body.email,

      phoneNumber:
        body.phoneNumber.trim() === ("" || undefined)
          ? undefined
          : body.phoneNumber,

      dateOfBirth:
        body.dateOfBirth.trim() === ("" || undefined)
          ? undefined
          : body.dateOfBirth,

      country:
        body.country.trim() === ("" || undefined) ? undefined : body.country,

      city: body.city.trim() === ("" || undefined) ? undefined : body.city,

      address:
        body.address.trim() === ("" || undefined) ? undefined : body.address,
    });

    if (!updatedUser) throw new Error("No user Found");

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
