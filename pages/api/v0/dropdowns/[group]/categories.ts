import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'
import parseCSV from 'csv-parse/lib/sync'
import {
  BucketsOfSelectOptions,
  CategorySelectOption,
  CategorySelectOptions,
} from '../../../../../dtos/CategorySelectOption'
import { convertUnknownToBoolean, convertUnknownToInt } from '../../../../../utils/utils'
import { OptionData, OptionGroupData } from 'rc-select/lib/interface'


export interface Response {
  data: (OptionData | OptionGroupData)[]
  hasData: boolean
}

type Record = any
type Records = Record[]



const convertCSVRecordToCategorySelectOption = (record: Record): CategorySelectOption => {
  return ({
    label: record.label,
    value: record.value,
    icon: record.icon,
    fontSize: convertUnknownToInt(record.fontSize),
    bold: convertUnknownToBoolean(record.bold),
    italic: convertUnknownToBoolean(record.italic),
    underline: convertUnknownToBoolean(record.underline),
  })
}


const groupRecordsByHeadlinesAndConvertToSelectOption = (records: Records): BucketsOfSelectOptions => {
  const bucketsOfRecords: BucketsOfSelectOptions = [
    ['', []],
  ]

  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    const isHeadline = convertUnknownToBoolean(record.headline)

    if (isHeadline) {
      const options: CategorySelectOptions = []
      const headline: string = record.label
      i++

      for (; i !== records.length; i++) {
        const possibleSubRecord = records[i]
        const isPossibleSubRecordHeadline = convertUnknownToBoolean(possibleSubRecord.headline)
        if (isPossibleSubRecordHeadline) {
          // bucketsOfRecords.push([headline, options])
          i--
          break
        }

        options.push(convertCSVRecordToCategorySelectOption(possibleSubRecord))
      }

      bucketsOfRecords.push([headline, options])
      continue
    }

    bucketsOfRecords[0][1].push(convertCSVRecordToCategorySelectOption(record))
  }

  return bucketsOfRecords
}

const convertSelectOptionToOptionData = (selectOption: CategorySelectOption): OptionData => {
  const optionData: OptionData = {
    label: selectOption.label,
    value: selectOption.value,
    style: {
      fontWeight: selectOption.bold ? 'bold' : 'normal',
      fontStyle: selectOption.italic ? 'italic' : 'normal',
      textDecoration: selectOption.underline ? 'underline' : 'none',
    },
  }

  return optionData
}

const convertBucketsOfSelectOptionsToOptionDataOrOptionGroupData = (bucketsOfSelectOptions: BucketsOfSelectOptions): (OptionData | OptionGroupData)[] => {
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


export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: {
      group,
    },
    method,
  } = req

  // only GET is allowed
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)

    return
  }


  const response: Response = {
    data: [],
    hasData: false,
  }

  let fileContent: string = JSON.stringify([])
  try {
    fileContent = fs.readFileSync(
      path.resolve(`./public/dropdowns/${group}/categories.csv`),
      'utf8',
    )

    response.hasData = true

    const records = parseCSV(
      fileContent, {
        columns: true,
        skip_empty_lines: true,
      },
    )

    const filteredRecords: Records = records.filter(record => record.label !== '')
    const groupedCategorySelectOptions: BucketsOfSelectOptions = groupRecordsByHeadlinesAndConvertToSelectOption(filteredRecords)
    const optionData = convertBucketsOfSelectOptionsToOptionDataOrOptionGroupData(groupedCategorySelectOptions)

    response.data = optionData
    response.hasData = true

  } catch (e) {

  }

  res
    .status(200)
    .json(response)

}