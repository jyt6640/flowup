import { Link } from "react-router-dom";

type LogoProps = {
  readonly tone?: "dark" | "light";
  readonly compact?: boolean;
};

export const Logo = ({ tone = "dark", compact = false }: LogoProps) => {
  const colorClass = tone === "light" ? "text-white" : "text-ink";
  return (
    <Link
      to="/"
      aria-label="FlowUp 홈"
      className={`inline-flex items-center gap-2 font-medium tracking-[-0.02em] ${colorClass}`}
    >
      <svg
        aria-hidden="true"
        className={compact ? "h-7 w-7" : "h-8 w-8"}
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M 144 256 L 27.598 256 L 144 139.598 Z" />
        <path d="M 256 207.5 L 200 256 L 200 56 L 0 56 L 48 0 L 256 0 Z" />
        <path d="M 0 204.402 L 0 112 L 92.402 112 Z" />
      </svg>
      {!compact && <span className="text-[17px]">FlowUp</span>}
    </Link>
  );
};
