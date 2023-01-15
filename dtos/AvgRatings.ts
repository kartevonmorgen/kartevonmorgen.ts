import { RatingFactor } from './RatingFactor'


interface AvgRatings {
  total: number
  [RatingFactor.diversity]: number
  [RatingFactor.fairness]: number
  [RatingFactor.humanity]: number
  [RatingFactor.renewable]: number
  [RatingFactor.solidarity]: number
  [RatingFactor.transparency]: number
}

export const newAvgRatings = (): AvgRatings => (
  {
    total: 0,
    [RatingFactor.diversity]: 0,
    [RatingFactor.fairness]: 0,
    [RatingFactor.humanity]: 0,
    [RatingFactor.renewable]: 0,
    [RatingFactor.solidarity]: 0,
    [RatingFactor.transparency]: 0,
  }
)


export default AvgRatings