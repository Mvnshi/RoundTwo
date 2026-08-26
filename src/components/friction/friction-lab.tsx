"use client";

import { useState } from "react";

import { FrictionPathDiagram } from "@/components/friction/friction-path";
import { paths } from "@/lib/friction/content";

/**
 * Three paths from three different parts of life — a purchase, a job, a
 * Tuesday. Switching between them is the argument: it is the same shape every
 * time.
 */
export function FrictionLab() {
  const [active, setActive] = useState(paths[0].id);
  const path = paths.find((p) => p.id === active) ?? paths[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Example paths"
        className="flex flex-wrap border-x border-t border-ink"
      >
        {paths.map((p, i) => {
          const selected = p.id === active;
          return (
            <button
              key={p.id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActive(p.id)}
              className={`fr-label min-w-0 flex-1 basis-32 border-b px-3 py-3.5 text-left transition-colors sm:px-5 ${
                i > 0 ? "border-l border-l-ink" : ""
              } ${
                selected
                  ? "border-b-ink bg-ink text-paper"
                  : "border-b-ink text-dim hover:bg-panel hover:text-ink"
              }`}
            >
              <span className={selected ? "text-void-dim" : "text-faint"}>
                {String(i + 1).padStart(2, "0")}
              </span>{" "}
              {p.tab}
            </button>
          );
        })}
      </div>

      {/* Remounts per path so each one starts from its as-built state. */}
      <FrictionPathDiagram key={path.id} path={path} />
    </div>
  );
}
