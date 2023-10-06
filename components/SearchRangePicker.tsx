import { Dispatch, FC, useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import moment, { Moment } from 'moment'
import toString from 'lodash/toString'
import DatePicker from './DatePicker'
import { getEventTimeBoundariesFromRouter } from '../utils/router'
import { removeRoutingQueryParams, updateRoutingQuery } from '../utils/utils'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'


const { RangePicker } = DatePicker

// startMin, startMax
type FilterDateRange = [Moment | null, Moment | null]

enum TimeBoundariesParams {
  START_MIN = 'start_min',
  START_MAX = 'start_max',
  END_MIN = 'end_min',
}


const setRangeToRouterAndState = (router: NextRouter, setRange: Dispatch<FilterDateRange>) => (range: FilterDateRange | null) => {

  const { query } = router

  let endMin: Moment | null = null
  let startMax: Moment | null = null
  if (range !== null) {
    endMin = range[0]
    startMax = range[1]
  }

  setRange([endMin, startMax])

  let newQueryParams = query
  if (endMin) {
    newQueryParams = updateRoutingQuery(newQueryParams, { end_min: toString(endMin.unix()) })
  } else {
    newQueryParams = removeRoutingQueryParams(newQueryParams, [TimeBoundariesParams.END_MIN])
  }

  if (startMax) {
    newQueryParams = updateRoutingQuery(newQueryParams, { start_max: toString(startMax.unix()) })
  } else {
    newQueryParams = removeRoutingQueryParams(newQueryParams, [TimeBoundariesParams.START_MAX])
  }

  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}

const SearchRangePicker: FC = () => {
  const router = useRouter()

  const eventTimeBoundaries = getEventTimeBoundariesFromRouter(router)

  const { t } = useTranslation('map')

  const [range, setRange] = useState<FilterDateRange>([moment(), moment()])

  useEffect(() => {
    const { endMin, startMax } = eventTimeBoundaries

    let newEndMin: Moment | null = endMin || null
    let newStartMax: Moment | null = endMin || null

    setRange([newEndMin, newStartMax])
  }, [])

  return (
    <RangePicker
      allowEmpty={[true, true]}
      format="YYYY-MM-DD"
      style={{
        width: '100%',
        marginBottom: 8,
      }}
      placeholder={[t('entryForm.start'), t('entryForm.end')]}
      value={range}
      onCalendarChange={setRangeToRouterAndState(router, setRange)}
    />
  )
}


export default SearchRangePicker
