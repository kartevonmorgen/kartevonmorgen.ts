import { ParsedUrlQuery } from 'querystring'
import { convertQueryParamToLatLng } from '../utils/router'


class Point {

  readonly lat: number
  readonly lng: number

  constructor(lat: number = 0, lan: number = 0) {
    this.lat = lat
    this.lng = lan
  }

  fromQuery(query: ParsedUrlQuery): Point {
    const { pinCenter } = query
    const { lat, lng } = convertQueryParamToLatLng(pinCenter)

    return new Point(lat, lng)
  }

  toArray(): [number, number] {
    return [this.lat, this.lng]
  }

  toJson(): any {
    return {
      lat: this.lat,
      lng: this.lng,
    }
  }

  isEmpty(): boolean {
    if (this.lat === 0 || this.lng === 0) {
      return true
    }

    return false
  }

}


export default Point