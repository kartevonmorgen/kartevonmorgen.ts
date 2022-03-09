export enum RatingFactor {
  diversity = 'diversity',
  fairness = 'fairness',
  humanity = 'humanity',
  renewable = 'renewable',
  solidarity = 'solidarity',
  transparency = 'transparency',
}

export const RatingFactorOrder: RatingFactor[] = [
  RatingFactor.diversity,
  RatingFactor.renewable,
  RatingFactor.fairness,
  RatingFactor.humanity,
  RatingFactor.solidarity,
  RatingFactor.transparency
]