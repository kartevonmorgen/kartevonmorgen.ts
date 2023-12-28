import moment, { Moment } from 'moment'
import EventDTO from '../dtos/Event'
import {
  addPropertiesWithNewName,
  propertyArray,
  removeProperties,
  TransformerWithNewNameRuleSet,
} from '../utils/objects'
import {FORMS as FORMS_CONSTANT} from '../consts/forms'


// todo: should create a type for the form initialValue, any is not the best option
export const onReceiveAdapter = (event?: EventDTO): Record<string, any> | EventDTO => {
  if (!event) {
    return {} as Record<string, any>
  }

  // the start and end should get converted
  const ruleSetsToAddNewProperties: TransformerWithNewNameRuleSet = {
    duration: {
      transformer: (originalValue, originalObject: EventDTO) => {
        let start: Moment | undefined = moment.unix(originalObject.start)
        if (!originalObject.start) {
          start = undefined
        }

        let end: Moment | undefined = moment.unix(originalObject.end)
        if (!originalObject.end) {
          end = undefined
        }

        return [
          start,
          end,
        ]
      },
      originalPropertyName: undefined,
    },
  }

  const eventWithNewProperties = addPropertiesWithNewName(event, ruleSetsToAddNewProperties)

  const propertiesToRemove: propertyArray = ['start', 'end']
  const eventWithPrunedProperties = removeProperties(eventWithNewProperties, propertiesToRemove)

  return eventWithPrunedProperties
}


export const onSendAdapter = (formValues: object): EventDTO => {
  const ruleSetsToAddNewProperties: TransformerWithNewNameRuleSet = {
    start: {
      transformer: (originalValue?: [Moment, Moment]) => {
        if (!originalValue) {
          return undefined
        }
        if (!originalValue[0]) {
          return undefined
        }
        return originalValue[0].unix()
      },
      originalPropertyName: 'duration',
    },
    end: {
      transformer: (originalValue?: [Moment, Moment]) => {
        if (!originalValue) {
          return undefined
        }
        if (!originalValue[1]) {
          return undefined
        }
        return originalValue[1].unix()
      },
      originalPropertyName: 'duration',
    },
    created_by: {
      transformer: (originalValue: string) => !!originalValue ? originalValue : FORMS_CONSTANT.event.defaultEmail,
      originalPropertyName: 'email',
    },
  }

  const formValuesWithNewProperties = addPropertiesWithNewName(formValues, ruleSetsToAddNewProperties)

  const fieldsToRemove: propertyArray = ['duration']
  const formValuesWithPrunedFields = removeProperties(formValuesWithNewProperties, fieldsToRemove)

  return formValuesWithPrunedFields as EventDTO
}
