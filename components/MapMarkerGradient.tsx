import { FC } from 'react'


const MapMarkerGradient: FC = () => (
  <svg width="0" height="0">
    <linearGradient id="lgrad" x1="100%" y1="100%" x2="0%" y2="0%">
      <stop
        offset="0%"
        stopColor="rgb(252,207,49)"
        stopOpacity={1}
      />
      <stop
        offset="100%"
        stopColor="rgb(245,85,85)"
        stopOpacity={1}
      />
    </linearGradient>
  </svg>
)

export default MapMarkerGradient