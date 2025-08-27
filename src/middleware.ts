import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/auth-callback"],
};

export default withAuth(undefined, {
  loginPage: "/api/auth/login", // Kinde's Next.js SDK provides this endpoint
  isReturnToCurrentPage: true, // after login, send them back to the original page
});
