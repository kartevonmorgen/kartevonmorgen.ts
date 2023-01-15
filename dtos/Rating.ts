import { RatingComments } from './RatingComment'
import { RatingFactor } from './RatingFactor'


export type RatingID = string


export interface Rating {
  id: RatingID
  title: string
  created: number
  value: number
  context: RatingFactor
  source: string
  comments: RatingComments
}