import Link from "next/link";
import { hero, nammatn, nav, products, type Product } from "@/lib/site-data";
import { ArrowRight, ArrowUpRight, ProductMark } from "./icons";
import { Logo } from "./logo";

// ---------------------------------------------------------------------------
// Branded preview panels — stand-ins for product screenshots, drawn from each
// product's own visual language (Zeros: dark macOS window; NammaTN: green civic
// dashboard). Swap in real screenshots later if desired.
// ---------------------------------------------------------------------------

// A floating "agent" frame on the canvas.
function AgentFrame({
  dot,
  label,
  lines,
  className,
  merged = false,
}: {
  dot: string;
  label: number;
  lines: number[];
  className: string;
  merged?: boolean;
}) {
  return (
    <div
      className={`absolute space-y-1.5 rounded-lg bg-[#1d1d1d] p-2 shadow-lg shadow-black/40 ring-1 ring-white/10 ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full" style={{ backgroundColor: dot }} />
        <span
          className="h-1 rounded-full bg-white/25"
          style={{ width: `${label}px` }}
        />
        {merged && (
          <span className="ml-auto h-1 w-5 rounded-full bg-[#28c840]/70" />
        )}
      </div>
      {lines.map((w, j) => (
        <span
          key={j}
          className="block h-1 rounded-full bg-white/10"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

function ZerosPreview() {
  return (
    <div className="flex aspect-[16/10] flex-col overflow-hidden rounded-2xl bg-[#141414] p-3">
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-1">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2.5 h-1.5 w-16 rounded-full bg-white/10" />
      </div>
      {/* Infinite canvas with parallel agents */}
      <div
        className="relative mt-2.5 flex-1 overflow-hidden rounded-lg ring-1 ring-white/[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
          backgroundSize: "15px 15px",
        }}
      >
        <AgentFrame
          dot="#28c840"
          label={26}
          lines={[100, 72, 88, 58]}
          className="left-[5%] top-[7%] w-[42%]"
        />
        <AgentFrame
          dot="#febc2e"
          label={20}
          lines={[90, 64, 80, 68, 48]}
          className="right-[5%] top-[28%] w-[44%]"
        />
        <AgentFrame
          dot="#5b9dff"
          label={30}
          lines={[100, 80, 66]}
          className="bottom-[7%] left-[16%] w-[46%]"
          merged
        />
      </div>
    </div>
  );
}

// Deterministic phyllotaxis scatter — districts twinkling on the dark panel.
const round = (n: number) => Math.round(n * 100) / 100;
const NAMMA_DOTS = Array.from({ length: 24 }, (_, i) => {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const r = Math.sqrt((i + 0.5) / 24);
  const angle = i * golden;
  return {
    x: round(50 + 44 * r * Math.cos(angle)),
    y: round(50 + 44 * r * Math.sin(angle)),
    radius: round(0.9 + (1 - r) * 1.4),
    live: i % 5 === 0,
  };
});

function NammaPreview() {
  return (
    <div className="relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-2xl bg-[#0d3d2c] p-4">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-44 w-44"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(110,231,183,0.2) 0%, transparent 62%)",
        }}
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {NAMMA_DOTS.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.radius}
            fill={d.live ? "#6ee7b7" : "#34d399"}
            opacity={d.live ? 0.85 : 0.16}
          />
        ))}
      </svg>
      <div className="relative">
        <p className="mono text-[9px] uppercase tracking-[0.2em] text-[#6ee7b7]">
          nammatn.in
        </p>
        <div className="mt-2.5">
          {nammatn.cardTagline.map((line) => (
            <p
              key={line}
              className="text-[15px] font-bold leading-snug text-white"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
      <div className="relative flex flex-wrap gap-1.5">
        {nammatn.stats.map((stat) => (
          <span
            key={stat.label}
            className="flex items-baseline gap-1 rounded-full bg-white/10 px-2.5 py-1"
          >
            <span className="text-[11px] font-bold text-white">
              {stat.value}
            </span>
            <span className="text-[9.5px] text-[#a7f3d0]">{stat.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  delay,
}: {
  product: Product;
  delay: number;
}) {
  return (
    <article
      className="rise group flex flex-col overflow-hidden rounded-3xl border border-line-strong bg-card shadow-row transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-pop"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3.5 px-6 pt-6 sm:px-7 sm:pt-7">
        <ProductMark icon={product.icon} size={42} />
        <div className="min-w-0">
          <h2 className="text-[17px] font-bold tracking-[-0.02em] text-ink">
            {product.name}
          </h2>
          <p className="mono text-[10px] uppercase tracking-[0.14em] text-faint">
            {product.category}
          </p>
        </div>
        <span className="mono ml-auto shrink-0 text-[10px] uppercase tracking-[0.14em] text-faint">
          {product.tag}
        </span>
      </div>

      {/* Preview */}
      <div className="px-6 pt-6 sm:px-7">
        {product.icon === "zeros" ? <ZerosPreview /> : <NammaPreview />}
      </div>

      {/* Description + link */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-6 sm:px-7 sm:pb-7">
        <p className="text-[14.5px] leading-relaxed text-muted">
          {product.description}
        </p>
        <a
          href={product.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink"
        >
          Visit {product.name}
          <ArrowUpRight className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </article>
  );
}

export function Showcase() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12 sm:pt-16">
      {/* Row 1 — logo */}
      <Link
        href="/"
        aria-label="withso home"
        className="rise inline-block text-ink"
      >
        <Logo height={24} />
      </Link>

      {/* Row 2 — tagline */}
      <h1
        className="rise mt-16 max-w-2xl text-[clamp(2.1rem,4.6vw,3.4rem)] font-extrabold leading-[1.04] tracking-[-0.04em] text-ink sm:mt-20"
        style={{ animationDelay: "80ms" }}
      >
        {hero.tagline}
      </h1>

      {/* Row 3 — CTA */}
      <div className="rise mt-8" style={{ animationDelay: "170ms" }}>
        <a
          href={nav.cta.href}
          className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-[14px] font-semibold text-bg transition-colors duration-300 hover:bg-[#34302c]"
        >
          {nav.cta.label}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>

      {/* Two product cards */}
      <div className="mt-16 grid gap-6 sm:mt-20 lg:grid-cols-2">
        {products.map((product, i) => (
          <ProductCard
            key={product.name}
            product={product}
            delay={280 + i * 90}
          />
        ))}
      </div>
    </div>
  );
}
