import { Marquee } from "@/components/friction/ui/marquee";
import { taxonomy } from "@/lib/friction/content";

/**
 * The taxonomy as a moving band rather than a static wall of chips. Two tracks
 * running against each other: the list never stops and never quite repeats,
 * which is nearer to how friction is actually encountered than a tidy grid is.
 *
 * Pure CSS animation, so it costs nothing beyond the keyframes and it stops
 * dead under prefers-reduced-motion via the global rule in friction.css.
 */
function Chip({ item, i }: { item: string; i: number }) {
  return (
    <span className="flex items-baseline gap-2.5 border border-rule bg-panel px-3 py-2">
      <span className="fr-num text-[0.625rem] text-faint">
        {String(i + 1).padStart(2, "0")}
      </span>
      <span className="text-[0.875rem] font-medium whitespace-nowrap">
        {item}
      </span>
    </span>
  );
}

export function TaxonomyBand() {
  const half = Math.ceil(taxonomy.length / 2);
  const top = taxonomy.slice(0, half);
  const bottom = taxonomy.slice(half);

  return (
    <div className="flex flex-col gap-2.5">
      <Marquee speed={44} gap="0.625rem">
        {top.map((item, i) => (
          <Chip key={item} item={item} i={i} />
        ))}
      </Marquee>
      <Marquee direction="right" speed={52} gap="0.625rem">
        {bottom.map((item, i) => (
          <Chip key={item} item={item} i={i + half} />
        ))}
      </Marquee>
    </div>
  );
}
