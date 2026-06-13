import { SiteFooter } from "@/components/site-footer";
import { Showcase } from "@/components/showcase";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1">
        <Showcase />
      </main>
      <SiteFooter />
    </div>
  );
}
