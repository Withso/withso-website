// ---------------------------------------------------------------------------
// Legal content for withso (Withso Technologies (OPC) Private Limited).
// Structured so copy + company specifics live in one place.
//
// IMPORTANT: This is a carefully researched, professional starting point — it
// is NOT legal advice. Before publishing / submitting to the Apple Developer
// Program, (1) fill in every [BRACKETED] placeholder below and (2) have the
// final text reviewed by a qualified Indian advocate.
// ---------------------------------------------------------------------------

/** Company specifics — edit these and they propagate through both documents. */
export const legalMeta = {
  company: "withso",
  legalName: "Withso Technologies (OPC) Private Limited",
  email: "contact@withso.com",
  website: "withso.com",
  // TODO: fill these in before publishing (required for legal compliance).
  cin: "U74103TN2025OPC177570",
  address: "766, TOWER 1, SHAKTI TOWERS, GROUND FLOOR, ANNA SALAI, CHENNAI, INDIA - 600002",
  grievanceOfficer: "Arun",
  jurisdiction: "India",
  courts: "Chennai, Tamil Nadu",
  effectiveDate: "June 13, 2026",
};

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
};

const { company, legalName, email, website, address, cin, grievanceOfficer, jurisdiction, courts } =
  legalMeta;

export const privacyPolicy: LegalDoc = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  updated: legalMeta.effectiveDate,
  intro: [
    `This Privacy Policy explains how ${legalName} (“${company}”, “we”, “us”, or “our”) handles information in connection with our website (${website}) and our products — Zeros and NammaTN (together, the “Services”).`,
    `We built ${company} to be privacy-first. We do not sell, rent, or trade your personal data, we do not run advertising or behavioural tracking, and our products are designed to work without us collecting your personal data. This policy describes that approach and your rights.`,
  ],
  sections: [
    {
      heading: "Our Privacy-First Approach",
      blocks: [
        {
          type: "ul",
          items: [
            "We do not collect, store, or process your personal data on our servers in order to provide our Services.",
            "Zeros runs entirely on your own Mac — your code, files, prompts, and API keys stay on your device and are never sent to us.",
            "We do not sell or monetise personal data, and we do not use advertising, profiling, or cross-site tracking.",
            "You do not need to create an account with us to use our website or to browse NammaTN.",
          ],
        },
      ],
    },
    {
      heading: "Information We Collect",
      blocks: [
        {
          type: "p",
          text: "In the ordinary course of providing the Services, we do not require or collect personal data from you. The limited, incidental processing that can occur is described below:",
        },
        {
          type: "ul",
          items: [
            "Website: Our website does not set advertising or tracking cookies and does not require an account. Like any website, requests are delivered through hosting and content-delivery providers that may process standard technical information (such as IP address and browser type) in their logs to serve and protect the site. We do not use this information to identify or profile you.",
            "If you contact us: When you email us (for example, at " + email + "), we receive the information you choose to include, such as your name and email address, and use it only to respond to you.",
          ],
        },
      ],
    },
    {
      heading: "Zeros (Our macOS App)",
      blocks: [
        {
          type: "p",
          text: "Zeros is a native macOS application that runs locally on your device. It is designed so that your data stays with you:",
        },
        {
          type: "ul",
          items: [
            "Your content — code, files, prompts, and project data — is processed on your device. It is not transmitted to, received by, or stored by " + company + ".",
            "Bring-your-own keys: any API keys or credentials you provide are stored locally on your device (for example, in the macOS Keychain) and are used only to connect your device directly to the AI provider you choose. We never receive or store your keys.",
            "Third-party AI providers: when you connect a model or service (for example, an LLM provider), Zeros communicates directly between your device and that provider using your keys. The content you send is handled under that provider's own privacy policy and terms — not by us.",
            "We operate no servers that receive your Zeros content, and we do not log it. Because your data lives on your device, you control it: you can delete it at any time by removing the relevant files or uninstalling the app.",
          ],
        },
      ],
    },
    {
      heading: "NammaTN",
      blocks: [
        {
          type: "p",
          text: "NammaTN is a free, open civic platform for Tamil Nadu. You can browse government and district information without creating an account. Where the platform lets you submit civic reports or information, that content is intended to be public, open civic data; please do not include sensitive personal information you do not wish to be public. We do not sell or monetise this information. Any account or in-product notices presented within NammaTN apply in addition to this policy.",
        },
      ],
    },
    {
      heading: "Payments and the App Store",
      blocks: [
        {
          type: "p",
          text: "If you purchase or download Zeros through the Apple App Store, your transaction and any payment details are processed by Apple under Apple's terms and privacy policy. We do not receive or store your payment-card details. We may receive limited, aggregated sales information from Apple that does not identify you.",
        },
      ],
    },
    {
      heading: "Cookies and Tracking",
      blocks: [
        {
          type: "p",
          text: "Our website does not use advertising, analytics-profiling, or cross-site tracking cookies. Any cookies strictly necessary to operate the site are limited to that purpose. You can control or block cookies through your browser settings.",
        },
      ],
    },
    {
      heading: "Third-Party Services",
      blocks: [
        {
          type: "p",
          text: "We rely on a small number of third parties to make the Services available. These parties act under their own privacy policies, which we encourage you to review:",
        },
        {
          type: "ul",
          items: [
            "Hosting and content-delivery providers that serve our website;",
            "Apple, for distribution and payment of the Zeros app via the App Store;",
            "AI model and infrastructure providers that you choose to connect to Zeros using your own keys.",
          ],
        },
      ],
    },
    {
      heading: "Data Security",
      blocks: [
        {
          type: "p",
          text: "The strongest protection for your data is that, by design, we do not collect or store it. For the limited systems we do operate, we apply reasonable security practices and procedures appropriate to the nature of the information, consistent with applicable law. No system can be guaranteed to be completely secure.",
        },
      ],
    },
    {
      heading: "Your Rights",
      blocks: [
        {
          type: "p",
          text: "Under India's Digital Personal Data Protection Act, 2023 and other applicable law, you have rights in respect of any personal data we hold about you, including the right to:",
        },
        {
          type: "ul",
          items: [
            "Access a summary of personal data we process about you;",
            "Request correction, completion, updating, or erasure of your personal data;",
            "Seek grievance redressal (see below);",
            "Nominate another individual to exercise your rights in the event of death or incapacity;",
            "Withdraw any consent you have given, as easily as it was given.",
          ],
        },
        {
          type: "p",
          text: `Because we generally do not hold personal data about you, in most cases there will be nothing for us to access, correct, or delete — but you may contact us at ${email} to make a request, and we will respond in accordance with applicable law.`,
        },
      ],
    },
    {
      heading: "Grievance Redressal",
      blocks: [
        {
          type: "p",
          text: `If you have any complaint or concern about how your personal data is handled, you may contact our Grievance Officer / Privacy Contact: ${grievanceOfficer}, at ${email}. We will acknowledge and address grievances within the timelines required by applicable law (and in any case within 30 days). For content-related complaints on NammaTN, we will acknowledge within 24 hours and endeavour to resolve them within 15 days.`,
        },
      ],
    },
    {
      heading: "Children's Privacy",
      blocks: [
        {
          type: "p",
          text: "Our Services are intended for adults and are not directed to children under the age of 18. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us and we will take appropriate steps to delete it.",
        },
      ],
    },
    {
      heading: "International Users and Data Transfers",
      blocks: [
        {
          type: "p",
          text: "Because we are designed not to collect your personal data, cross-border transfers of your data by us are minimal. The third-party infrastructure that delivers the Services may operate in or outside India under their own safeguards and applicable law.",
        },
      ],
    },
    {
      heading: "Changes to This Policy",
      blocks: [
        {
          type: "p",
          text: "We may update this Privacy Policy from time to time. When we make material changes, we will revise the date at the top of this page and, where appropriate, provide additional notice. Your continued use of the Services after changes take effect constitutes your acceptance of the updated policy.",
        },
      ],
    },
    {
      heading: "Contact Us",
      blocks: [
        {
          type: "p",
          text: "If you have any questions about this Privacy Policy or our data practices, please contact us:",
        },
        {
          type: "ul",
          items: [
            legalName,
            `Registered office: ${address}`,
            `CIN: ${cin}`,
            `Email: ${email}`,
            `Web: ${website}`,
          ],
        },
      ],
    },
  ],
};

