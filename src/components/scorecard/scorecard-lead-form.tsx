"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, Check } from "lucide-react";

import { Button, ButtonBadge, buttonVariants } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { brand, cta } from "@/lib/site";
import type { Answers, ScorecardResult } from "@/lib/scorecard";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const control = "h-12 rounded-full border-hairline bg-background px-5 text-[0.9375rem]";

const websitePattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

/**
 * Deliberately four fields, not seven. The scorecard already captured trade,
 * volume, job value and CRM, so asking for them again would be friction we've
 * already earned our way past.
 */
export function ScorecardLeadForm({
  answers,
  result,
  bookingUrl,
}: {
  answers: Answers;
  result: ScorecardResult;
  bookingUrl?: string;
}) {
  const uid = useId();
  const openedAt = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [values, setValues] = useState({
    firstName: "",
    email: "",
    companyName: "",
    companyWebsite: "",
    faxNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  function validate() {
    const next: Record<string, string> = {};
    if (!values.firstName.trim()) next.firstName = "Tell us who to address it to.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email.trim()))
      next.email = "That email doesn't look right.";
    if (!values.companyName.trim()) next.companyName = "Which company is this for?";
    if (!websitePattern.test(values.companyWebsite.trim()))
      next.companyWebsite = "Use a web address like acme-roofing.com.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "submitting") return;
    if (!validate()) return;

    setStatus("submitting");
    setFormError(null);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          email: values.email,
          companyName: values.companyName,
          companyWebsite: values.companyWebsite,
          // Carried over from the questions they already answered.
          businessType: answers.trade,
          leadVolume: answers.leadVolume,
          crm: answers.crm,
          faxNumber: values.faxNumber,
          ...(openedAt.current > 0 ? { startedAt: openedAt.current } : {}),
          attribution: getAttribution(),
          source: "scorecard",
          scorecard: {
            score: result.score,
            band: result.band.label,
            lostPerMonth: result.lostPerMonth,
            recoverablePerYear: result.recoverablePerYear,
            topLeak: result.leaks[0]?.label ?? "",
            answers,
          },
        }),
      });

      const data = (await response.json().catch(() => ({ ok: false }))) as {
        ok?: boolean;
        message?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!response.ok || !data.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setFormError(
          data.message ?? "Something went wrong on our end. Please try again in a moment.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      track("scorecard_lead_submitted", {
        score: result.score,
        band: result.band.key,
        trade: answers.trade,
      });
    } catch {
      setFormError("We couldn't reach our servers. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[2rem] bg-brand p-7 text-brand-foreground sm:p-9">
        <div className="flex size-12 items-center justify-center rounded-full bg-brand-foreground">
          <Check className="size-5 text-brand" strokeWidth={2.5} aria-hidden />
        </div>
        <h2 className="mt-6 text-h3 font-medium">On its way, {values.firstName}.</h2>
        <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-brand-foreground/80">
          We&apos;ll go through {values.companyName}&apos;s answers properly and come back
          within one business day with the specific plays we&apos;d run first — and an honest
          view on whether this is worth doing for you at all.
        </p>
        {bookingUrl ? (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("booking_clicked", { source: "scorecard" })}
            className={cn(buttonVariants({ variant: "default", size: "xl" }), "mt-7")}
          >
            {cta.booking}
            <ButtonBadge tone="brand">
              <ArrowRight strokeWidth={2.25} />
            </ButtonBadge>
          </a>
        ) : null}
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} noValidate className="relative rounded-[2rem] bg-brand p-7 sm:p-9">
      <h2 className="text-h3 font-medium text-brand-foreground">
        Want the version with your name on it?
      </h2>
      <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-brand-foreground/80">
        We&apos;ll look at your answers by hand and send back what we&apos;d actually do
        first, in what order, and what it would realistically be worth. Four fields — we
        already have the rest from your answers.
      </p>

      <div
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={`${uid}-fax`}>Fax number</label>
        <input
          id={`${uid}-fax`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.faxNumber}
          onChange={(e) => setValues({ ...values, faxNumber: e.target.value })}
        />
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {(
          [
            ["firstName", "First name", "Dave", "given-name"],
            ["email", "Work email", "dave@acmeroofing.com", "email"],
            ["companyName", "Company name", "Acme Roofing", "organization"],
            ["companyWebsite", "Company website", "acmeroofing.com", "url"],
          ] as const
        ).map(([key, label, placeholder, autoComplete]) => (
          <Field key={key} data-invalid={errors[key] ? true : undefined}>
            <FieldLabel htmlFor={`${uid}-${key}`} className="text-brand-foreground">
              {label}
            </FieldLabel>
            <Input
              id={`${uid}-${key}`}
              type={key === "email" ? "email" : "text"}
              inputMode={key === "email" ? "email" : key === "companyWebsite" ? "url" : undefined}
              autoComplete={autoComplete}
              placeholder={placeholder}
              className={`${control} border-transparent bg-card`}
              aria-invalid={errors[key] ? true : undefined}
              value={values[key]}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
            />
            <FieldError>{errors[key]}</FieldError>
          </Field>
        ))}
      </div>

      {formError ? (
        <div
          role="alert"
          className="mt-5 flex gap-3 rounded-[1.25rem] bg-brand-foreground/10 p-4 text-sm text-brand-foreground"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            {formError}{" "}
            <a
              href={`mailto:${brand.supportEmail}?subject=Scorecard%20result`}
              className="font-medium underline underline-offset-4"
            >
              Email {brand.supportEmail}
            </a>{" "}
            and we&apos;ll pick it up.
          </p>
        </div>
      ) : null}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="default"
          size={isSubmitting ? "xl-plain" : "xl"}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Spinner /> Sending…
            </>
          ) : (
            <>
              Send me the breakdown
              <ButtonBadge tone="brand">
                <ArrowRight strokeWidth={2.25} />
              </ButtonBadge>
            </>
          )}
        </Button>
        <p className="text-[0.8125rem] text-brand-foreground/70">
          No lists, no resale. Unsubscribe any time.
        </p>
      </div>
    </form>
  );
}
