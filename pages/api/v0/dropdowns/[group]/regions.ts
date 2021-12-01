import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'
import parseCSV from 'csv-parse/lib/sync'
import {
  convertNotEmptyCSVRecordsToSelectOptionsAndGroupByHeader,
  CSVToOptionDataResponse,
} from '../../../../../utils/csv'


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


  const response: CSVToOptionDataResponse = {
    data: [],
    hasData: false,
  }

  let fileContent: string = JSON.stringify([])
  try {
    fileContent = fs.readFileSync(
      path.resolve(`./public/projects/${group}/dropdowns/regions.csv`),
      'utf8',
    )

    response.hasData = true

    const records = parseCSV(
      fileContent, {
        columns: true,
        skip_empty_lines: true,
      },
    )


    const optionData = convertNotEmptyCSVRecordsToSelectOptionsAndGroupByHeader(records)

    response.data = optionData
    response.hasData = true
  } catch (e) {

  }

  res
    .status(200)
    .json(response)
}
