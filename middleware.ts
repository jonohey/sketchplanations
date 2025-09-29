import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // For localhost or when geo detection fails, show both US and UK stores
  const isLocalhost = request.headers.get('host')?.includes('localhost')
  
  // Try multiple sources for country detection
  const geoCountry = request.geo?.country
  const cfCountry = request.headers.get('cf-ipcountry') // Cloudflare country header
  const vercelCountry = request.headers.get('x-vercel-ip-country') // Vercel country header
  
  // Use the first available country source
  const detectedCountry = geoCountry || cfCountry || vercelCountry
  
  // For localhost, allow testing with a query parameter
  const testCountry = request.nextUrl.searchParams.get('country')
  const country = isLocalhost 
    ? (testCountry || 'BOTH') 
    : (detectedCountry || 'BOTH')
  
  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware debug:', {
      isLocalhost,
      geoCountry,
      cfCountry,
      vercelCountry,
      detectedCountry,
      testCountry,
      country
    })
  }
  
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