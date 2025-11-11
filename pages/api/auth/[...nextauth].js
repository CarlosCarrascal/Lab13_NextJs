import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        const { getUserRole, setUserDetails, setUserRole } = await import(
          "../../../lib/userRoles"
        );

        const userId = token.sub;

        // Guardar detalles del usuario
        setUserDetails(userId, {
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account?.provider,
        });

        // Asignar role
        const adminEmails = process.env.ADMIN_EMAILS
          ? process.env.ADMIN_EMAILS.split(",").map((email) => email.trim())
          : [];

        const currentRole = getUserRole(userId);
        const newRole = adminEmails.includes(user.email)
          ? "admin"
          : currentRole || "user";

        // Guardar role
        setUserRole(userId, newRole);
        token.role = newRole;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      return session;
    },
  },
};

export default NextAuth(authOptions);
