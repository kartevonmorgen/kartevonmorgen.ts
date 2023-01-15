import { FC, Fragment, ReactElement } from 'react'
import isString from 'lodash/isString'
import moment, { Moment } from 'moment'
import opening_hours from 'opening_hours'
import { Col, Divider, List, Row, Typography } from 'antd'


const { Text } = Typography


type Interval = [Moment, Moment, boolean, string]
type Intervals = Interval[]

interface DayRecord {
  idx: number
  name: string,
  intervals: Intervals
}

type Calendar = DayRecord[]


const isParsable = (openingHours: string): boolean => {
  try {
    new opening_hours(openingHours)
  } catch (e) {
    return false
  }

  return true
}

const isValid = (openingHours: string): boolean => {
  if (!isParsable(openingHours) && !isString(openingHours)) {
    return false
  }

  return true
}

const getCalendar = (openingHours: string): Calendar => {
  const oh = new opening_hours(openingHours)

  const localeWeekDays = moment.weekdays(true)
  const calendar: Calendar = moment
    .weekdays(false)
    .map((day) => ({ idx: localeWeekDays.indexOf(day), name: day, intervals: [] }))

  const startOfWeek = moment().startOf('week').toDate()
  const endOfWeek = moment().endOf('week').toDate()

  // the intervals returned are chunked by continues intervals ->
  // -> an interval may began from the prev day to its day after when converting to local locale
  // hence we should break it to fit in a local day
  const intervals = oh.getOpenIntervals(startOfWeek, endOfWeek)
  for (let i = 0; i !== intervals.length; i++) {
    const [start, end, unknown, comment] = intervals[i]
    const startMoment = moment(start).local()
    const endMoment = moment(end).local()

    if (startMoment.isSame(endMoment, 'day')) {
      calendar[startMoment.day()]
        .intervals
        .push([startMoment, endMoment, unknown, comment])
    } else {
      // we are in the situation of a long continues interval like 24/7
      // from end of today
      calendar[startMoment.day()]
        .intervals
        .push([
          startMoment,
          startMoment.clone().set({ hour: 23, minute: 59 }),
          unknown,
          comment,
        ])

      // if there are days between start and end consider them
      const middleDayMoment = startMoment
        .clone()
        .set({ hour: 0, minute: 0 })
        .add(1, 'day')

      while (
        middleDayMoment.isBefore(endMoment, 'day')
        ) {
        calendar[middleDayMoment.day()]
          .intervals
          .push([
            middleDayMoment.clone(),
            middleDayMoment.clone().set({ hour: 23, minute: 59 }),
            unknown,
            comment,
          ])

        middleDayMoment.add(1, 'day')
      }

      // continues from the midnight of the tomorrow
      // if it's not on the next week
      if (endMoment.day() !== 0) {
        calendar[endMoment.day()]
          .intervals
          .push([
            middleDayMoment,
            endMoment,
            unknown,
            comment,
          ])
      }
    }
  }

  return calendar
}

const convertIntervalsToReadableString = (intervals: Intervals): string => {
  let s = ''
  intervals.map(([start, end, unknown, comment], i) => {
    if (i !== 0) {
      s += ', '
    }

    if (unknown) {
      s += 'maybe '
    }

    s += `${start.format('H:mm')} - ${end.format('H:mm')}`

    if (comment) {
      s += ` ${comment}`
    }
  })

  return s
}


const renderDayRecord = (dayRecord: DayRecord): ReactElement => {
  const readableString: string = convertIntervalsToReadableString(dayRecord.intervals)

  return (
    <List.Item>
      <Row
        gutter={16}
        style={{
          width: '100%',
        }}
      >
        <Col
          xs={12}
          sm={8}
          md={6}
          lg={8}
          xl={6}
        >
          {dayRecord.name}
        </Col>

        <Col>
          {readableString}
        </Col>
      </Row>
    </List.Item>
  )
}


const renderCalendar = (openingHours: string): ReactElement => {
  const calendar = getCalendar(openingHours)
  calendar.sort((day1, day2) => day1.idx - day2.idx)

  return (
    <List
      size="small"
      dataSource={calendar}
      renderItem={renderDayRecord}
    />
  )
}


interface OpeningHoursProps {
  openingHours?: string
}

const OpeningHours: FC<OpeningHoursProps> = (props) => {
  const { openingHours } = props

  if (
    !openingHours ||
    !isValid(openingHours)
  ) {
    return null
  }

  return (
    <Fragment>
      <Divider>Opening Hours</Divider>

      {
        isParsable(openingHours) ?
          renderCalendar(openingHours) :
          <Text>{openingHours}</Text>
      }

    </Fragment>
  )
}


export default OpeningHours
