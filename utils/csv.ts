import { convertUnknownToBoolean, convertUnknownToInt } from './utils'
import { OptionData, OptionGroupData } from 'rc-select/lib/interface'
import { BucketsOfSelectOptions, SelectOption, SelectOptions } from '../dtos/SelectOption'


export interface CSVToOptionDataResponse {
  data: (OptionData | OptionGroupData)[]
  hasData: boolean
}

export type CSVRecord = any
export type CSVRecords = CSVRecord[]

export type CSVRecordToCustomSelectOptionConverter = (record: CSVRecord) => SelectOption


// todo: the purpose was to make it generic but got in the trap of syntax
const convertCSVRecordToCustomSelectOption: CSVRecordToCustomSelectOptionConverter = (record: CSVRecord): SelectOption => {
  return ({
    label: record.label,
    value: record.value,
    fontSize: convertUnknownToInt(record.fontSize),
    bold: convertUnknownToBoolean(record.bold),
    italic: convertUnknownToBoolean(record.italic),
    underline: convertUnknownToBoolean(record.underline),
  })
}

const groupRecordsByHeadlinesAndConvertToSelectOption = (
  records: CSVRecords,
  convertCSVRecordToCustomSelectOption: CSVRecordToCustomSelectOptionConverter,
): BucketsOfSelectOptions => {
  const bucketsOfRecords: BucketsOfSelectOptions = [
    ['', []],
  ]

  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    const isHeadline = convertUnknownToBoolean(record.headline)

    if (isHeadline) {
      const options: SelectOptions = []
      const headline: string = record.label
      i++

      for (; i !== records.length; i++) {
        const possibleSubRecord = records[i]
        const isPossibleSubRecordHeadline = convertUnknownToBoolean(possibleSubRecord.headline)
        if (isPossibleSubRecordHeadline) {
          i--
          break
        }

        options.push(convertCSVRecordToCustomSelectOption(possibleSubRecord))
      }

      bucketsOfRecords.push([headline, options])
      continue
    }

    bucketsOfRecords[0][1].push(convertCSVRecordToCustomSelectOption(record))
  }

  return bucketsOfRecords
}

const convertSelectOptionToOptionData = (selectOption: SelectOption): OptionData => {
  const optionData: OptionData = {
    label: selectOption.label,
    value: selectOption.value,
    style: {
      fontWeight: selectOption.bold ? 'bold' : 'normal',
      fontStyle: selectOption.italic ? 'italic' : 'normal',
      textDecoration: selectOption.underline ? 'underline' : 'none',
      fontSize: selectOption.fontSize ? convertUnknownToInt(selectOption.fontSize) : undefined,
    },
  }

  return optionData
}


const convertBucketsOfSelectOptionsToOptionDataOrOptionGroupData = (
  bucketsOfSelectOptions: BucketsOfSelectOptions,
): (OptionData | OptionGroupData)[] => {

  let optionData: (OptionData | OptionGroupData)[] = []

  if (bucketsOfSelectOptions.length !== 0 && bucketsOfSelectOptions[0][0] === '') {
    optionData = bucketsOfSelectOptions[0][1].map(selectOption => convertSelectOptionToOptionData(selectOption))
  }

  for (let i = 1; i < bucketsOfSelectOptions.length; i++) {
    const [header, subSelectOptions] = bucketsOfSelectOptions[i]
    optionData.push({
      label: header,
      options: subSelectOptions.map(selectOption => convertSelectOptionToOptionData(selectOption)),
    })
  }

  return optionData
}


export const convertNotEmptyCSVRecordsToSelectOptionsAndGroupByHeader = (
  records: CSVRecords,
): (OptionData | OptionGroupData)[] => {

  const filteredRecords: CSVRecords = records.filter(record => record.label !== '')

  const groupedCategorySelectOptions: BucketsOfSelectOptions = groupRecordsByHeadlinesAndConvertToSelectOption(
    filteredRecords,
    convertCSVRecordToCustomSelectOption,
  )

  const optionData = convertBucketsOfSelectOptionsToOptionDataOrOptionGroupData(groupedCategorySelectOptions)

  return optionData
}