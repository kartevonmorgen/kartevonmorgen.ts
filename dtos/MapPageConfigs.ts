import { MapLocationProps } from '../components/Map'
import PopularTagsRequest from './PopularTagsRequest'


export interface MapConfigs {
  location: MapLocationProps
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