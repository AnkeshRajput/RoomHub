import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Middleware logic: protect /protected/* and /dashboard/* routes
    // withAuth handles redirect to login if not authenticated
  },
  {
    callbacks: {
      authorized({ token }) {
        // Allow access if token exists (user is authenticated)
        return !!token;
      },
    },
  },
);

// Protect all routes under /protected/* and /dashboard/*
export const config = {
  matcher: ["/protected/:path*", "/dashboard/:path*"],
};
