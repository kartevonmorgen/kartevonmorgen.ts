import { RootState } from '../slices'
import { createSelector } from '@reduxjs/toolkit'
import Event, { CompactEvent } from '../dtos/Event'
import Category from '../dtos/Categories'


const eventsSelector = (state: RootState) => (state.events)

// creates a view of entries to be shown on the map and the result list
export const compactEventsSelector = createSelector(
  eventsSelector,
  events => events.reduce(
    (compactEvents: CompactEvent[], event: Event) => {
      const compactEvent: CompactEvent = {
        id: event.id,
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        lat: event.lat,
        lng: event.lng,
        categories: [Category.EVENT],
        tags: event.tags,
      }

      compactEvents.push(compactEvent)

      return compactEvents
    }
    , [] as CompactEvent[]),
)


export default eventsSelector