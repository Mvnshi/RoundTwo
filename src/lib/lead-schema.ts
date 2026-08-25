import { z } from "zod";

import { businessTypes, crmOptions, leadVolumes } from "@/lib/content";

/** Minimum time a human plausibly needs to fill the form, in milliseconds. */
export const MIN_FILL_MS = 2500;
/** Anything older than this is a stale tab or a replayed payload. */
export const MAX_FILL_MS = 1000 * 60 * 60 * 6;

const trimmed = (max: number) => z.string().trim().max(max);

const websitePattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

export const attributionSchema = z
  .object({
    utm_source: z.string().max(512).optional(),
    utm_medium: z.string().max(512).optional(),
    utm_campaign: z.string().max(512).optional(),
    utm_content: z.string().max(512).optional(),
    utm_term: z.string().max(512).optional(),
    gclid: z.string().max(512).optional(),
    fbclid: z.string().max(512).optional(),
    msclkid: z.string().max(512).optional(),
    ttclid: z.string().max(512).optional(),
    li_fat_id: z.string().max(512).optional(),
    landingUrl: z.string().max(2048).optional(),
    landingPath: z.string().max(2048).optional(),
    referrer: z.string().max(2048).optional(),
    firstSeenAt: z.string().max(64).optional(),
  })
  .partial();

export const leadSchema = z.object({
  firstName: trimmed(80).min(1, "Tell us who to address the audit to."),
  email: trimmed(160)
    .min(1, "We need an email to send the audit to.")
    .pipe(z.email("That email doesn't look right.")),
  companyName: trimmed(120).min(1, "Which company is this for?"),
  companyWebsite: trimmed(200)
    .min(1, "Your website helps us look at your lead flow before we talk.")
    .refine((value) => websitePattern.test(value), "Use a web address like acme-roofing.com."),
  businessType: z.enum(businessTypes, { message: "Pick the closest match." }),
  leadVolume: z.enum(leadVolumes, { message: "A rough range is fine." }),
  crm: trimmed(80).min(1, "Even “spreadsheets” is a useful answer."),

  /**
   * Honeypot. Deliberately permissive so a filled value never surfaces as a
   * field error — the route rejects it with a generic message instead, which
   * keeps the trap invisible.
   */
  faxNumber: z.string().max(200).optional(),
  /** Epoch ms recorded when the form was opened. */
  startedAt: z.number().int().nonnegative().optional(),
  attribution: attributionSchema.optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadPayload = z.output<typeof leadSchema>;

export const crmSuggestions = crmOptions;

/** Adds a scheme so downstream tools get a clickable URL. */
export function normalizeWebsite(value: string): string {
  const trimmedValue = value.trim();
  if (!trimmedValue) return "";
  return /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
}
