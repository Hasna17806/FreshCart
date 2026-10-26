
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { pool } from "@/lib/db";
import { createSession } from "@/lib/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) {
        return false;
      }

      try {
        const email = user.email.toLowerCase();

        const result = await pool.query(
          "SELECT id FROM users WHERE email = $1",
          [email]
        );

        let userId;

        if (result.rows.length > 0) {
          userId = result.rows[0].id;
        } else {
          const inserted = await pool.query(
            "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id",
            [user.name || "FreshCart User", email]
          );
          userId = inserted.rows[0].id;
        }

        // Store the database user ID for the next step.
        user.id = String(userId);

        return true;
      } catch (error) {
        console.error("Google sign-in error:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user?.id) {
        token.dbUserId = user.id;
      }
      return token;
    },
  },
});
