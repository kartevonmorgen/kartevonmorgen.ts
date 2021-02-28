import { RatingComments } from './RatingComment'


export interface Rating {
  id: string
  title: string
  created: number
  value: number
  context: string
  source: string
  comments: RatingComments
}