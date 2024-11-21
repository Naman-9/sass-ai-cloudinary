// createRouteMatcher -> an array to match routes clerk do it own it's own
// do not depends on next js router
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/sign-in', 
    '/sign-up', 
    '/', 
    '/home'
]);

const isPublicApiRoute = createRouteMatcher([
    '/api/videos'
]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const currentUrl = new URL(req.url);

  // somebody Accessing home or not
  const isAccessingDashboard = currentUrl.pathname === '/home';

//   check if it's "api" request
  const isApiRequest = currentUrl.pathname.startsWith('/api');

  //  if user is logged in and accessing a public route but not the dashboard
  if (userId && isPublicRoute(req) && !isAccessingDashboard) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // user not logged in
  if (!userId) {
    // user not logged in and trying to access the protected route
    if (!isPublicRoute(req) && !isPublicRoute(req)) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // if the request is for a protected API and the user is not logged in
    if (isApiRequest && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"
  ],
};
