"use client";

import { useEffect, useId, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowRight, Check } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { businessTypes, crmOptions, leadVolumes } from "@/lib/content";
import { leadSchema, type LeadInput } from "@/lib/lead-schema";
import { brand, cta } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

type LeadResponse = {
  ok: boolean;
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
};

const controlClass = "h-11 rounded-lg bg-card text-[0.9375rem]";

export function AuditForm({
  onDone,
  bookingUrl,
}: {
  onDone?: () => void;
  bookingUrl?: string;
}) {
  const uid = useId();
  const openedAt = useRef(0);
  const hasStarted = useRef(false);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ firstName: string; companyName: string } | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      email: "",
      companyName: "",
      companyWebsite: "",
      crm: "",
      faxNumber: "",
    },
  });

  // Recorded after mount so the render stays pure; the server uses it to
  // reject submissions that arrive faster than a human could type.
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  function markStarted() {
    if (hasStarted.current) return;
    hasStarted.current = true;
    track("audit_form_started");
  }

  async function onSubmit(values: LeadInput) {
    if (status === "submitting") return;
    setStatus("submitting");
    setFormError(null);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          ...(openedAt.current > 0 ? { startedAt: openedAt.current } : {}),
          attribution: getAttribution(),
        }),
      });

      const data = (await response.json().catch(() => ({ ok: false }))) as LeadResponse;

      if (!response.ok || !data.ok) {
        if (data.fieldErrors) {
          for (const [field, message] of Object.entries(data.fieldErrors)) {
            setError(field as keyof LeadInput, { type: "server", message });
          }
        }
        setFormError(
          data.message ?? "Something went wrong on our end. Please try again in a moment.",
        );
        setStatus("error");
        return;
      }

      setSubmitted({ firstName: values.firstName, companyName: values.companyName });
      setStatus("success");
      track("audit_form_submitted", {
        business_type: values.businessType,
        lead_volume: values.leadVolume,
        crm: values.crm,
      });
    } catch {
      setFormError(
        "We couldn't reach our servers. Check your connection and try again.",
      );
      setStatus("error");
    }
  }

  if (status === "success" && submitted) {
    return <AuditSuccess {...submitted} bookingUrl={bookingUrl} onDone={onDone} />;
  }

  const isSubmitting = status === "submitting";

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      onChange={markStarted}
      className="flex flex-col gap-6"
    >
      {/* Honeypot: positioned off-screen rather than display:none so more bots fill it. */}
      <div aria-hidden className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-fax`}>Fax number</label>
        <input id={`${uid}-fax`} type="text" tabIndex={-1} autoComplete="off" {...register("faxNumber")} />
      </div>

      <FieldGroup className="gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.firstName)}>
            <FieldLabel htmlFor={`${uid}-first`}>First name</FieldLabel>
            <Input
              id={`${uid}-first`}
              autoComplete="given-name"
              placeholder="Dave"
              className={controlClass}
              aria-invalid={errors.firstName ? true : undefined}
              {...register("firstName")}
            />
            <FieldError errors={[errors.firstName]} />
          </Field>

          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor={`${uid}-email`}>Work email</FieldLabel>
            <Input
              id={`${uid}-email`}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="dave@acmeroofing.com"
              className={controlClass}
              aria-invalid={errors.email ? true : undefined}
              {...register("email")}
            />
            <FieldError errors={[errors.email]} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.companyName)}>
            <FieldLabel htmlFor={`${uid}-company`}>Company name</FieldLabel>
            <Input
              id={`${uid}-company`}
              autoComplete="organization"
              placeholder="Acme Roofing"
              className={controlClass}
              aria-invalid={errors.companyName ? true : undefined}
              {...register("companyName")}
            />
            <FieldError errors={[errors.companyName]} />
          </Field>

          <Field data-invalid={Boolean(errors.companyWebsite)}>
            <FieldLabel htmlFor={`${uid}-website`}>Company website</FieldLabel>
            <Input
              id={`${uid}-website`}
              inputMode="url"
              autoComplete="url"
              placeholder="acmeroofing.com"
              className={controlClass}
              aria-invalid={errors.companyWebsite ? true : undefined}
              {...register("companyWebsite")}
            />
            <FieldError errors={[errors.companyWebsite]} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.businessType)}>
            <FieldLabel htmlFor={`${uid}-type`}>Type of business</FieldLabel>
            <Controller
              control={control}
              name="businessType"
              render={({ field }) => (
                <Select
                  value={field.value ?? null}
                  onValueChange={(value) => {
                    markStarted();
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger
                    id={`${uid}-type`}
                    className={`${controlClass} w-full`}
                    aria-invalid={errors.businessType ? true : undefined}
                    onBlur={field.onBlur}
                  >
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.businessType]} />
          </Field>

          <Field data-invalid={Boolean(errors.leadVolume)}>
            <FieldLabel htmlFor={`${uid}-volume`}>Leads per month</FieldLabel>
            <Controller
              control={control}
              name="leadVolume"
              render={({ field }) => (
                <Select
                  value={field.value ?? null}
                  onValueChange={(value) => {
                    markStarted();
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger
                    id={`${uid}-volume`}
                    className={`${controlClass} w-full`}
                    aria-invalid={errors.leadVolume ? true : undefined}
                    onBlur={field.onBlur}
                  >
                    <SelectValue placeholder="Rough range" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadVolumes.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.leadVolume]} />
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.crm)}>
          <FieldLabel htmlFor={`${uid}-crm`}>CRM or lead management system</FieldLabel>
          <Input
            id={`${uid}-crm`}
            list={`${uid}-crm-options`}
            autoComplete="off"
            placeholder="ServiceTitan, JobNimbus, spreadsheets…"
            className={controlClass}
            aria-invalid={errors.crm ? true : undefined}
            {...register("crm")}
          />
          <datalist id={`${uid}-crm-options`}>
            {crmOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
          <FieldDescription>
            Whatever you actually use today. “Spreadsheets” is a real answer.
          </FieldDescription>
          <FieldError errors={[errors.crm]} />
        </Field>
      </FieldGroup>

      {formError ? (
        <div
          role="alert"
          className="flex gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3.5 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            {formError}{" "}
            <a
              href={`mailto:${brand.supportEmail}?subject=Recovery%20audit%20request`}
              className="font-medium underline underline-offset-4"
            >
              Email {brand.supportEmail}
            </a>{" "}
            and we&apos;ll pick it up straight away.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        <Button type="submit" variant="brand" size="xl" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Spinner /> Sending…
            </>
          ) : (
            <>
              {cta.primaryLong}
              <ArrowRight aria-hidden />
            </>
          )}
        </Button>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          We&apos;ll only use this to look at your lead flow and get back to you. No lists, no
          resale, unsubscribe any time.
        </p>
      </div>
    </form>
  );
}

function AuditSuccess({
  firstName,
  companyName,
  bookingUrl,
  onDone,
}: {
  firstName: string;
  companyName: string;
  bookingUrl?: string;
  onDone?: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex size-11 items-center justify-center rounded-full bg-brand">
        <Check className="size-5 text-brand-foreground" strokeWidth={2.5} aria-hidden />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-h3 font-medium">Got it, {firstName}.</h3>
        <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
          We&apos;ll take a look at how leads move through {companyName} and come back within one
          business day with where we think opportunities are leaking — and whether a recovery
          system is worth building for your workflow.
        </p>
      </div>

      {bookingUrl ? (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm font-medium">Want to skip the wait?</p>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("booking_clicked")}
            className={cn(buttonVariants({ variant: "default", size: "xl" }), "w-full")}
          >
            {cta.booking}
            <ArrowRight aria-hidden />
          </a>
        </div>
      ) : null}

      {onDone ? (
        <Button variant="ghost" size="lg" className="self-start" onClick={onDone}>
          Close
        </Button>
      ) : null}
    </div>
  );
}
