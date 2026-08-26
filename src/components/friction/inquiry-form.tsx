"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { company } from "@/lib/friction/content";
import {
  clientInquirySchema,
  type InquiryInput,
} from "@/lib/friction/inquiry-schema";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent";

const FIELD =
  "w-full border border-ink bg-panel px-3 py-2.5 text-[0.9375rem] outline-none placeholder:text-faint focus-visible:border-hazard-ink focus-visible:outline-none";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="fr-label flex items-baseline justify-between gap-3 text-dim">
        {label}
        {hint ? <span className="text-faint normal-case">{hint}</span> : null}
      </span>
      <span className="mt-2 block">{children}</span>
      {error ? (
        <span className="fr-meta mt-1.5 block text-hazard-ink">{error}</span>
      ) : null}
    </label>
  );
}

export function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  // Written in an effect, never during render: reading the clock while
  // rendering is impure and the compiler is right to complain about it.
  const renderedAt = useRef(0);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  /*
    Until the page is interactive the submit button stays inert. A click on a
    server-rendered form that has not hydrated performs a native GET, which
    navigates away and silently discards everything the person typed. On a site
    arguing that silent failure is the worst kind of friction, that is not a
    defect we get to ship.
  */
  const ready = useHydrated();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(clientInquirySchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", organisation: "", path: "", website: "" },
  });

  const onSubmit = async (values: InquiryInput) => {
    setFormError(null);
    setStatus("sending");
    try {
      const response = await fetch("/api/friction", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, renderedAt: renderedAt.current }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      // A success screen is only ever shown for something actually filed.
      if (!response.ok || !data?.ok) {
        setStatus("idle");
        setFormError(
          data?.message ??
            "That didn't get through. Email us and it won't get lost.",
        );
        return;
      }
      setStatus("sent");
      reset();
    } catch {
      setStatus("idle");
      setFormError(
        "That didn't get through — likely the connection. Email us instead.",
      );
    }
  };

  if (status === "sent") {
    return (
      <div className="border border-ink bg-panel p-6 sm:p-8">
        <p className="fr-label text-hazard-ink">Filed</p>
        <p className="fr-sub mt-3">We have it.</p>
        <p className="fr-lead mt-3 max-w-md text-dim">
          You will get a reply from a person, not a sequence. If it is faster to
          just talk, write to{" "}
          <a
            href={`mailto:${company.email}`}
            className="text-ink underline decoration-hazard decoration-2 underline-offset-4"
          >
            {company.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="fr-label mt-6 border border-ink px-3 py-2.5 transition-colors hover:bg-ink hover:text-paper"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      className="border border-ink bg-paper p-6 sm:p-8"
    >
      <p className="fr-label text-dim">Request an audit</p>
      <p className="fr-meta mt-2 text-dim">
        Three fields. It could have asked for eleven.
      </p>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" error={errors.name?.message}>
            <input
              {...register("name")}
              className={FIELD}
              autoComplete="name"
              placeholder="Your name"
            />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              inputMode="email"
              className={FIELD}
              autoComplete="email"
              placeholder="you@company.com"
            />
          </Field>
        </div>

        <Field
          label="Organisation"
          hint="optional"
          error={errors.organisation?.message}
        >
          <input
            {...register("organisation")}
            className={FIELD}
            autoComplete="organization"
            placeholder="Where you work"
          />
        </Field>

        <Field
          label="What should happen, and what gets in the way?"
          error={errors.path?.message}
        >
          <textarea
            {...register("path")}
            rows={4}
            className={cn(FIELD, "resize-y")}
            placeholder="A sentence is enough. The process, the outcome you want, and where it stalls."
          />
        </Field>
      </div>

      {/* Honeypot: off-screen, not display:none, and hidden from assistive tech. */}
      <div
        aria-hidden
        // Clipped rather than positioned off-screen: a negative offset can still
        // participate in layout, and this cannot.
        className="h-px w-px overflow-hidden [clip-path:inset(50%)]"
      >
        <label>
          Website
          <input {...register("website")} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {formError ? (
        <p
          role="alert"
          className="fr-meta mt-5 border border-hazard-ink bg-hazard/10 px-3 py-2.5 text-hazard-ink"
        >
          {formError}{" "}
          <a
            href={`mailto:${company.email}`}
            className="underline underline-offset-4"
          >
            {company.email}
          </a>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!ready || isSubmitting || status === "sending"}
        className="fr-label mt-6 w-full border border-ink bg-ink px-4 py-3.5 text-paper transition-colors hover:border-hazard-ink hover:bg-hazard-ink disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send it"}
      </button>

      <p className="fr-meta mt-4 text-dim">
        Or write to{" "}
        <a
          href={`mailto:${company.email}`}
          className="text-ink underline decoration-hazard decoration-2 underline-offset-4"
        >
          {company.email}
        </a>
        .
      </p>
    </form>
  );
}
