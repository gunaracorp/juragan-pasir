import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

/**
 * Kepala section konsisten — bahasa visual kelas dunia:
 * lencana pill ber-dot emas → judul serif dengan penekanan italic emas →
 * garis pembatas emas → deskripsi tenang.
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
        "mb-14 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      <p
        className={cn(
          "inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]",
          dark
            ? "border-gold-500/35 bg-gold-500/10 text-gold-300"
            : "border-gold-600/25 bg-gold-500/10 text-gold-700",
          align === "center" ? "" : ""
        )}
      >
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-gold-400" : "bg-gold-500")}
        />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-5 font-display text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem]",
          dark ? "text-white" : "text-ink-900"
        )}
      >
        {title}{" "}
        {highlight && (
          <em className={cn("font-bold italic", dark ? "text-gold-bright" : "text-gold-deep")}>
            {highlight}
          </em>
        )}
      </h2>
      <div
        aria-hidden="true"
        className={cn("gold-divider mt-6 w-24", align === "center" && "mx-auto")}
      />
      {description && (
        <p
          className={cn(
            "mt-6 text-base leading-relaxed sm:text-lg",
            dark ? "text-white/60" : "text-ink-500"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
