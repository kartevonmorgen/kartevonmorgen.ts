import { Moment } from 'moment'


export interface Duration {
  start: Moment
  end: Moment
}

export const isValidDuration = (duration: Duration) => {
  const { start, end } = duration

  return start.isValid() && end.isValid()
}

export const formatDuration = (duration: Duration): string => {

  const { start, end } = duration

  const areStartAndEndInTheSameDay = end.isSame(start, 'day')

  const startPart: string = start.utc().format('llll')
  const endPart: string = areStartAndEndInTheSameDay ?
    end.utc().format('LT') :
    end.utc().format('llll')


  return `${startPart} - ${endPart}`

}