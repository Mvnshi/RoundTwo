"use client";

import { useEffect, useState } from "react";

import { TextScramble } from "@/components/friction/ui/text-scramble";

/**
 * The taxonomy delivered as motion instead of a list. The line keeps
 * resolving into another kind of friction and never settles, which is the
 * point being made: it is not one thing, and it does not stop.
 */
const THINGS = [
  "a login",
  "a form",
  "a decision",
  "a wait",
  "an approval",
  "a handoff",
  "a password",
  "a search",
  "a switch",
  "one more question",
];

export function FrictionIs({ className }: { className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setI((n) => (n + 1) % THINGS.length),
      2200,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className}>
      <TextScramble text={THINGS[i]} />
    </span>
  );
}
