import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { privacyPolicy } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy — withso",
  description:
    "Our privacy-first approach: how Withso Technologies (OPC) Private Limited handles information across withso.com, Zeros, and NammaTN — built so we don't collect your personal data.",
};

export default function PrivacyPolicyPage() {
  return <LegalPage doc={privacyPolicy} />;
}
