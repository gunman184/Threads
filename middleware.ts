import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhook/clerk",
  "/sign-up(.*)", // note the (.*) at the end
  "/sign-in(.*)",
  "/api/uploadthing",
]);

const isIgnoredRoute = createRouteMatcher(["/api/webhook/clerk"]);

export default clerkMiddleware(async (auth, req) => {
  if (isIgnoredRoute(req)) {
    return;
  }
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
