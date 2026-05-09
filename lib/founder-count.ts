import { createClient } from "@supabase/supabase-js";

const FOUNDER_LIMIT = 100;

/**
 * Returns the number of distinct paid signups (capped at the founder limit).
 * A "signup" = a paid setup order OR an active Burnrate subscription.
 * Distinct by customer_email so a single customer who buys both doesn't count twice.
 *
 * Falls back to 0 on any error so the page never breaks.
 */
export async function getFounderCount(): Promise<{ count: number; total: number }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return { count: 0, total: FOUNDER_LIMIT };

  try {
    const supabase = createClient(url, serviceKey);

    const [ordersRes, subsRes] = await Promise.all([
      supabase
        .from("orders")
        .select("customer_email")
        .eq("stripe_payment_status", "paid"),
      supabase
        .from("burnrate_subscriptions")
        .select("customer_email")
        .eq("status", "active"),
    ]);

    const emails = new Set<string>();
    for (const row of ordersRes.data ?? []) {
      if (row.customer_email) emails.add(row.customer_email.toLowerCase());
    }
    for (const row of subsRes.data ?? []) {
      if (row.customer_email) emails.add(row.customer_email.toLowerCase());
    }

    return { count: Math.min(emails.size, FOUNDER_LIMIT), total: FOUNDER_LIMIT };
  } catch (err) {
    console.error("getFounderCount failed:", err);
    return { count: 0, total: FOUNDER_LIMIT };
  }
}

export const FOUNDER_TOTAL = FOUNDER_LIMIT;
