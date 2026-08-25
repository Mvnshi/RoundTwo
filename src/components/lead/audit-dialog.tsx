"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { track } from "@/lib/analytics";

type AuditDialogContextValue = {
  open: (source: string) => void;
};

const AuditDialogContext = createContext<AuditDialogContextValue | null>(null);

const importAuditForm = () => import("@/components/lead/audit-form");

/**
 * The form pulls in Zod and react-hook-form, which is the single biggest
 * chunk on the page and is useless until someone opens the dialog. It is
 * split out and then prefetched while the browser is idle, so it costs
 * nothing at first paint and is already cached by the time anyone clicks.
 */
const AuditForm = dynamic(() => importAuditForm().then((m) => m.AuditForm), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-64 items-center justify-center" aria-live="polite">
      <Spinner className="size-5 text-muted-foreground" />
      <span className="sr-only">Loading form…</span>
    </div>
  ),
});

/**
 * One dialog instance for the whole page. Any CTA can open it and report
 * where the click came from, so the form is never duplicated in the DOM.
 */
export function AuditDialogProvider({
  children,
  bookingUrl,
}: {
  children: React.ReactNode;
  /** Read on the server so it works whenever env vars are set. */
  bookingUrl?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      if (!cancelled) void importAuditForm();
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }

    const timer = setTimeout(load, 2500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const open = useCallback((source: string) => {
    setIsOpen(true);
    track("audit_form_opened", { source });
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <AuditDialogContext.Provider value={value}>
      {children}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-h-[100dvh] w-full max-w-[36rem] overflow-y-auto rounded-none bg-card p-6 sm:max-w-[36rem] sm:rounded-[2rem] sm:p-9 max-sm:top-0 max-sm:left-0 max-sm:h-[100dvh] max-sm:max-w-none max-sm:translate-0"
          aria-labelledby="audit-dialog-title"
        >
          <DialogHeader className="gap-3 pr-8">
            <p className="label-mono text-muted-foreground">Free recovery audit</p>
            <DialogTitle id="audit-dialog-title" className="text-h3 font-medium">
              Let&apos;s find where the jobs are going.
            </DialogTitle>
            <DialogDescription className="text-[0.9375rem] leading-relaxed">
              Seven questions. We use them to look at how leads move through your business before
              we speak, so the first conversation is about your numbers rather than a demo.
            </DialogDescription>
          </DialogHeader>

          <AuditForm bookingUrl={bookingUrl} onDone={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </AuditDialogContext.Provider>
  );
}

export function useAuditDialog(): AuditDialogContextValue {
  const context = useContext(AuditDialogContext);
  if (!context) {
    throw new Error("useAuditDialog must be used inside <AuditDialogProvider>");
  }
  return context;
}
