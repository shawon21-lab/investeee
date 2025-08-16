import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { render } from "@react-email/render";
import sendEmail from "@/constants/sendEmail";
import Company from "@/models/Company";

// Protectected route for user
export const POST = async (request: Request) => {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session?.user) throw new Error("UnAuthorized Access");
    // const userId = (session.user as { id: string }).id;
    await mongooseConnect();
    //code logic

    let initialCompany: CompanyProps | null;
    const companies = await Company.find<CompanyProps>({});

    if (companies.length <= 0) {
      const newCompany = new Company({ name: "Enter company name" });
      const savedCompany = await newCompany.save();
      initialCompany = savedCompany;
    } else {
      initialCompany = companies[0];
    }

    return NextResponse.json(initialCompany);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};

// // Protectected route for admin
// export const POST = async (request: Request) => {
//   try {
//     const session = await getServerSession(authOptions);
//     const userSession = session?.user as { role: string } | undefined;
//     if (!session?.user) throw new Error("UnAuthorized Access");
//     if (userSession?.role !== "admin")
//       throw new Error("This is a protected route");
//     await mongooseConnect();
//     //code logic

//     return NextResponse.json("something");
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message });
//   }
// };
