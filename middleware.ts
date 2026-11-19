
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const actionId = request.headers.get('Next-Action');

  if (actionId) {
    console.warn('[Next Action request]', {
      actionId,
      method: request.method,
      url: request.nextUrl.pathname,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      ip: request.headers.get('x-forwarded-for'),
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
