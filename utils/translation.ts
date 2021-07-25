export const mapRatingValueToTranslationKey = (value: number): string => {
  switch (value) {
    case -1:
      return 'minusOne'
    case 0:
      return 'zero'
    case 1:
      return 'one'
    case 2:
      return 'two'
    default:
      return 'invalidRatingValue'
  }
}