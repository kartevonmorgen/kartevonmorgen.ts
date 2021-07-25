import { NextRouter } from 'next/router'


export const isRouterInitialized = (router: NextRouter): boolean => {
  const { query } = router
  const {
    lat,
    lng,
    zoom,
    isSidebarOpen,
  } = query
  const initializeIndicators = [lat, lng, zoom, isSidebarOpen]

  const areAllIndicatorsInitialized: boolean = initializeIndicators.every((indicator) => indicator !== undefined)

  return areAllIndicatorsInitialized
}