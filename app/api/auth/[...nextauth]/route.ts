import NextAuth, { type NextAuthOptions, type User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail, createUser } from "@/lib/dbHelpers";
import crypto from "crypto";

// Simple password hashing (for demo - use bcrypt in production)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
        signUp: { label: "Signing up", type: "hidden" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const isSignUp = credentials.signUp === "true";
          
          if (isSignUp) {
            // Signup flow - create new user if doesn't exist
            const existingUser = await getUserByEmail(credentials.email);
            
            if (existingUser) {
              // User already exists - return error that NextAuth will handle
              throw new Error("Email already in use");
            }

            // Create new user
            console.log(`Creating user with email: ${credentials.email}`);
            const newUser = await createUser(
              credentials.email,
              credentials.email.split("@")[0],
              hashPassword(credentials.password)
            );

            console.log(`User created successfully: ${newUser.email}`);

            return {
              id: newUser.id.toString(),
              email: newUser.email,
              name: newUser.name || credentials.email.split("@")[0],
            } as NextAuthUser;
          } else {
            // Login flow - verify existing user
            const user = await getUserByEmail(credentials.email);
            
            if (!user || !user.password) {
              throw new Error("Invalid email or password");
            }

            if (!verifyPassword(credentials.password, user.password)) {
              throw new Error("Invalid email or password");
            }

            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name || user.email.split("@")[0],
            } as NextAuthUser;
          }
        } catch (error) {
          console.error("Auth error:", error);
          // Re-throw to let NextAuth handle it
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "test-secret-change-in-production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
