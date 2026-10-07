import { site } from './site';

export interface LegalDocument {
  path: '/privacy' | '/terms';
  title: string;
  description: string;
  kicker: string;
  heading: string;
  /** Trusted, static HTML. */
  lead: string;
  sections: { id: string; title: string; body: string[] }[];
}

const email = `<a href="mailto:${site.email}">${site.email}</a>`;
const company = `${site.company} (“Withso”, “we” or “us”)`;

export const privacy: LegalDocument = {
  path: '/privacy',
  title: 'Privacy policy | Withso',
  description:
    'How the Withso website handles technical information and correspondence, and how to reach us about privacy requests.',
  kicker: 'Website policy',
  heading: 'Privacy policy',
  lead: `This privacy policy explains how ${company} handles personal information in connection with this website, withso.com. It applies to this website only. Our products, including Mapsmith and JurisField, process information under the privacy notices provided within those services.`,
  sections: [
    {
      id: 'information-we-process',
      title: 'Information we process when you visit',
      body: [
        'This website presents company and product information. It does not require an account, does not collect form submissions, and does not use advertising, behavioural analytics or tracking scripts.',
        'When you visit, our hosting provider processes technical information — such as your IP address, browser and device details, the pages requested and request timestamps — in server logs, in order to deliver the website, keep it secure and diagnose faults. Hosting access controls may use essential session cookies.',
      ],
    },
    {
      id: 'information-you-share',
      title: 'Information you choose to share',
      body: [
        'If you contact us by email, we receive your email address and the information you include in your message. We ask that you share only the information necessary for your enquiry.',
      ],
    },
    {
      id: 'how-we-use-information',
      title: 'How we use information',
      body: [
        'We use the information described above to respond to enquiries and manage the related business correspondence, to operate, maintain and secure this website, and to comply with applicable legal obligations.',
      ],
    },
    {
      id: 'how-we-share-information',
      title: 'How we share information',
      body: [
        'We do not sell or rent personal information. We share it only with the service providers that host or operate this website and our email on our behalf, where you have asked us to, or where disclosure is required by law.',
      ],
    },
    {
      id: 'retention',
      title: 'How long we keep information',
      body: [
        'We keep correspondence for as long as needed to handle your enquiry, to maintain an ongoing business relationship, and to meet applicable legal obligations. Server logs are retained in line with our hosting provider’s practices.',
      ],
    },
    {
      id: 'security',
      title: 'Security',
      body: [
        'We take reasonable technical and organisational measures to protect the information we hold. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
      ],
    },
    {
      id: 'third-party-websites',
      title: 'Third-party websites and services',
      body: [
        'This website links to third-party websites, including our product services and our profiles on LinkedIn, X and GitHub. Those services are governed by their own privacy notices, which describe how they handle information. This policy does not apply to them.',
      ],
    },
    {
      id: 'your-rights',
      title: 'Your rights and requests',
      body: [
        `You may contact us to request access to, or correction or deletion of, personal information you have shared with us, and we will respond as required by applicable law. We may need to verify your identity before acting on a request. Email ${email} with any privacy question or request. For information processed within a product, please use the contact details in that product’s privacy notice.`,
      ],
    },
    {
      id: 'changes-to-this-policy',
      title: 'Changes to this policy',
      body: [
        'If we change this policy, we will publish the updated version on this page and revise the date above.',
      ],
    },
  ],
};

export const terms: LegalDocument = {
  path: '/terms',
  title: 'Terms & conditions | Withso',
  description: 'The terms that govern use of the Withso website, its content and its links to other services.',
  kicker: 'Website terms',
  heading: 'Terms & conditions',
  lead: `These terms and conditions (“Terms”) govern your access to and use of this website, withso.com, operated by ${company}. By accessing this website, you accept these Terms. Please read them together with our <a href="/privacy">Privacy policy</a>.`,
  sections: [
    {
      id: 'about-this-website',
      title: 'About this website',
      body: [
        'This website provides information about Withso, our products and our work, and is offered for general informational purposes. Product features, availability and commercial terms may change over time. The use of any Withso product is governed by that product’s own terms, privacy policy and any written agreement with us.',
        'Interactive workspaces and records shown on this website are illustrations built with sample data. They are not live product sessions and do not show real places, people or measurements.',
      ],
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable use',
      body: [
        'You may browse this website and use its content for lawful purposes. You must not interfere with its operation or security, attempt to gain unauthorised access to it or its systems, introduce malicious content, use automated means to extract its content in bulk, or infringe the rights of others.',
      ],
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual property',
      body: [
        'The original text, design, illustrations, logos and brand assets on this website belong to Withso or their respective owners and are protected by intellectual property laws. You may link to these pages and refer to our products by name with attribution. These Terms do not grant you a licence to our software or content, and you may not reproduce or redistribute them without our written permission. Third-party names and marks belong to their respective owners.',
      ],
    },
    {
      id: 'third-party-links',
      title: 'Third-party links and services',
      body: [
        'This website may link to third-party websites and services. We do not control them and are not responsible for their content, availability or practices. A link does not imply endorsement. Their own terms and policies apply when you use them.',
      ],
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers',
      body: [
        'This website and its content are provided “as is” and “as available”. To the extent permitted by applicable law, we make no warranty that the website will be accurate, complete, uninterrupted or suitable for a particular purpose.',
      ],
    },
    {
      id: 'limitation-of-liability',
      title: 'Limitation of liability',
      body: [
        'To the maximum extent permitted by applicable law, Withso is not liable for any indirect, incidental or consequential damages, or for any loss of data or profits, arising from or in connection with your use of, or inability to use, this website. Nothing in these Terms excludes or limits liability or rights that cannot lawfully be excluded or limited.',
      ],
    },
    {
      id: 'governing-law',
      title: 'Governing law and jurisdiction',
      body: [
        'These Terms are governed by the laws of India. The courts at Chennai, Tamil Nadu, India have exclusive jurisdiction over disputes arising from these Terms or your use of this website, without affecting any mandatory rights that apply to you.',
      ],
    },
    {
      id: 'changes-to-these-terms',
      title: 'Changes to these Terms',
      body: [
        `We may revise these Terms by publishing an updated version and date on this page. Continued use of the website after a revision takes effect constitutes acceptance of the updated Terms. For questions about these Terms or copyright concerns, contact ${email}.`,
      ],
    },
  ],
};
