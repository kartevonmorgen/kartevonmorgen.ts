import { createContext } from 'react'
import { TagMarkerColors } from '../dtos/TagMarkerColors'


export interface MapMarkerTagIcon {
  tag: string
  icon: string
}

export type MapMarkerTagsIcons = Array<MapMarkerTagIcon>

export const MapMarkerTagsIconsContext = createContext<MapMarkerTagsIcons>([])

export const TagMarkerColorsContext = createContext<TagMarkerColors>([])

export default MapMarkerTagsIconsContext