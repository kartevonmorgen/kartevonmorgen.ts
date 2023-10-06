import { Moment } from 'moment'


export interface Duration {
  start: Moment
  end: Moment
}

export const isValidDuration = (duration?: Duration) => {
  if (!duration) {
    return false
  }

  const { start, end } = duration

  return start.isValid() && end.isValid()
}

export const formatDuration = (duration: Duration): string => {
  const { start, end } = duration

  const areStartAndEndInTheSameDay = end.isSame(start, 'day')

  const startPart: string = start.format('llll')
  const endPart: string = areStartAndEndInTheSameDay ?
    end.format('LT') :
    end.format('llll')


  return `${startPart} - ${endPart}`

}
