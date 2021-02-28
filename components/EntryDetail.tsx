import { FC } from 'react'
import { useBoolean } from 'ahooks'
import { getSlugActionFromQuery } from '../utils/slug'
import { useRouter } from 'next/router'


const EntryDetail: FC = () => {
  const router = useRouter()
  const { query } = router

  const [
    isLoading,
    {
      toggle: toggleLoading,
      setTrue: startLoading,
      setFalse: stopLoading,
    },
  ] = useBoolean()

  const slugAction = getSlugActionFromQuery(query)
  const { id: entryId } = slugAction

  return null
}

export default EntryDetail