interface Ratings {
  total: number
  diversity: number
  fairness: number
  humanity: number
  renewable: number
  solidarity: number
  transparency: number
}

export const newRatings = (): Ratings => (
  {
    total: 0,
    diversity: 0,
    fairness: 0,
    humanity: 0,
    renewable: 0,
    solidarity: 0,
    transparency: 0,
  }
)


export default Ratings