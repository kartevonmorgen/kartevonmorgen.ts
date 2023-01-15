export const GEOLOCATION_API_URL: string = process.env.NEXT_PUBLIC_GEOLOCATION_API


export const GEOLOCATION_ENDPOINTS = {
  queryGeoLocations: (): string => `${GEOLOCATION_API_URL}`,
}