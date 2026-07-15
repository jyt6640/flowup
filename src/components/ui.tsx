import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: ButtonVariant;
  readonly icon?: ReactNode;
  readonly loading?: boolean;
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary: "border border-line bg-elevated text-ink hover:bg-surface-soft",
  ghost: "text-ink-soft hover:bg-surface-soft hover:text-ink",
  danger: "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/15",
  icon: "border border-line bg-elevated text-ink-soft hover:bg-surface-soft hover:text-ink",
};

export const Button = ({
  variant = "primary",
  icon,
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    type="button"
    className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-pill px-4 py-2.5 text-sm font-medium transition duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info/50 disabled:opacity-50 ${buttonVariants[variant]} ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : icon}
    {children}
  </button>
);

type SurfaceProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly tone?: "plain" | "muted" | "elevated" | "glass";
  readonly as?: "div" | "section" | "article";
};

const surfaceTones = {
  plain: "border border-line-soft bg-surface",
  muted: "border border-line-soft bg-surface-soft",
  elevated: "border border-line bg-elevated shadow-soft",
  glass: "glass-surface",
} as const;

export const Surface = ({ children, className = "", tone = "plain", as = "div" }: SurfaceProps) => {
  const Component = as;
  return <Component className={`rounded-app-md ${surfaceTones[tone]} ${className}`}>{children}</Component>;
};

type BadgeProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly tone?: "neutral" | "success" | "warning" | "info";
};

const badgeTones = {
  neutral: "bg-surface-soft text-ink-soft",
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
  info: "bg-info/12 text-info",
} as const;

export const Badge = ({ children, className = "", tone = "neutral" }: BadgeProps) => (
  <span className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-[11px] font-medium ${badgeTones[tone]} ${className}`}>
    {children}
  </span>
);

type AvatarProps = {
  readonly name: string;
  readonly size?: "sm" | "md" | "lg";
  readonly online?: boolean;
  readonly tone?: string;
};

const avatarSize = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm",
} as const;

export const Avatar = ({ name, size = "md", online = false, tone = "bg-surface-soft" }: AvatarProps) => (
  <span className="relative inline-flex shrink-0" title={name}>
    <span className={`inline-flex items-center justify-center rounded-full border border-white/70 font-medium text-ink ${avatarSize[size]} ${tone}`}>
      {name.slice(0, 1)}
    </span>
    {online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-elevated bg-success" />}
  </span>
);

export const EmptyState = ({
  title,
  description,
  action,
}: {
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
}) => (
  <div className="flex min-h-48 flex-col items-center justify-center rounded-app-md border border-dashed border-line bg-surface-soft/60 px-6 py-10 text-center">
    <p className="text-base font-medium text-ink">{title}</p>
    <p className="mt-2 max-w-sm text-sm leading-6 text-ink-soft">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);
