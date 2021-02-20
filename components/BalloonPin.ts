import {FC} from 'react'
import {useRouter} from 'next/router'

import Category from '../dtos/Categories'


interface BalloonPinProps {
  type: Category
}

const BalloonPin: FC<BalloonPinProps> = (_props) => {
  const router = useRouter()
  const {query} = router
  const {project} = query

  return null
}