import { FC, ReactNode } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'


const leafShape = ({ width, height }) => {
  const w = width
  const h = height

  const DELTA = (w / 2) * 0.53
  const P0 = {
    x: 0,
    y: 0,
  }

  const P1 = {
    x: w / 2,
    y: 0.65 * h,
  }

  const P2 = {
    x: 0,
    y: h,
  }

  // move to P0
  return `M ${P0.x},${P0.y} ` +
    // start a bezier curve
    `C ${P0.x},${P0.y} ` +
    // P1
    `${P1.x},${P1.y - DELTA} ` +
    `${P1.x},${P1.y} ` +
    `${P1.x},${P1.y + DELTA} ` +
    // P2
    `${P2.x + DELTA},${P2.y} ` +
    `${P2.x},${P2.y} ` +
    `${P2.x - DELTA},${P2.y} ` +
    // mirroed P1
    `${-1 * P1.x},${P1.y + DELTA} ` +
    `${-1 * P1.x},${P1.y} ` +
    `${-1 * P1.x},${P1.y - DELTA} ` +
    // close the path
    `${P0.x},${P0.y} ${P0.x},${P0.y} Z`
}


interface FlowerLeafProps {
  color: string
  height: number
  width: number
  tooltip: ReactNode
  transform: string
}


const FlowerLeaf: FC<FlowerLeafProps> = (props) => {
  const {
    color,
    height,
    width,
    tooltip,
    transform,
  } = props

  return (
    <Tooltip
      title={tooltip}
      color={color}
    >
      <path
        d={leafShape({ width, height })}
        fill={color}
        transform={transform}
        data-html={true}
      />
    </Tooltip>
  )
}

FlowerLeaf.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  tooltip: PropTypes.object,
  transform: PropTypes.string,
}

FlowerLeaf.defaultProps = {
  color: '#000',
  height: 100,
  width: 70,
  tooltip: null,
  transform: '',
}


export default FlowerLeaf
