import { cn } from "@/lib/utils";

/**
 * LOGO JURAGAN PASIR GALUNGGUNG — identitas "kelas dunia"
 * Lencana emas dengan siluet gundukan pasir vulkanik + bintang mutu.
 * Emas = standar premium; zamrud gelap = warisan Gunung Galunggung.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-10", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="jpgold" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#E3BE55" />
          <stop offset="55%" stopColor="#D4AE36" />
          <stop offset="100%" stopColor="#B4891B" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#jpgold)" />
      {/* gundukan pasir */}
      <path
        d="M7 34.5C12.5 25.5 19 20.5 24 20.5S35.5 25.5 41 34.5H7Z"
        fill="#021710"
      />
      <path
        d="M14.5 34.5C18 29 21.5 26.5 24 26.5s6 2.5 9.5 8h-19Z"
        fill="#0A3627"
      />
      {/* bintang mutu */}
      <path
        d="M24 7.5l1.35 2.9 3.15.42-2.32 2.2.6 3.13L24 14.6l-2.78 1.55.6-3.13-2.32-2.2 3.15-.42L24 7.5Z"
        fill="#021710"
      />
    </svg>
  );
}

export function Logo({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[17px] font-extrabold tracking-tight",
            inverted ? "text-white" : "text-ink-900"
          )}
        >
          JURAGAN <span className="text-gold-500">PASIR</span>
        </span>
        <span
          className={cn(
            "mt-1 text-[9px] font-bold uppercase tracking-[0.24em]",
            inverted ? "text-gold-400" : "text-gold-600"
          )}
        >
          Pasir Terbaik di Dunia
        </span>
      </span>
    </span>
  );
}
