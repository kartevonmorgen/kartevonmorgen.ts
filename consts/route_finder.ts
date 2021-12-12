export interface RouteFinder {
  name: string
  link: string
}


export const ROUTE_FINDER: Record<'default' |
  'apple' |
  'android'
  , RouteFinder> = {
  default: {
    name: 'Graphhopper Maps',
    link: 'https://graphhopper.com/maps/?point=&point={addr}&locale=de-DE&vehicle=bike&weighting=fastest&elevation=false&use_miles=false&layer=Omniscale',
  },
  apple: {
    name: 'Apple Maps',
    link: 'http://maps.apple.com/?daddr={addr}&dirflg=w',
  },
  android: {
    name: 'GeoURI',
    link: 'geo:{lat},{lng}',
  },
}