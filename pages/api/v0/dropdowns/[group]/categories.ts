import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'
import parseCSV from 'csv-parse/lib/sync'
import { CategorySelectOption, CategorySelectOptions } from '../../../../../dtos/CategorySelectOption'
import { convertUnknownToBoolean, convertUnknownToInt } from '../../../../../utils/utils'


interface Response {
  data: CategorySelectOptions
  hasData: boolean
}


const convertCSVRecordToCategorySelectOption = (record: any): CategorySelectOption => {
  return ({
    label: record.label,
    value: record.value,
    headline: convertUnknownToBoolean(record.headline),
    icon: record.icon,
    fontSize: convertUnknownToInt(record.fontSize),
    bold: convertUnknownToBoolean(record.bold),
    italic: convertUnknownToBoolean(record.italic),
    underline: convertUnknownToBoolean(record.underline),
  })
}


const convertParsedCategoriesCSVToCategorySelectOptions = (records: any[]): CategorySelectOptions => {
  const categorySelectOptions: CategorySelectOptions = []

  records.forEach(record => {
    const newCategorySelectOption = convertCSVRecordToCategorySelectOption(record)
    categorySelectOptions.push(newCategorySelectOption)
  })

  return categorySelectOptions
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

    const categorySelectOptions: CategorySelectOptions = convertParsedCategoriesCSVToCategorySelectOptions(records)
    response.data = categorySelectOptions
    response.hasData = true

  } catch (e) {

  }

  res
    .status(200)
    .json(response)

}