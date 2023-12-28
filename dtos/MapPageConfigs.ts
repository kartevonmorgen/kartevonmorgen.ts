import { MapLocationProps } from '../components/Map'
import { MapColorModes } from '../components/MapColorStyle'
import PopularTagsRequest from './PopularTagsRequest'


export interface MapConfigs {
  location: MapLocationProps
  colorStyle: MapColorModes
}

export interface SidebarConfigs {
  title: string
}

// it's the same from the /public/[project]/config.json
export default interface MapPageConfigs {
  map: MapConfigs
  popularTags: PopularTagsRequest
  sidebar: SidebarConfigs
}