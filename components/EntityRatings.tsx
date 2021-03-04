import { FC } from 'react'
import Ratings from '../dtos/Ratings'
import { Rate } from 'antd'


const ratingsOrder = [
  'diversity',
  'fairness',
  'humanity',
  'renewable',
  'solidarity',
  'transparency',
  'total',
]


const EntityRatings: FC<Ratings> = (props) => {
  return (
    <div>
      {
        ratingsOrder.map((r) => (
          <Rate allowHalf disabled count={props[r]}/>
        ))
      }
    </div>
  )
}


export default EntityRatings