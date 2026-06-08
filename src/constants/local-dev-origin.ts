// Local dev origin. Matches the port in package.json's `dev` / `start` scripts (3030). Used as a fallback for server-side `resolveOrigin()` when the request doesn't carry a host header (rare: typically only in tests or unusual `next dev` invocations). Production reads the host from `x-forwarded-host` / `host` and never hits this.
export const LOCAL_DEV_ORIGIN = "http://localhost:3030";
