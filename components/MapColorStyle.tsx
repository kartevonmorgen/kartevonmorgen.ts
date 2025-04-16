import { FC } from 'react'
import { useRouter } from 'next/router'
import z from 'zod'
import { convertQueryParamToString } from '../utils/utils'


export enum MapColorModes {
    STANDARD = 'standard',
    GRAY = 'gray'
}

export const MapColorModesEnums = z.nativeEnum(MapColorModes)


const MapColorStyle: FC = () => {
    const router = useRouter()
    const { query } = router
    const mapColorMode = convertQueryParamToString(query.mapColorMode)

    if (mapColorMode == MapColorModes.GRAY) {
        return (
            <style jsx global>{`
                .leaflet-tile-pane {
                    -webkit-filter: grayscale(100%);
                    filter: grayscale(100%);
                }
            `}</style>
        )
    }

    return null
}


export default MapColorStyle
