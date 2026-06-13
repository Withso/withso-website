import { ArrowRight } from "./icons";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  withArrow?: boolean;
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  withArrow = false,
  className = "",
}: ButtonProps) {
  const base =
    "group inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-5 text-[15px] font-semibold tracking-[-0.01em] transition-all duration-200 active:scale-[0.98]";

  const variants = {
    primary:
      "bg-ink text-white shadow-[0_1px_2px_rgba(10,10,12,0.2)] hover:bg-[#26272b]",
    secondary:
      "border border-line-strong bg-white text-ink hover:border-ink/25 hover:bg-[#fafafb]",
  } as const;

  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {withArrow && (
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </a>
  );
}
