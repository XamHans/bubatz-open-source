import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { auth, nextUrl } = req
  // const isLoggedIn = !!auth
  // const isAdminUser = auth?.user?.role === 'ADMIN'
  // const isApiRoute = nextUrl.pathname.startsWith('/api')
  // const isAuthRoute =
  //   nextUrl.pathname.startsWith('/signin') ||
  //   nextUrl.pathname.startsWith('/signup')
  // const isPublicRoute =
  //   nextUrl.pathname === '/' ||
  //   nextUrl.pathname === '/dsgvo' ||
  //   nextUrl.pathname === '/blog' ||
  //   nextUrl.pathname === '/impressum'

  // Check if the request is for a static asset
  const isStaticAsset = nextUrl.pathname.match(
    /\.(png|jpg|jpeg|gif|svg|ico|css|js)$/i,
  )

  // Allow access to static assets without further processing
  if (isStaticAsset) {
    return NextResponse.next()
  }

  // i18n routing logic
  // const locale = nextUrl.locale || 'de' // Default to German if no locale
  // const pathname = nextUrl.pathname

  // // Redirect if locale is missing from URL
  // if (!locales.includes(locale)) {
  //   return NextResponse.redirect(new URL(`/de${pathname}`, nextUrl.origin))
  // }

  // // Allow access to public routes, auth routes, and API routes
  // if (isPublicRoute || isAuthRoute || isApiRoute) {
  //   return NextResponse.next()
  // }

  // // Redirect to login if not authenticated
  // if (!isLoggedIn) {
  //   const signInUrl = new URL(`/${locale}/signin`, nextUrl.origin)
  //   return NextResponse.redirect(signInUrl)
  // }

  // if (isLoggedIn && isAuthRoute) {
  //   const membersUrl = new URL(`/${locale}/members`, nextUrl.origin)
  //   return NextResponse.redirect(membersUrl)
  // }

  // // Allow access for authenticated users
  // return NextResponse.next()
})

export const config = {
  unstable_allowDynamic: [
    '/node_modules/.pnpm/@react-email+tailwind@0.0.17_react@18.3.1/node_modules/@react-email/tailwind/dist/index.mjs',
    '/node_modules/.pnpm/@react-email/**',
    '/node_modules/.pnpm/tailwindcss/**',
  ],
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/', // Include root path
    '/(de|en)/:path*', // Add other locales as needed
  ],
}
