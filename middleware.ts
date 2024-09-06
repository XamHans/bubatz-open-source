import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { auth, nextUrl } = req
  const isLoggedIn = !!auth
  const isAdminUser = auth?.user?.role === 'ADMIN'
  const isApiRoute = nextUrl.pathname.startsWith('/api')
  const isAuthRoute =
    nextUrl.pathname.startsWith('/signin') ||
    nextUrl.pathname.startsWith('/signup')

  // console.log('Middleware - Request URL:', nextUrl.pathname)
  // console.log('Middleware - Is Logged In:', isLoggedIn)
  // console.log('Middleware - Is Admin User:', isAdminUser)
  // console.log('Middleware - Is API Route:', isApiRoute)
  // console.log('Middleware - Is Auth Route:', isAuthRoute)
  // console.log('Middleware - User:', JSON.stringify(auth?.user, null, 2))

  // Allow access to auth routes and API routes
  if (isAuthRoute || isApiRoute) {
    console.log('Middleware - Allowing access to auth/api route')
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn && !isAuthRoute) {
    console.log('Middleware - Redirecting to login (not authenticated)')
    const signInUrl = new URL('/signin', nextUrl.origin)
    return NextResponse.redirect(signInUrl)
  }

  // Allow admin access to everything
  if (isAdminUser) {
    console.log('Middleware - Allowing admin access')
    return NextResponse.next()
  }

  if (auth && auth.user && auth.user.role === 'MEMBER') {
    const userProfilePath = `/members/${auth.user.id}`
    const userProfileEditPath = `/members/${auth.user.id}/edit`

    // Check if the user is already on their profile page
    if (
      nextUrl.pathname === userProfilePath ||
      nextUrl.pathname === userProfileEditPath
    ) {
      console.log('Middleware - User is on their profile page, allowing access')
      return NextResponse.next()
    }

    // Redirect non-admin users to their own profile page
    console.log('Middleware - Redirecting non-admin user to their profile')
    const userProfileUrl = new URL(userProfilePath, nextUrl.origin)
    return NextResponse.redirect(userProfileUrl)
  }

  // Fallback: redirect to home or show an error page
  console.log('Middleware - Unexpected user state, redirecting to home')
  return NextResponse.redirect(new URL('/', nextUrl.origin))
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
