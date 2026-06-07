/**
 * Fetch the live free-plan caps from the backend so every "X min/day, Y min/week" copy on the marketing site stays in sync with whatever `app/routers/entitlement/constants.py` enforces.
 *
 * Cached for 5 minutes — these numbers change rarely, and we don't need real-time freshness for marketing copy. Falls back to the current production values (10/30) if the backend is unreachable so a transient outage doesn't blow up a render.
 */

export type PlanLimits = {
  freeMinutesPerDay: number;
  freeMinutesPerWeek: number;
};

const FALLBACK: PlanLimits = {
  freeMinutesPerDay: 10,
  freeMinutesPerWeek: 30,
};

export async function fetchPlanLimits(): Promise<PlanLimits> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://palkietalkie-api-dev.fly.dev";
  try {
    const res = await fetch(`${base}/plan_limits`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return FALLBACK;
    const body = (await res.json()) as {
      free_minutes_per_day: number;
      free_minutes_per_week: number;
    };
    return {
      freeMinutesPerDay: body.free_minutes_per_day,
      freeMinutesPerWeek: body.free_minutes_per_week,
    };
  } catch {
    return FALLBACK;
  }
}
