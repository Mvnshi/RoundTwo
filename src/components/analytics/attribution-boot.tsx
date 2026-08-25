"use client";

import { useEffect } from "react";

import { captureAttribution } from "@/lib/attribution";

/** Records campaign parameters once, as early as the client can run. */
export function AttributionBoot() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
