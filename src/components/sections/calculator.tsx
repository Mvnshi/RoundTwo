"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Info } from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import { AuditCta } from "@/components/lead/audit-cta";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Slider } from "@/components/ui/slider";
import { track } from "@/lib/analytics";
import { cta } from "@/lib/site";

const DEFAULTS = {
  leadsPerMonth: 100,
  avgJobValue: 5000,
  fallThroughRate: 20,
  recoveryRate: 10,
};

const JOB_VALUE_MIN = 500;
const JOB_VALUE_MAX = 250_000;

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function Calculator() {
  const uid = useId();
  const [leadsPerMonth, setLeadsPerMonth] = useState(DEFAULTS.leadsPerMonth);
  const [avgJobValue, setAvgJobValue] = useState(DEFAULTS.avgJobValue);
  const [jobValueText, setJobValueText] = useState(String(DEFAULTS.avgJobValue));
  const [fallThroughRate, setFallThroughRate] = useState(DEFAULTS.fallThroughRate);
  const [recoveryRate, setRecoveryRate] = useState(DEFAULTS.recoveryRate);

  const hasStarted = useRef(false);
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    const lostOpportunities = (leadsPerMonth * fallThroughRate) / 100;
    const recoveredJobs = (lostOpportunities * recoveryRate) / 100;
    const monthlyRevenue = recoveredJobs * avgJobValue;

    return {
      lostOpportunities,
      recoveredJobs,
      monthlyRevenue,
      annualRevenue: monthlyRevenue * 12,
    };
  }, [leadsPerMonth, avgJobValue, fallThroughRate, recoveryRate]);

  useEffect(() => {
    return () => {
      if (completionTimer.current) clearTimeout(completionTimer.current);
    };
  }, []);

  function onInteract() {
    if (!hasStarted.current) {
      hasStarted.current = true;
      track("recovery_calculator_started");
    }

    // "Completed" fires once the visitor stops adjusting and reads the number.
    if (completionTimer.current) clearTimeout(completionTimer.current);
    completionTimer.current = setTimeout(() => {
      track("recovery_calculator_completed", {
        leads_per_month: leadsPerMonth,
        avg_job_value: avgJobValue,
        fall_through_rate: fallThroughRate,
        recovery_rate: recoveryRate,
        illustrative_monthly_revenue: Math.round(results.monthlyRevenue),
      });
    }, 1500);
  }

  function commitJobValue(raw: string) {
    const digits = raw.replace(/[^\d]/g, "");
    setJobValueText(digits);
    if (digits === "") return;
    const parsed = Number(digits);
    if (!Number.isFinite(parsed)) return;
    setAvgJobValue(Math.min(JOB_VALUE_MAX, Math.max(JOB_VALUE_MIN, parsed)));
    onInteract();
  }

  return (
    <Section id="roi" className="border-t border-border">
      <SectionHeading
        eyebrow="The arithmetic"
        title="One recovered job a month changes the year."
        lead="Move the numbers to match your business. High job values are what make recovery worth doing at all — at contractor ticket sizes, a small percentage is not a small number."
      />

      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)]">
        <div className="flex min-w-0 flex-col gap-8 bg-card p-6 sm:p-8">
          <SliderRow
            id={`${uid}-leads`}
            label="Leads per month"
            display={leadsPerMonth.toLocaleString("en-US")}
            value={leadsPerMonth}
            min={10}
            max={500}
            step={5}
            ariaValueText={(value) => `${value} leads per month`}
            onValueChange={(value) => {
              setLeadsPerMonth(value);
              onInteract();
            }}
          />

          <div className="flex flex-col gap-3">
            <Label htmlFor={`${uid}-value`} className="text-[0.9375rem] font-medium">
              Average closed job value
            </Label>
            <InputGroup className="h-12 max-w-[14rem] rounded-lg bg-card">
              <InputGroupAddon>
                <InputGroupText className="text-muted-foreground">$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id={`${uid}-value`}
                inputMode="numeric"
                pattern="[0-9]*"
                className="h-full tabular text-[1.0625rem] font-medium"
                value={jobValueText}
                onChange={(event) => commitJobValue(event.target.value)}
                onBlur={() => setJobValueText(String(avgJobValue))}
              />
            </InputGroup>
          </div>

          <SliderRow
            id={`${uid}-fallthrough`}
            label="Opportunities currently falling through"
            display={`${fallThroughRate}%`}
            value={fallThroughRate}
            min={5}
            max={50}
            step={1}
            ariaValueText={(value) => `${value} percent falling through`}
            onValueChange={(value) => {
              setFallThroughRate(value);
              onInteract();
            }}
          />

          <SliderRow
            id={`${uid}-recovery`}
            label="Recovery rate we model"
            display={`${recoveryRate}%`}
            value={recoveryRate}
            min={2}
            max={25}
            step={1}
            ariaValueText={(value) => `${value} percent recovered`}
            onValueChange={(value) => {
              setRecoveryRate(value);
              onInteract();
            }}
            hint="Deliberately conservative. We'd rather under-promise than model a best case."
          />

          <p className="mt-auto border-t border-border pt-6 text-[0.8125rem] leading-relaxed text-muted-foreground">
            Defaults reflect a mid-sized roofing or remodeling operation. The audit replaces these
            with your actual numbers.
          </p>
        </div>

        <div className="flex min-w-0 flex-col bg-foreground p-6 text-background sm:p-8">
          <p className="label-mono text-background/60">Illustrative recovered revenue</p>

          <p className="mt-4 flex flex-wrap items-baseline gap-x-1 gap-y-1 text-background">
            <span className="text-[1.75rem] font-medium tracking-[-0.02em] text-brand sm:text-[2rem]">
              $
            </span>
            <NumberTicker
              aria-hidden
              value={Math.round(results.monthlyRevenue)}
              className="text-[2.5rem] leading-none font-medium tracking-[-0.035em] text-brand tabular-nums sm:text-[3rem]"
            />
            <span className="sr-only">{money.format(results.monthlyRevenue)}</span>
            <span className="ml-1 text-[0.9375rem] text-background/60">/ month</span>
          </p>

          <p className="mt-3 text-[0.9375rem] text-background/70">
            About{" "}
            <span className="font-medium text-background tabular">
              {money.format(results.annualRevenue)}
            </span>{" "}
            over twelve months, from leads you have already paid for.
          </p>

          <dl className="mt-8 flex flex-col gap-px overflow-hidden rounded-lg bg-background/15 text-[0.875rem]">
            <ResultRow
              label="Opportunities lost each month"
              value={formatCount(results.lostOpportunities)}
            />
            <ResultRow
              label="Jobs recovered each month"
              value={formatCount(results.recoveredJobs)}
              emphasis
            />
          </dl>

          <div className="mt-8 flex gap-2.5 border-t border-background/15 pt-5 text-[0.75rem] leading-relaxed text-background/60">
            <Info className="mt-px size-3.5 shrink-0" aria-hidden />
            <p>
              Illustrative estimate only. Actual results depend on lead quality, close rates,
              sales process and other factors. Nothing here is a guarantee of revenue.
            </p>
          </div>

          <div className="mt-6">
            <AuditCta
              source="calculator"
              label={cta.primaryLong}
              event="secondary_cta_clicked"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

function SliderRow({
  id,
  label,
  display,
  hint,
  ariaValueText,
  onValueChange,
  ...sliderProps
}: {
  id: string;
  label: string;
  display: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  ariaValueText: (value: number) => string;
  onValueChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <Label htmlFor={id} className="text-[0.9375rem] font-medium">
          {label}
        </Label>
        <output
          htmlFor={id}
          className="tabular text-[1.0625rem] font-medium tracking-[-0.01em]"
        >
          {display}
        </output>
      </div>
      <Slider
        id={id}
        ariaLabel={label}
        ariaValueText={ariaValueText}
        className="py-2"
        onValueChange={(value) => {
          onValueChange(Array.isArray(value) ? (value[0] ?? 0) : value);
        }}
        {...sliderProps}
      />
      {hint ? <p className="text-[0.8125rem] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function ResultRow({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 bg-foreground px-4 py-3.5">
      <dt className="text-background/70">{label}</dt>
      <dd className={`tabular font-medium ${emphasis ? "text-brand" : "text-background"}`}>
        {value}
      </dd>
    </div>
  );
}

function formatCount(value: number): string {
  return value >= 10 || Number.isInteger(value)
    ? Math.round(value).toLocaleString("en-US")
    : value.toFixed(1);
}
