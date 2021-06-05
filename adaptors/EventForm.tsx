import moment, { Moment } from 'moment'
import EventDTO from '../dtos/Event'
import {
  addPropertiesWithNewName,
  propertyArray,
  removeProperties,
  TransformerWithNewNameRuleSet,
} from '../utils/objects'


// todo: should create a type for the form initialValue, any is not the best option
export const onReceiveAdapter = (event: EventDTO): object => {
  // the start and end should get converted
  const ruleSetsToAddNewProperties: TransformerWithNewNameRuleSet = {
    duration: {
      transformer: (originalValue, originalObject: EventDTO) => ([
        moment.unix(originalObject.start),
        moment.unix(originalObject.end),
      ]),
      originalPropertyName: null,
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
      transformer: (originalValue: [Moment, Moment]) => (originalValue[0].unix()),
      originalPropertyName: 'duration',
    },
    end: {
      transformer: (originalValue: [Moment, Moment]) => (originalValue[1].unix()),
      originalPropertyName: 'duration',
    },
    created_by: {
      transformer: (originalValue: string) => originalValue,
      originalPropertyName: 'email',
    },
  }

  const formValuesWithNewProperties = addPropertiesWithNewName(formValues, ruleSetsToAddNewProperties)

  const fieldsToRemove: propertyArray = ['duration']
  const formValuesWithPrunedFields = removeProperties(formValuesWithNewProperties, fieldsToRemove)

  return formValuesWithPrunedFields as EventDTO
}