import { FC } from 'react'
import AvgRatings from '../dtos/AvgRatings'
import { RatingFactor } from '../dtos/RatingFactor'
import FlowerLeafs from './FlowerLeafs'


interface FlowerProps {
  ratings: AvgRatings
  radius: number
  showTooltip: boolean
}


const Flower: FC<FlowerProps> = (props) => {
  const { radius, ratings, showTooltip } = props

  return (
    <div>
      <svg width={(radius + 2) * 2} height={(radius + 2) * 2}>
        <g transform={'translate(' + (radius + 2) + ',' + (radius + 2) + ')'}>
          <circle cx={0} cy={0} r={radius + 1} fill="#fff" stroke="#ccc" strokeWidth={0.5}/>
          <g>
            <FlowerLeafs
              radius={radius}
              ratings={ratings}
              showTooltip={showTooltip}
            />
          </g>
        </g>
      </svg>

    </div>
  )
}


Flower.defaultProps = {
  radius: 40,
  ratings: {
    [RatingFactor.diversity]: 0,
    [RatingFactor.fairness]: 0,
    [RatingFactor.humanity]: 0,
    [RatingFactor.renewable]: 0,
    [RatingFactor.solidarity]: 0,
    [RatingFactor.transparency]: 0,
    total: 0,
  },
  showTooltip: false,
}

export default Flower
