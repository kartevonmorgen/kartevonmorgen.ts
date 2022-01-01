import { FC, Fragment, ReactNode } from 'react'
import { Translate } from 'next-translate'
import { RatingFactor } from '../dtos/RatingFactor'
import { RatingFactorColors } from '../styles/main'
import FlowerLeaf from './FlowerLeaf'
import useTranslation from 'next-translate/useTranslation'
import AvgRatings from '../dtos/AvgRatings'


const ROTATION_INTERVAL_DEG = 360 / Object.keys(RatingFactor).length


const convertDegreeToRadian = (degree: number): number => {
  return degree * Math.PI / 180
}


interface TransformationParams {
  offset: number
  scale: number
  space: number
}

const getFlowerLeafTransformation = ({ offset, scale, space }: TransformationParams): string => {
  const deg = offset * ROTATION_INTERVAL_DEG

  return `translate(${space * Math.cos(convertDegreeToRadian(deg))},${space * Math.sin(convertDegreeToRadian(deg))}) \
      rotate(${deg - 90}) \
      scale(${scale})`
}


const getFlowerLeafTooltip = (ratingFactor: string, t: Translate): ReactNode => {
  const factor = t('ratings.contextName.' + ratingFactor)
  const description = t('ratings.contextExplanation.' + ratingFactor)

  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      <h3>{factor}</h3>
      <p>{description}</p>
    </div>
  )
}


export const getRatingFactorColorOrDefaultColor = (factor: RatingFactor) => {
  return RatingFactorColors[factor]
}

const getRatingFactorColorOrDefaultColorBasedOnRating = (factor: RatingFactor, rating: number = 0) => {
  if (rating === 0) {
    return RatingFactorColors.default
  }


  const ratingFactorColor = getRatingFactorColorOrDefaultColor(factor)

  return ratingFactorColor
}

const getScale = (rating: number): number => {
  // the range of ratings is between -1 and 2, and we need to scale that between 0.5 to 1
  // the 0.5 is the minimum size for a leaf
  const [fromLowerBound, fromUpperBound] = [-1, 2]
  const [toLowerBound, toUpperBound] = [0.5, 1]

  const sourceInterval = fromUpperBound - fromLowerBound
  const destinationInterval = toUpperBound - toLowerBound

  return (((rating - fromLowerBound) / sourceInterval) * (destinationInterval)) + toLowerBound
}


interface FlowerLeafsProps {
  showTooltip: boolean
  radius: number
  ratings: AvgRatings
}

const FlowerLeafs: FC<FlowerLeafsProps> = (props) => {
  const { showTooltip, radius, ratings } = props

  const size = radius * 2
  const space = size * 0.03
  const height = (size / 2) - space
  const width = 0.7 * height

  const { t } = useTranslation('map')

  return (
    <Fragment>
      {
        Object.keys(RatingFactor).map((ratingFactor: RatingFactor, i: number) => {
          const flowerLeafTooltip: ReactNode = showTooltip ? getFlowerLeafTooltip(ratingFactor, t) : null
          const rating: number = ratings[ratingFactor]
          const flowerLeafScale: number = getScale(rating)

          return (
            <FlowerLeaf
              key={`flower-leaf-${ratingFactor}`}
              tooltip={flowerLeafTooltip}
              width={width}
              height={height}
              color={getRatingFactorColorOrDefaultColorBasedOnRating(ratingFactor, rating)}
              transform={
                getFlowerLeafTransformation({
                  offset: i,
                  space,
                  scale: flowerLeafScale,
                })
              }
            />
          )
        })
      }

    </Fragment>
  )
}


FlowerLeafs.defaultProps = {
  showTooltip: false,
}


export default FlowerLeafs
