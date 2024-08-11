import { auth } from '@/auth';

export default auth((req) => {
    // req.auth
    const { nextUrl } = req;
    console.log({ nextUrl });
    // const session = req.
    // if (!session) redirect(siteConfig.links.signIn);
});

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