export const termsOfService: LegalDoc = {
  slug: "terms",
  title: "Terms of Service",
  updated: legalMeta.effectiveDate,
  intro: [
    `These Terms of Service (“Terms”) govern your access to and use of the website (${website}), software, and products operated by ${legalName} (“${company}”, “we”, “us”, or “our”), including the Zeros macOS application and the NammaTN platform (together, the “Services”).`,
    `By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, do not use the Services.`,
  ],
  sections: [
    {
      heading: "About Us",
      blocks: [
        {
          type: "p",
          text: `The Services are provided by ${legalName}, a One Person Company incorporated in India.`,
        },
        {
          type: "ul",
          items: [
            `Registered office: ${address}`,
            `CIN: ${cin}`,
            `Email: ${email}`,
          ],
        },
      ],
    },
    {
      heading: "Acceptance of These Terms",
      blocks: [
        {
          type: "p",
          text: "By creating an account, downloading or using our software, or otherwise accessing the Services, you confirm that you have read, understood, and agree to these Terms, together with our Privacy Policy, which is incorporated by reference.",
        },
      ],
    },
    {
      heading: "Eligibility",
      blocks: [
        {
          type: "p",
          text: "You must be at least 18 years old and competent to enter into a legally binding contract under the Indian Contract Act, 1872. By using the Services, you represent and warrant that you meet these requirements and that any information you provide is accurate.",
        },
      ],
    },
    {
      heading: "Licence to Use Zeros",
      blocks: [
        {
          type: "p",
          text: "Subject to these Terms, we grant you a limited, personal, non-exclusive, non-transferable, non-sublicensable, and revocable licence to download and use the Zeros application on Apple-branded devices that you own or control, solely for your lawful use. You may not:",
        },
        {
          type: "ul",
          items: [
            "Copy, distribute, resell, rent, lease, or sublicense the software;",
            "Reverse-engineer, decompile, or disassemble the software, except to the extent this restriction is prohibited by law;",
            "Remove or alter any proprietary notices, or attempt to derive source code;",
            "Use the software to develop a competing product or in any unlawful manner.",
          ],
        },
      ],
    },
    {
      heading: "Intellectual Property",
      blocks: [
        {
          type: "p",
          text: `All rights, title, and interest in and to the Services — including the software, design, trademarks, and all related intellectual property — are and remain owned by ${company} and its licensors. Except for the limited licence granted above, these Terms do not transfer any rights to you.`,
        },
      ],
    },
    {
      heading: "Your Content",
      blocks: [
        {
          type: "p",
          text: "You retain all rights to the code, files, and other content you create or use with the Services. Because your Zeros content stays on your device and is not transmitted to us, we claim no ownership of, and acquire no licence to, that content. You are solely responsible for your content and for maintaining your own backups.",
        },
      ],
    },
    {
      heading: "Acceptable Use",
      blocks: [
        { type: "p", text: "You agree not to use the Services to:" },
        {
          type: "ul",
          items: [
            "Violate any applicable law or the rights of others;",
            "Upload or distribute malware, or interfere with the integrity, security, or performance of the Services;",
            "Attempt to gain unauthorised access to any system, account, or data;",
            "Use the Services to generate or distribute unlawful, infringing, or harmful material.",
          ],
        },
      ],
    },
    {
      heading: "NammaTN",
      blocks: [
        {
          type: "p",
          text: "NammaTN is provided free of charge as a public civic resource. You are responsible for any content you submit and must not post unlawful, defamatory, or infringing material. We may remove content or restrict access where required to comply with law or these Terms. Complaints regarding content may be sent to our Grievance Officer at " + email + ".",
        },
      ],
    },
    {
      heading: "Fees, Payments, and the App Store",
      blocks: [
        {
          type: "p",
          text: "Where Zeros or any feature is offered for a fee, the applicable price (inclusive or exclusive of taxes such as GST, as indicated) will be shown before purchase. Purchases made through the Apple App Store are processed by Apple and are subject to Apple's payment terms, billing, and refund policies. Any refunds for App Store purchases are handled by Apple in accordance with those policies.",
        },
      ],
    },
    {
      heading: "Third-Party Services and AI Outputs",
      blocks: [
        {
          type: "p",
          text: "Zeros lets you connect third-party AI models and services using your own keys. Your use of those services is governed by their terms and policies, and you are responsible for complying with them and for any charges they impose. AI-generated output may be inaccurate, incomplete, or unsuitable for your purpose; you are responsible for reviewing and verifying any output before relying on it. We are not responsible for third-party services or for AI output produced through them.",
        },
      ],
    },
    {
      heading: "Apple App Store Terms",
      blocks: [
        {
          type: "p",
          text: "Where you obtain Zeros through the Apple App Store, the following additional terms apply and, to the extent of any conflict regarding the App Store, control:",
        },
        {
          type: "ul",
          items: [
            "These Terms are concluded between you and " + company + " only, and not with Apple. " + company + ", not Apple, is solely responsible for the Zeros application and its content.",
            "Apple has no obligation to furnish any maintenance or support services for Zeros.",
            "In the event of any failure of Zeros to conform to any applicable warranty, you may notify Apple, and Apple may refund the purchase price to you; to the maximum extent permitted by law, Apple has no other warranty obligation with respect to Zeros.",
            company + " is responsible for addressing any claims relating to Zeros, including product-liability, legal or regulatory, and intellectual-property claims, to the extent required by these Terms and applicable law.",
            "You represent that you are not located in a country subject to a U.S. Government embargo or designated as a “terrorist supporting” country, and that you are not on any U.S. Government list of prohibited or restricted parties.",
            "Apple and its subsidiaries are third-party beneficiaries of these Terms and, upon your acceptance, have the right (and are deemed to have accepted the right) to enforce these Terms against you.",
          ],
        },
      ],
    },
    {
      heading: "Disclaimers",
      blocks: [
        {
          type: "p",
          text: "The Services are provided “as is” and “as available”, without warranties of any kind, whether express, implied, or statutory, including any implied warranties of merchantability, fitness for a particular purpose, accuracy, or non-infringement. We do not warrant that the Services will be uninterrupted, error-free, or secure.",
        },
      ],
    },
    {
      heading: "Limitation of Liability",
      blocks: [
        {
          type: "p",
          text: `To the maximum extent permitted by applicable law, ${company} and its director, officers, and personnel will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of data, profits, or goodwill. Our total aggregate liability arising out of or relating to the Services will not exceed the greater of the amount you paid us for the Services in the twelve (12) months before the event giving rise to the claim, or INR 5,000.`,
        },
      ],
    },
    {
      heading: "Indemnification",
      blocks: [
        {
          type: "p",
          text: `You agree to indemnify and hold harmless ${company} from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or related to your use of the Services, your content, or your breach of these Terms or of any applicable law or third-party rights.`,
        },
      ],
    },
    {
      heading: "Termination",
      blocks: [
        {
          type: "p",
          text: "We may suspend or terminate your access to the Services at any time if you breach these Terms or use the Services in a way that may cause harm or legal liability. You may stop using the Services at any time. Provisions that by their nature should survive termination — including intellectual property, disclaimers, limitation of liability, indemnity, and governing law — will survive.",
        },
      ],
    },
    {
      heading: "Governing Law and Jurisdiction",
      blocks: [
        {
          type: "p",
          text: `These Terms are governed by and construed in accordance with the laws of ${jurisdiction}, without regard to conflict-of-laws principles. Subject to the “Dispute Resolution” section below, the courts at ${courts} will have exclusive jurisdiction over any dispute arising out of or relating to these Terms or the Services.`,
        },
      ],
    },
    {
      heading: "Dispute Resolution",
      blocks: [
        {
          type: "p",
          text: `Any dispute, controversy, or claim arising out of or relating to these Terms that cannot be resolved amicably will be referred to and finally resolved by arbitration under the Arbitration and Conciliation Act, 1996. The arbitration will be conducted by a sole arbitrator appointed by ${company}, the seat and venue of arbitration will be ${courts}, and the language of the arbitration will be English. The award will be final and binding on the parties.`,
        },
      ],
    },
    {
      heading: "Changes to These Terms",
      blocks: [
        {
          type: "p",
          text: "We may revise these Terms from time to time. When changes are material, we will update the date at the top of this page. Your continued use of the Services after the changes take effect constitutes your acceptance of the revised Terms.",
        },
      ],
    },
    {
      heading: "General",
      blocks: [
        {
          type: "ul",
          items: [
            "Severability: if any provision of these Terms is held unenforceable, the remaining provisions will remain in full force and effect.",
            "No waiver: our failure to enforce any right or provision is not a waiver of that right or provision.",
            "Assignment: you may not assign these Terms without our prior written consent; we may assign them in connection with a reorganisation or transfer of our business.",
            "Force majeure: we are not liable for any delay or failure to perform caused by events beyond our reasonable control.",
            "Entire agreement: these Terms and the Privacy Policy constitute the entire agreement between you and us regarding the Services.",
          ],
        },
      ],
    },
    {
      heading: "Contact Us",
      blocks: [
        { type: "p", text: "Questions about these Terms? Contact us:" },
        {
          type: "ul",
          items: [legalName, `Email: ${email}`, `Web: ${website}`],
        },
      ],
    },
  ],
};

export const legalDocs = [privacyPolicy, termsOfService];
