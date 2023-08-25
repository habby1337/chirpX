import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware

// make tcpr routes public
export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/trpc/posts.getAll",
    "/@:username",
    "/post/:id",
    "/api/trpc/posts.getPostsByUserId,profile.getUserByUsername",
    "/api/trpc/posts.getById",
  ],
  // ignoredRoutes: ["/api/trpc/posts.getAll"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
