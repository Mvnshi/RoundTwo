"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { company } from "@/lib/friction/content";
import {
  clientInquirySchema,
  type InquiryInput,
} from "@/lib/friction/inquiry-schema";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent";

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
      <span className="flex items-baseline justify-between gap-3 text-[0.8125rem] font-medium">
        {label}
        {hint ? (
          <span className="text-muted-foreground">{hint}</span>
        ) : null}
      </span>
      <span className="mt-2 block">{children}</span>
      {error ? (
        <span className="mt-1.5 block text-[0.8125rem] text-resist">
          {error}
        </span>
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
    The submit stays inert until the page is interactive. A click on a
    server-rendered form that has not hydrated performs a native GET, which
    navigates away and silently discards everything typed.
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
    defaultValues: {
      name: "",
      email: "",
      organisation: "",
      path: "",
      website: "",
    },
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
      <div className="rounded-lg bg-card p-8 ring-1 ring-hairline sm:p-10">
        <span className="grid size-12 place-items-center rounded-full bg-brand text-foreground">
          <Check className="size-6" aria-hidden />
        </span>
        <p className="mt-5 text-h3">We have it.</p>
        <p className="mt-3 max-w-md text-lead text-muted-foreground">
          You will get a reply from a person, not a sequence. If it is faster to
          just talk, write to{" "}
          <a
            href={`mailto:${company.email}`}
            className="marker-rule text-foreground"
          >
            {company.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full px-4 py-2.5 text-[0.8125rem] font-medium ring-1 ring-hairline transition-colors hover:bg-secondary/60"
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
      className="rounded-lg bg-card p-6 ring-1 ring-hairline sm:p-8"
    >
      <p className="label-mono text-muted-foreground">Request an audit</p>
      <p className="mt-2 text-[0.875rem] text-muted-foreground">
        Three fields. It could have asked for eleven.
      </p>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" error={errors.name?.message}>
            <Input
              {...register("name")}
              autoComplete="name"
              placeholder="Your name"
            />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input
              {...register("email")}
              type="email"
              inputMode="email"
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
          <Input
            {...register("organisation")}
            autoComplete="organization"
            placeholder="Where you work"
          />
        </Field>

        <Field
          label="What should happen, and what gets in the way?"
          error={errors.path?.message}
        >
          <Textarea
            {...register("path")}
            rows={4}
            placeholder="A sentence is enough. The process, the outcome you want, and where it stalls."
          />
        </Field>
      </div>

      {/* Honeypot: clipped rather than positioned off-screen, which cannot
          affect layout, and hidden from assistive tech. */}
      <div
        aria-hidden
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
          className="mt-5 rounded-2xl bg-resist-soft/15 px-4 py-3 text-[0.875rem] text-resist"
        >
          {formError}{" "}
          <a href={`mailto:${company.email}`} className="underline underline-offset-4">
            {company.email}
          </a>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!ready || isSubmitting || status === "sending"}
        className={cn(
          "mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-[0.9375rem] font-medium text-background transition-colors",
          "hover:bg-brand hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto",
        )}
      >
        {status === "sending" ? "Sending…" : "Send it"}
      </button>

      <p className="mt-4 text-[0.8125rem] text-muted-foreground">
        Or write to{" "}
        <a href={`mailto:${company.email}`} className="marker-rule text-foreground">
          {company.email}
        </a>
        .
      </p>
    </form>
  );
}
