export const site = {
  name: 'Withso',
  origin: 'https://withso.com',
  company: 'Withso Technologies (OPC) Private Limited',
  cin: 'U74103TN2025OPC177570',
  incorporated: 'Incorporated in India · 2025',
  email: 'contact@withso.com',
  address: ['766, Tower 1, Shakti Towers, Ground Floor,', 'Anna Salai, Chennai, India – 600002'],
  location: 'Chennai, India',
  policyDate: '7 October 2026',
  policyDateIso: '2026-10-07',
} as const;

export const mailto = (subject?: string) =>
  `mailto:${site.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

export const social = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/withso' },
  { id: 'x', label: 'X', href: 'https://x.com/withsoAI' },
  { id: 'github', label: 'GitHub', href: 'https://github.com/Withso' },
  { id: 'email', label: 'Email', href: `mailto:${site.email}` },
] as const;

export type SocialId = (typeof social)[number]['id'];

// Product access goes through email, not outbound product sites.
export const links = {
  nammatn: 'https://nammatn.in/',
  zeros: 'https://github.com/Withso/zeros',
  zerosSite: 'https://zeros.build/',
} as const;

export const requestAccess = (product: string) => mailto(`${product} access request`);

export const companyNav = [
  { href: '/', label: 'Home' },
  { href: '/mapsmith', label: 'Mapsmith' },
  { href: '/jurisfield', label: 'JurisField' },
  { href: '/about', label: 'About' },
] as const;

export const sitemapRoutes = ['/', '/mapsmith', '/jurisfield', '/about', '/privacy', '/terms'] as const;
