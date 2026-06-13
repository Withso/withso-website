import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { termsOfService } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Terms of Service — withso",
  description:
    "The terms governing your use of withso's website, the Zeros macOS app, and NammaTN, operated by Withso Technologies (OPC) Private Limited.",
};

export default function TermsPage() {
  return <LegalPage doc={termsOfService} />;
}
