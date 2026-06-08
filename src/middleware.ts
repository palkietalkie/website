import { clerkMiddleware } from "@clerk/nextjs/server";

// Every route is public. /signup renders Clerk's <SignUp> in-page; /success verifies the Stripe session_id server-side and renders an error card if missing. There is no need to protect any route here — protecting /success bounced unauthed visitors to Clerk's hosted dev-portal sign-in (clerk-dev-subdomain.accounts.dev), which broke the funnel.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
