export const BASICS_API_URL: string = process.env.NEXT_PUBLIC_BASICS_API_URL


export const BASICS_ENDPOINTS = {
  searchEntries: (): string => `${BASICS_API_URL}/search`,
  searchEvents: (): string => `${BASICS_API_URL}/events`,
}
