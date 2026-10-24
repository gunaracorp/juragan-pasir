import { cn } from "@/lib/utils";

/**
 * LOGO JURAGAN PASIR GALUNGGUNG
 * Simbol: gundukan pasir (dune) + bijih butiran — tegas, mudah dikenali,
 * bermakna "sumber pasir terpusat". Ungu di atas dasar ungu gelap.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-9", className)}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="12" className="fill-violet-950" />
      <path
        d="M8 33.5C13 25 19.5 20.5 24 20.5S35 25 40 33.5H8Z"
        className="fill-violet-600"
      />
      <path
        d="M14 33.5C17.5 28.5 21.5 26 24 26s6.5 2.5 10 7.5H14Z"
        className="fill-violet-400"
      />
      <circle cx="16.5" cy="14.5" r="1.8" className="fill-violet-300" />
      <circle cx="24" cy="10.5" r="1.8" className="fill-violet-400" />
      <circle cx="31.5" cy="14.5" r="1.8" className="fill-violet-500" />
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
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-lg font-extrabold tracking-tight",
            inverted ? "text-white" : "text-slate-900"
          )}
        >
          Juragan<span className="text-violet-600">Pasir</span>
        </span>
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-[0.18em]",
            inverted ? "text-violet-300/80" : "text-violet-700"
          )}
        >
          Pasir Galunggung · Tasikmalaya
        </span>
      </span>
    </span>
  );
}
