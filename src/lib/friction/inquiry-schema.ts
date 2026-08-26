import { z } from "zod";

/** Minimum time a human plausibly needs, in milliseconds. */
export const MIN_FILL_MS = 2000;
/** Older than this is a stale tab or a replayed payload. */
export const MAX_FILL_MS = 1000 * 60 * 60 * 6;

const trimmed = (max: number) => z.string().trim().max(max);

/*
  Three fields. A company that sells the removal of unnecessary steps does not
  get to ask for eleven of them, and every field here is one the first reply
  genuinely cannot be written without.
*/
export const inquirySchema = z.object({
  name: trimmed(80).min(1, "Who should we reply to?"),
  email: trimmed(160)
    .min(1, "We need somewhere to send the reply.")
    .pipe(z.email("That address doesn't look right.")),
  organisation: trimmed(120).optional().or(z.literal("")),
  path: trimmed(2000).min(
    12,
    "A sentence is enough. What should happen, and what gets in the way?",
  ),

  /**
   * Honeypot. Permissive by design so a filled value never surfaces as a field
   * error — the route rejects it with a generic message instead.
   */
  website: z.string().max(200).optional(),
  /** Client timestamp of first render, used for the fill-time check. */
  renderedAt: z.number().int().nonnegative(),
});

export type Inquiry = z.infer<typeof inquirySchema>;

/*
  What the form itself validates. `renderedAt` is stamped at submit time from a
  ref, not held as a field — validating the form against the full schema made
  every submission fail silently on a value the user could never supply.
*/
export const clientInquirySchema = inquirySchema.omit({ renderedAt: true });
export type InquiryInput = z.infer<typeof clientInquirySchema>;

export const inquiryFieldOrder = [
  "name",
  "email",
  "organisation",
  "path",
] as const;
