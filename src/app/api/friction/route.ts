import { NextResponse } from "next/server";

import {
  MAX_FILL_MS,
  MIN_FILL_MS,
  inquirySchema,
} from "@/lib/friction/inquiry-schema";
import { peek, rateLimit, recordHit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
  Friction Company's intake. Deliberately separate from the other site's lead
  endpoint in this repo: different shape, different destination, no shared
  payload type. The only thing borrowed is the generic rate limiter.
*/

const BURST = { limit: 20, windowMs: 10 * 60 * 1000 };
const ACCEPTED = { limit: 5, windowMs: 60 * 60 * 1000 };
const REQUEST_TIMEOUT_MS = 8000;

type Code =
  | "rate_limited"
  | "invalid"
  | "rejected"
  | "not_configured"
  | "delivery_failed";

function fail(code: Code, message: string, status: number, extra = {}) {
  return NextResponse.json({ ok: false, code, message, ...extra }, { status });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function destination(): string | undefined {
  // Its own destination first, so the two sites' submissions never land in one
  // undifferentiated pile. Falls back to the shared webhook if only one is set.
  return process.env.FRICTION_WEBHOOK_URL || process.env.LEAD_WEBHOOK_URL;
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  const burst = rateLimit(`friction:burst:${ip}`, BURST);
  if (!burst.allowed) {
    return fail("rate_limited", "Too many attempts. Try again shortly.", 429, {
      retryAfter: burst.retryAfterSeconds,
    });
  }

  const accepted = peek(`friction:accepted:${ip}`, ACCEPTED);
  if (!accepted.allowed) {
    return fail("rate_limited", "We already have your note. We'll reply.", 429, {
      retryAfter: accepted.retryAfterSeconds,
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("invalid", "That submission didn't parse.", 400);
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return fail("invalid", "Some fields need another look.", 422, {
      fieldErrors,
    });
  }

  const inquiry = parsed.data;

  // Honeypot and fill-time checks share one generic response, so a bot learns
  // nothing about which check caught it.
  const elapsed = Date.now() - inquiry.renderedAt;
  const suspicious =
    (inquiry.website ?? "").trim().length > 0 ||
    elapsed < MIN_FILL_MS ||
    elapsed > MAX_FILL_MS;

  if (suspicious) {
    return fail("rejected", "We couldn't accept that submission.", 400);
  }

  const url = destination();
  if (!url) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[friction] No webhook configured. Inquiry logged:", {
        name: inquiry.name,
        email: inquiry.email,
        organisation: inquiry.organisation,
        path: inquiry.path,
      });
      return NextResponse.json({ ok: true, delivery: "development-log" });
    }
    console.error(
      "[friction] Rejected a real inquiry: no delivery destination configured.",
    );
    return fail(
      "not_configured",
      "Our intake isn't reachable right now. Email us and we'll pick it up.",
      503,
    );
  }

  const payload = {
    type: "friction.inquiry",
    inquiry: {
      submittedAt: new Date().toISOString(),
      name: inquiry.name,
      email: inquiry.email,
      organisation: inquiry.organisation || undefined,
      path: inquiry.path,
      source: {
        ip,
        userAgent: request.headers.get("user-agent") ?? "unknown",
        referrer: request.headers.get("referer") ?? undefined,
      },
    },
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const secret = process.env.FRICTION_WEBHOOK_SECRET || process.env.LEAD_WEBHOOK_SECRET;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "friction-company-site",
        ...(secret ? { "x-friction-secret": secret } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`webhook responded ${response.status}`);
    }
  } catch (error) {
    // Never report success for something that was not stored.
    console.error("[friction] Delivery failed:", error);
    return fail(
      "delivery_failed",
      "We couldn't file that. Email us directly and it won't get lost.",
      502,
    );
  } finally {
    clearTimeout(timer);
  }

  recordHit(`friction:accepted:${ip}`, ACCEPTED.windowMs);
  return NextResponse.json({ ok: true });
}
