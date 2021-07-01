import { Moment } from 'moment'

export const formatDuration = (start: Moment, end: Moment): string => {
  const areStartAndEndInTheSameDay = end.isSame(start, 'day')

  const startPart: string = start.utc().format('llll')
  const endPart: string = areStartAndEndInTheSameDay ?
    end.utc().format('LT') :
    end.utc().format('llll')


  return `${startPart} - ${endPart}`

}