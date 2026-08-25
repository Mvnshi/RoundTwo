import { brand } from "@/lib/site";

export type StoredLead = {
  submittedAt: string;
  firstName: string;
  email: string;
  companyName: string;
  companyWebsite: string;
  businessType: string;
  leadVolume: string;
  crm: string;
  attribution: Record<string, string | undefined>;
  /** Present when the lead came through the scorecard. */
  scorecard?: Record<string, unknown>;
  origin: "audit-form" | "scorecard";
  source: {
    ip: string;
    userAgent: string;
    pagePath: string;
  };
};

export type DeliveryOutcome = {
  webhook: "skipped" | "ok" | "failed";
  email: "skipped" | "ok" | "failed";
  /** True only when at least one destination actually accepted the lead. */
  stored: boolean;
  errors: string[];
};

const REQUEST_TIMEOUT_MS = 8000;

async function postWebhook(url: string, lead: StoredLead): Promise<void> {
  const secret = process.env.LEAD_WEBHOOK_SECRET;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": `${brand.name}-site`,
      ...(secret ? { "x-roundtwo-secret": secret } : {}),
    },
    body: JSON.stringify({ type: "lead.created", lead }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`webhook responded ${response.status}`);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function notificationHtml(lead: StoredLead): string {
  const rows: Array<[string, string]> = [
    ["Name", lead.firstName],
    ["Email", lead.email],
    ["Company", lead.companyName],
    ["Website", lead.companyWebsite],
    ["Business type", lead.businessType],
    ["Leads / month", lead.leadVolume],
    ["CRM", lead.crm],
    ["Submitted", lead.submittedAt],
    ["Came from", lead.origin === "scorecard" ? "Lead Leak Scorecard" : "Audit form"],
    ...(lead.scorecard
      ? (Object.entries(lead.scorecard)
          .filter(([, v]) => typeof v !== "object")
          .map(([k, v]) => [`Scorecard · ${k}`, String(v)]) as Array<[string, string]>)
      : []),
    ["Landing page", lead.attribution.landingUrl ?? "—"],
    ["Referrer", lead.attribution.referrer ?? "—"],
    ["utm_source", lead.attribution.utm_source ?? "—"],
    ["utm_medium", lead.attribution.utm_medium ?? "—"],
    ["utm_campaign", lead.attribution.utm_campaign ?? "—"],
    ["utm_content", lead.attribution.utm_content ?? "—"],
    ["utm_term", lead.attribution.utm_term ?? "—"],
    ["gclid", lead.attribution.gclid ?? "—"],
    ["fbclid", lead.attribution.fbclid ?? "—"],
  ];

  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#63645C;font:13px/1.5 -apple-system,Segoe UI,sans-serif;white-space:nowrap">${escapeHtml(
          label,
        )}</td><td style="padding:6px 0;color:#171816;font:13px/1.5 -apple-system,Segoe UI,sans-serif">${escapeHtml(
          value,
        )}</td></tr>`,
    )
    .join("");

  return `<div style="background:#F6F4EF;padding:24px"><div style="max-width:560px;margin:0 auto;background:#FFFEFB;border:1px solid #E2DED3;border-radius:8px;padding:24px"><p style="margin:0 0 4px;font:11px/1.4 ui-monospace,SFMono-Regular,monospace;letter-spacing:.14em;text-transform:uppercase;color:#63645C">${
    lead.origin === "scorecard" ? "New scorecard result" : "New recovery audit request"
  }</p><h1 style="margin:0 0 20px;font:600 20px/1.2 -apple-system,Segoe UI,sans-serif;color:#171816">${escapeHtml(
    lead.companyName,
  )}</h1><table style="border-collapse:collapse">${body}</table></div></div>`;
}

async function sendNotificationEmail(lead: StoredLead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!apiKey || !to) throw new Error("resend not configured");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? `${brand.name} <onboarding@resend.dev>`,
      to: [to],
      reply_to: lead.email,
      subject:
        lead.origin === "scorecard"
          ? `Scorecard ${lead.scorecard?.score ?? "?"}/100 — ${lead.companyName} (${lead.businessType}, ${lead.leadVolume} leads/mo)`
          : `Recovery audit — ${lead.companyName} (${lead.businessType}, ${lead.leadVolume} leads/mo)`,
      html: notificationHtml(lead),
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`resend responded ${response.status} ${detail.slice(0, 200)}`);
  }
}

/**
 * Attempts every configured destination. The lead counts as stored if at
 * least one accepted it; the caller must not report success otherwise.
 */
export async function deliverLead(lead: StoredLead): Promise<DeliveryOutcome> {
  const outcome: DeliveryOutcome = {
    webhook: "skipped",
    email: "skipped",
    stored: false,
    errors: [],
  };

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      await postWebhook(webhookUrl, lead);
      outcome.webhook = "ok";
    } catch (firstError) {
      // One retry covers cold-started automation endpoints and blips.
      await new Promise((resolve) => setTimeout(resolve, 600));
      try {
        await postWebhook(webhookUrl, lead);
        outcome.webhook = "ok";
      } catch (secondError) {
        outcome.webhook = "failed";
        outcome.errors.push(
          `webhook: ${(firstError as Error).message} / ${(secondError as Error).message}`,
        );
      }
    }
  }

  if (process.env.RESEND_API_KEY && process.env.CONTACT_NOTIFICATION_EMAIL) {
    try {
      await sendNotificationEmail(lead);
      outcome.email = "ok";
    } catch (error) {
      outcome.email = "failed";
      outcome.errors.push(`email: ${(error as Error).message}`);
    }
  }

  outcome.stored = outcome.webhook === "ok" || outcome.email === "ok";
  return outcome;
}

export function hasConfiguredDestination(): boolean {
  return Boolean(
    process.env.LEAD_WEBHOOK_URL ||
      (process.env.RESEND_API_KEY && process.env.CONTACT_NOTIFICATION_EMAIL),
  );
}
