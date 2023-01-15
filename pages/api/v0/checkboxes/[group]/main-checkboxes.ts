import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'
import parseCSV from 'csv-parse/lib/sync'


export interface LabelValue {
  label: string
  value: string
}

export interface MainCheckboxesResponse {
  data: LabelValue[]
  hasData: boolean
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


  const response: MainCheckboxesResponse = {
    data: [],
    hasData: false,
  }

  let records: LabelValue[] = []
  try {
    const fileContent = fs.readFileSync(
      path.resolve(`./public/projects/${group}/checkboxes/main-checkboxes.csv`),
      'utf8',
    )

    records = parseCSV(
      fileContent, {
        columns: true,
        skip_empty_lines: true,
      },
    )
  } catch (e) {
    return res
      .status(200)
      .json(response)
  }

  response.hasData = true
  response.data = records

  return res
    .status(200)
    .json(response)
}
