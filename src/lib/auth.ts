import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail, createUser, updateUserPassword } from "@/lib/dbHelpers";
import bcrypt from "bcrypt";
import crypto from "crypto";

// Secure password hashing with bcrypt
async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

// ============================================================================
// LEGACY SHA256 MIGRATION FUNCTIONS (for existing users only)
// ============================================================================

/**
 * Check if a password hash is SHA256 format (64 hex characters)
 */
function isSHA256Hash(hash: string): boolean {
    return /^[a-f0-9]{64}$/i.test(hash);
}

/**
 * Legacy SHA256 verification (ONLY for migration)
 */
function verifySHA256Password(password: string, hash: string): boolean {
    const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
    return sha256Hash === hash;
}

/**
 * Migrate user from SHA256 to bcrypt and update database
 */
async function migratePasswordToBcrypt(
    userId: string,
    email: string,
    password: string
): Promise<void> {
    console.log(`🔄 Migrating password for user ${email} from SHA256 to bcrypt`);
    const newHash = await hashPassword(password);
    await updateUserPassword(userId, newHash);
    console.log(`✅ Password migration successful for user ${email}`);
}

export const authOptions: NextAuthOptions = {
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
                        const hashedPassword = await hashPassword(credentials.password);
                        const newUser = await createUser(
                            credentials.email,
                            credentials.email.split("@")[0],
                            hashedPassword
                        );

                        console.log(`User created successfully: ${newUser.email}`);

                        return {
                            id: newUser.id.toString(),
                            email: newUser.email,
                            name: newUser.name || credentials.email.split("@")[0],
                        };
                    } else {
                        // Login flow - verify existing user
                        const user = await getUserByEmail(credentials.email);

                        if (!user || !user.password) {
                            throw new Error("Invalid email or password");
                        }

                        // Check if this is a legacy SHA256 password that needs migration
                        if (isSHA256Hash(user.password)) {
                            console.log(`🔍 Detected SHA256 password for user ${user.email}`);

                            // Verify with legacy SHA256
                            if (!verifySHA256Password(credentials.password, user.password)) {
                                throw new Error("Invalid email or password");
                            }

                            // Password is correct - migrate to bcrypt
                            try {
                                await migratePasswordToBcrypt(user.id, user.email, credentials.password);
                            } catch (migrationError) {
                                console.error('⚠️ Password migration failed, but allowing login:', migrationError);
                                // Continue with login even if migration fails - user can still access account
                            }

                            return {
                                id: user.id.toString(),
                                email: user.email,
                                name: user.name || user.email.split("@")[0],
                            };
                        }

                        // Modern bcrypt verification
                        const isPasswordValid = await verifyPassword(credentials.password, user.password);
                        if (!isPasswordValid) {
                            throw new Error("Invalid email or password");
                        }

                        return {
                            id: user.id.toString(),
                            email: user.email,
                            name: user.name || user.email.split("@")[0],
                        };
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
        maxAge: 24 * 60 * 60, // 24 hours
        updateAge: 60 * 60, // Update session every hour
    },
    jwt: {
        maxAge: 24 * 60 * 60, // 24 hours
    },
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production'
                ? '__Secure-next-auth.session-token'
                : 'next-auth.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    secret: process.env.NEXTAUTH_SECRET || "test-secret-change-in-production",
};
