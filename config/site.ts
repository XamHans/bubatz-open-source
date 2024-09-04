import { type NavItemFooter } from '@/types'
import {
  Leaf,
  LogOut,
  Package2,
  PenSquareIcon,
  Settings,
  Users2,
} from 'lucide-react'

const links = {
  signIn: '/signin',
  signUp: '/signup',
  signOut: '/',
  gitHub: 'https://github.com/XamHans/bubatz-open-source',
  members: {
    index: '/members',
    new: '/members/new',
    detail: '/members/:id',
    edit: '/members/:id/edit',
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
      edit: '/plants/strains/:id/edit',
    },
  },
}

export const siteConfig = {
  name: 'Bubatz Manager',
  description: '.',
  auth: {
    providers: {
      emailPassword: true,
      phoneNumber: false,
      emailLink: false,
      emailOtp: false,
      // oAuth: ['google', 'github'] as Provider[],
    },
  },
  links,
  url: 'https://bubatz.club',

  // ogImage: links.openGraphImage,
  keywords: ['SaaS', 'Next.js', 'Template'],
  navItems: [
    {
      name: 'Sales',
      href: links.sales.index,
      icon: Package2,
    },
    {
      name: 'Plants',
      href: links.plants.index,
      icon: Leaf,
    },
    {
      name: 'Members',
      href: links.members.index,
      icon: Users2,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
    {
      name: 'Jobs',
      href: 'https://jobs.bubatz.club/',
      icon: PenSquareIcon,
    },
    {
      name: 'Logout',
      href: links.signOut,
      icon: LogOut,
    },
  ],
  navItemsMobile: [],
  navItemsFooter: [] satisfies NavItemFooter[],
}
