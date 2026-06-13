import { SiteFooter } from "@/components/site-footer";

// The footer no longer lives in the root layout (the home page folds it into
// its final snap section), so legal pages render their own at the bottom.
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
