import { NextResponse } from "next/server";

import {
  deliverLead,
  hasConfiguredDestination,
  type StoredLead,
} from "@/lib/lead-delivery";
import { MAX_FILL_MS, MIN_FILL_MS, leadSchema, normalizeWebsite } from "@/lib/lead-schema";
import { peek, rateLimit, recordHit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ErrorCode =
  | "invalid_json"
  | "validation_failed"
  | "rejected"
  | "rate_limited"
  | "not_configured"
  | "delivery_failed";

function fail(
  status: number,
  code: ErrorCode,
  message: string,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json({ ok: false, code, message, ...extra }, { status });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Stops a script hammering the endpoint, while leaving room for a real
 *  person who mistypes their email a few times. */
const BURST = { limit: 20, windowMs: 10 * 60 * 1000 };
/** Caps how many leads one address can actually file. */
const ACCEPTED = { limit: 5, windowMs: 60 * 60 * 1000 };

function tooMany(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      ok: false,
      code: "rate_limited" satisfies ErrorCode,
      message: "That's a few submissions in a row. Try again shortly.",
    },
    { status: 429, headers: { "retry-after": String(retryAfterSeconds) } },
  );
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  const burst = rateLimit(`lead:burst:${ip}`, BURST);
  if (!burst.allowed) return tooMany(burst.retryAfterSeconds);

  const accepted = peek(`lead:accepted:${ip}`, ACCEPTED);
  if (!accepted.allowed) return tooMany(accepted.retryAfterSeconds);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "invalid_json", "We couldn't read that submission.");
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return fail(400, "validation_failed", "Please check the highlighted fields.", {
      fieldErrors,
    });
  }

  const lead = parsed.data;

  // Honeypot: only automation ever fills this.
  if (lead.faxNumber) {
    return fail(400, "rejected", "We couldn't process that submission.");
  }

  // Timing: instant submissions and stale replays are not real people.
  if (typeof lead.startedAt === "number") {
    const elapsed = Date.now() - lead.startedAt;
    if (elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
      return fail(400, "rejected", "We couldn't process that submission.");
    }
  }

  if (!hasConfiguredDestination()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        "[lead] No LEAD_WEBHOOK_URL or Resend config found. Lead logged instead:",
        JSON.stringify({ ...lead, attribution: lead.attribution }, null, 2),
      );
      recordHit(`lead:accepted:${ip}`, ACCEPTED.windowMs);
      return NextResponse.json({ ok: true, delivery: "development-log" });
    }
    console.error("[lead] Rejected a real lead: no delivery destination configured.");
    return fail(
      503,
      "not_configured",
      "Our intake system isn't reachable right now. Email us and we'll pick it up straight away.",
    );
  }

  const storedLead: StoredLead = {
    submittedAt: new Date().toISOString(),
    firstName: lead.firstName,
    email: lead.email,
    companyName: lead.companyName,
    companyWebsite: normalizeWebsite(lead.companyWebsite),
    businessType: lead.businessType,
    leadVolume: lead.leadVolume,
    crm: lead.crm,
    attribution: lead.attribution ?? {},
    origin: lead.source ?? "audit-form",
    ...(lead.scorecard ? { scorecard: lead.scorecard } : {}),
    source: {
      ip,
      userAgent: request.headers.get("user-agent")?.slice(0, 400) ?? "unknown",
      pagePath: lead.attribution?.landingPath ?? "/",
    },
  };

  const outcome = await deliverLead(storedLead);

  if (!outcome.stored) {
    console.error("[lead] Delivery failed:", outcome.errors.join(" | "));
    return fail(
      502,
      "delivery_failed",
      "We couldn't save that just now. Email us and we'll pick it up straight away.",
    );
  }

  if (outcome.errors.length > 0) {
    // Stored, but one destination is unhealthy and should be looked at.
    console.warn("[lead] Partial delivery:", outcome.errors.join(" | "));
  }

  recordHit(`lead:accepted:${ip}`, ACCEPTED.windowMs);

  return NextResponse.json({
    ok: true,
    delivery: { webhook: outcome.webhook, email: outcome.email },
  });
}
