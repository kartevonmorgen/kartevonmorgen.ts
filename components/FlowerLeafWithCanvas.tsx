import { FC } from 'react'
import FlowerLeaf from './FlowerLeaf'
import { RatingFactor } from '../dtos/RatingFactor'
import { getRatingFactorColorOrDefaultColor } from './FlowerLeafs'


const LEAF_HEIGHT = 40


interface FlowerLeafWithCanvasProps {
  ratingFactor: RatingFactor
}

const FlowerLeafWithCanvas: FC<FlowerLeafWithCanvasProps> = (props) => {

  const { ratingFactor } = props

  const flowerColor = getRatingFactorColorOrDefaultColor(ratingFactor)

  return (
    <svg width={LEAF_HEIGHT} height={LEAF_HEIGHT}>
      <g transform={'translate(' + LEAF_HEIGHT / 2 + ',' + LEAF_HEIGHT + ')'}>
        <FlowerLeaf
          transform={'rotate(180)'}
          color={flowerColor}
          height={LEAF_HEIGHT}
          width={0.7 * LEAF_HEIGHT}/>
      </g>
    </svg>
  )
}


export default FlowerLeafWithCanvas