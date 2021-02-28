import { MapLocationProps } from '../components/Map'
import PopularTagsRequest from './PopularTagsRequest'


export interface MapConfigs {
  location: MapLocationProps
}

// it's the same from the /public/[project]/config.json
export default interface MapPageConfigs {
  map: MapConfigs
  popularTags: PopularTagsRequest
}