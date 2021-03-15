import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import produce from 'immer'
import { PageHeader } from 'antd'
import { convertQueryParamToArray } from '../utils/utils'


const onBack = (router: NextRouter, backLevel: number) => () => {
  const { query } = router
  const newQueryParams = produce(query, draftState => {
    const { slug } = draftState
    const slugArray = convertQueryParamToArray(slug)

    slugArray.splice(slugArray.length - backLevel, backLevel)
    draftState.slug = slugArray
  })

  router.replace(
    {
      pathname: '/maps/[...slug]',
      query: newQueryParams,
    },
    undefined,
    { shallow: true },
  )
}


interface EntityFormHeaderProps {
  backLevel: number
}

const EntityFormHeader: FC<EntityFormHeaderProps> = (props) => {
  const { backLevel } = props

  const router = useRouter()

  return (
    <PageHeader
      title="Create an Entry"
      style={{
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 0,
        paddingBottom: 4,
      }}
      ghost={false}
      onBack={onBack(router, backLevel)}
    />
  )
}

EntityFormHeader.defaultProps = {
  backLevel: 2,
}


export default EntityFormHeader