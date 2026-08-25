import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's stock scales, so our custom type
 * ramp (`text-display`, `text-h2`, …) has to be registered as font sizes.
 * Without this, `cn("text-sm", "text-h3")` keeps both and the smaller class
 * silently wins inside shadcn components.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h2", "h3", "lead"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
