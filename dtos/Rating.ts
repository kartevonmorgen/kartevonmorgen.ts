import { RatingComments } from './RatingComment'


export type RatingID = string


export interface Rating {
  id: RatingID
  title: string
  created: number
  value: number
  context: string
  source: string
  comments: RatingComments
}