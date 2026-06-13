import Link from "next/link";
import { footer } from "@/lib/site-data";
import { Logo } from "./logo";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className = "text-[13px] text-muted transition-colors hover:text-ink";
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-8 sm:flex-row sm:justify-between sm:gap-6">
        <Link href="/" aria-label="withso home" className="text-ink">
          <Logo height={20} />
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          <FooterLink href="mailto:contact@withso.com">
            contact@withso.com
          </FooterLink>
          {footer.legal.map((link) => (
            <FooterLink key={link.label} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </nav>
      </div>
    </footer>
  );
}
