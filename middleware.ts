import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // For localhost or when geo detection fails, show both US and UK stores
  const isLocalhost = request.headers.get('host')?.includes('localhost')
  const country = isLocalhost ? 'BOTH' : (request.geo?.country || 'BOTH')
  
  // Add the country to request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-country', country)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Only run middleware on the book page
export const config = {
  matcher: '/big-ideas-little-pictures',
} 