import { auth, currentUser } from "@clerk/nextjs/server";

// Thin wrappers around Clerk so callers can be tested without poking process.env or the Clerk SDK directly.

export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}

export async function getCurrentUserEmail(): Promise<string | null> {
  const user = await currentUser();
  return user?.emailAddresses[0]?.emailAddress ?? null;
}
