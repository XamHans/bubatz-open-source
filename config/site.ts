import { type NavItem, type NavItemFooter } from '@/types';

const links = {
  signIn: '/signin',
  signUp: '/signup',
  signOut: '/',
  members: {
    index: '/members',
    new: '/members/new',
    detail: '/members/:id',
  },
  sales: {
    index: '/sales',
    new: '/sales/new',
    detail: '/sales/:id',
  },
  plants: {
    index: '/plants',
    batches: {
      index: '/plants/batches',
      detail: '/plants/batches/:id',
      new: '/plants/batches/new',
    },
    strains: {
      new: '/plants/strains/new',
      detail: '/plants/strains/:id',
    },
  },
};

export const siteConfig = {
  name: 'Bubatz Manager',
  description: '.',
  auth: {
    providers: {
      emailPassword: true,
      phoneNumber: false,
      emailLink: false,
      emailOtp: false,
      oAuth: ['google', 'github'] as Provider[],
    },
  },
  links,
  url: 'https://bubatz.club',

  ogImage: links.openGraphImage,
  keywords: ['SaaS', 'Next.js', 'Template'],
  navItems: [
    {
      title: 'About',
      href: '/about',
    },
    {
      title: 'Features',
      href: '/features',
    },
    {
      title: 'Pricing',
      href: '/pricing',
    },
    {
      title: 'FAQ',
      href: '/faq',
    },
    {
      title: 'Docs',
      href: '/docs',
    },
    {
      title: 'Blog',
      href: '/blog',
    },
  ] satisfies NavItem[],
  navItemsMobile: [],
  navItemsFooter: [
    {
      title: 'Company',
      items: [
        {
          title: 'About',
          href: '/about',
          external: false,
        },
        {
          title: 'Privacy',
          href: '/privacy',
          external: false,
        },
        {
          title: 'Terms',
          href: '/tos',
          external: false,
        },
        {
          title: 'Careers',
          href: '/careers',
          external: false,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          title: 'Docs',
          href: '/docs',
          external: false,
        },
        {
          title: 'FAQ',
          href: '/faq',
          external: false,
        },
        {
          title: 'Blog',
          href: '/blog',
          external: false,
        },
        {
          title: 'Contact',
          href: '/contact',
          external: false,
        },
      ],
    },
    {
      title: 'Inspiration',
      items: [
        {
          title: 'Shadcn',
          href: 'https://ui.shadcn.com/',
          external: true,
        },
        {
          title: 'Taxonomy',
          href: 'https://tx.shadcn.com/',
          external: true,
        },
        {
          title: 'Skateshop',
          href: 'https://skateshop.sadmn.com/',
          external: true,
        },
        {
          title: 'Acme Corp',
          href: 'https://acme-corp.jumr.dev/',
          external: true,
        },
      ],
    },
  ] satisfies NavItemFooter[],
};
