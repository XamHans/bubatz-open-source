import { Provider } from '@supabase/supabase-js';

const production = process.env.NODE_ENV === 'production';

enum Themes {
  Light = 'light',
  Dark = 'dark',
}

const configuration = {
  site: {
    name: 'Bubatz Club Manager',
    description: '',
    themeColor: '#ffffff',
    themeColorDark: '#0a0a0a',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Bubatz Club Manager',
    twitterHandle: '',
    githubHandle: '',
    convertKitFormId: '',
    locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  },
  auth: {
    // ensure this is the same as your Supabase project. By default - it's true
    requireEmailConfirmation:
      process.env.NEXT_PUBLIC_REQUIRE_EMAIL_CONFIRMATION === 'true',
    // NB: Enable the providers below in the Supabase Console
    // in your production project
    providers: {
      emailPassword: true,
      phoneNumber: false,
      emailLink: false,
      emailOtp: false,
      oAuth: ['google', 'github'] as Provider[],
    },
  },
  production,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? process.env.NODE_ENV,
  theme: Themes.Light,

  paths: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    signInMfa: '/auth/verify',
    onboarding: `/onboarding`,
    appHome: '/dashboard',
    authCallback: '/auth/callback',

    members: {
      all: 'members/',
      detail: 'members/:id',
    },
    sales: {
      all: '/sales',
      detail: '/sales/:id',
      new: '/sales/new-sale',
    },
    plants: {
      all: 'plants/',
      new: '/plants/new',
      detail: 'plants/:id',
    },
    plants: {
      all: 'plants/',
      new: '/plants/new',
      detail: 'plants/:id',
    },
  },
};

export default configuration;
