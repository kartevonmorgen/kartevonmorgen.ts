import {useMemo} from 'react'
import dynamic from 'next/dynamic'


const MapPage = () => {
  const Map = useMemo(() => dynamic(
    () => import('../../components/map'),
    {
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])

  return <Map/>
}


export default MapPage