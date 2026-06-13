import Link from "next/link";
import type { LegalDoc } from "@/lib/legal-content";
import { ArrowRight } from "./icons";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const PROSE = "text-[16px] leading-[1.78] text-[#46413b]";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <article className="px-6 pb-16 pt-20 sm:pb-20 sm:pt-24">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
        >
          <ArrowRight className="size-3.5 rotate-180 transition-transform group-hover:-translate-x-0.5" />
          Back to home
        </Link>

        <p className="mt-9 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-faint">
          Legal
        </p>
        <h1 className="mt-3 text-[clamp(2.2rem,4.6vw,3rem)] font-extrabold tracking-[-0.03em] text-ink">
          {doc.title}
        </h1>
        <p className="mt-3 text-[14px] text-muted">Last updated {doc.updated}</p>

        {/* Intro */}
        <div className="mt-9 space-y-4 border-t border-line pt-9">
          {doc.intro.map((paragraph, i) => (
            <p key={i} className={PROSE}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Sections */}
        <div className="mt-12 space-y-11">
          {doc.sections.map((section, i) => (
            <section
              key={section.heading}
              id={slugify(section.heading)}
              className="scroll-mt-24"
            >
              <h2 className="flex gap-3 text-[19px] font-bold tracking-[-0.012em] text-ink">
                <span className="tabular-nums text-faint">{i + 1}.</span>
                <span>{section.heading}</span>
              </h2>
              <div className="mt-4 space-y-4 pl-7">
                {section.blocks.map((block, bi) =>
                  block.type === "p" ? (
                    <p key={bi} className={PROSE}>
                      {block.text}
                    </p>
                  ) : (
                    <ul key={bi} className="space-y-2.5">
                      {block.items.map((item, ii) => (
                        <li key={ii} className={`relative pl-5 ${PROSE}`}>
                          <span className="absolute left-0 top-[0.7em] size-1.5 rounded-full bg-faint" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
