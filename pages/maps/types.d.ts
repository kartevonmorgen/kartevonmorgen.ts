import {MapLocationProps} from '../../components/map'


export interface MapConfigs {
  location: MapLocationProps
}

// it's the same from the /public/[project]/config.json
export default interface MapPageConfigs {
  map: MapConfigs
}