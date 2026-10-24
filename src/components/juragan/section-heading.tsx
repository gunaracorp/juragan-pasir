import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/**
 * Kepala section yang konsisten: label eyebrow amber + judul tebal + deskripsi.
 * Menciptakan ritme visual dan hierarki informasi yang mudah dipindai
 * (prinsip composition & visual hierarchy).
 */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  dark = false,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
  dark?: boolean;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={cn(
        "mb-12 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      <p
        className={cn(
          "mb-3 text-xs font-bold uppercase tracking-[0.22em]",
          "text-amber-600",
          dark && "text-amber-500"
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl",
          dark ? "text-white" : "text-stone-900"
        )}
      >
        {title}{" "}
        {highlight && (
          <span className="relative inline-block">
            <span className="relative z-10">{highlight}</span>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-sm bg-amber-400/40"
            />
          </span>
        )}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            dark ? "text-stone-300" : "text-stone-600"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
