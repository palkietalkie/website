// Read a required environment variable; throw if it's missing or empty. Generic — not tied to any service, so it lives at the lib root, not inside a feature module.
export function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}
