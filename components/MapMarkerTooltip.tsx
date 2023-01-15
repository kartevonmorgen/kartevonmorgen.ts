import { FC } from 'react'
import { Tooltip as LeafletTooltip, TooltipProps as LeafletTooltipProps } from 'react-leaflet'
import { Typography } from 'antd'
import { Duration, formatDuration, isValidDuration } from '../utils/time'


const { Text } = Typography


interface MapMarkerTooltipProps extends LeafletTooltipProps {
  text: string
  duration?: Duration
}

const MapMarkerTooltip: FC<MapMarkerTooltipProps> = (props) => {
  const { text, duration, ...leafletTooltipProps } = props

  return (
    <LeafletTooltip
      {...leafletTooltipProps}
    >
      <Text strong>{text}</Text>

      {
        isValidDuration(duration) && (
          <Text strong> - {formatDuration(duration)}</Text>
        )
      }
    </LeafletTooltip>
  )
}


export default MapMarkerTooltip
