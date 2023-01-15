import { FC } from 'react'
import { parseToHsla, toHex, hsla } from 'color2k'


interface GradientProp {
  offset: number
  lightness: number
}

const gradientProps: GradientProp[] = [
  {
    offset: 0,
    lightness: 0.94,
  },
  {
    offset: 0.1285,
    lightness: 0.87,
  },
  {
    offset: 0.2977,
    lightness: 0.79,
  },
  {
    offset: 0.4696,
    lightness: 0.73,
  },
  {
    offset: 0.643,
    lightness: 0.68,
  },
  {
    offset: 0.8186,
    lightness: 0.66,
  },
  {
    offset: 1,
    lightness: 0.65,
  },
]


interface MapMarkerBalloonProps {
  color: string
}

const MapMarkerBalloon: FC<MapMarkerBalloonProps> = (props) => {
  const { color } = props

  const [h, s, _l, a] = parseToHsla(color)
  const mapMarkerBalloonId = `map-marker-balloon-${color}`

  return (
    <>
      <svg
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        x='0px'
        y='0px'
        viewBox='0 0 141.7 141.7'
      >
        <linearGradient id={mapMarkerBalloonId} gradientUnits="userSpaceOnUse" x1="75.26" y1="27.88" x2="75.26" y2="112.21">
          {
            gradientProps.map(({ lightness: l, offset }) => {
              const stopColor = toHex(hsla(h, s, l, a))
              return (
                <stop key={`stop-color-${color}-${l}`} stopColor={stopColor} offset={offset} />
              )
            })
          }
        </linearGradient>
        <path
          d='M103.6,55.6c0-15.3-12.7-27.7-28.3-27.7S46.9,40.3,46.9,55.6c0,4.4,1,8.5,2.9,12.2
	                  c-0.1,1.3,25.8,44.5,25.8,44.5S96.1,76.5,100.1,69C102.3,65,103.6,60.4,103.6,55.6z'
          style={{
            fill: `url(#${mapMarkerBalloonId})`,
          }}
        />
      </svg>
      )
    </>
  )
}

export default MapMarkerBalloon
