import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;
      if (
        pathname === "/welcome" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/register")
      ) {
        return true;
      }
      return !!token;
    },
  },
  pages: {
    signIn: "/welcome",
  },
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
