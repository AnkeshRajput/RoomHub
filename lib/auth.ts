import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connect from "./db";
import User from "../models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connect();
        const user = await User.findOne({ email: credentials.email }).lean();
        if (!user) return null;
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password as string,
        );
        if (!isValid) return null;
        // Return a minimal user object — NextAuth will store it in the session
        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
        } as { id?: string; role?: string };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      // Attach user properties to the token on sign in
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = (user as { id?: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose role/id on the client session object
      (session.user as { role?: string }).role = token.role as
        | string
        | undefined;
      (session.user as { id?: string }).id = token.id as string | undefined;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
