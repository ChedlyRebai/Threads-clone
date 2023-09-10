import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware

// publicRoutes :['/' ,'/api/webhook/clerk']  =>  this is the route that will be public and not protected by clerk
// ignoredRoutes:['/api/webhook/clerk']  =>  this is the route that will be ignored by clerk and not protected by clerk
// matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]  =>  this is the route that will be protected by clerk

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook/clerk"],
  ignoredRoutes: ["/api/webhook/clerk"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
