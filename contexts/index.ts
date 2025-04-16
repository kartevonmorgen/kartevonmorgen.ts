import { createContext } from 'react'


export interface MapMarkerTagIcon {
  tag: string
  icon: string
}

export type MapMarkerTagsIcons = Array<MapMarkerTagIcon>

export const MapMarkerTagsIconsContext = createContext<MapMarkerTagsIcons>([])

export default MapMarkerTagsIconsContext