import {NextApiRequest, NextApiResponse} from 'next'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { convertQueryParamToArray } from '../../../../../../../utils/utils'
import { TagMarkerColor, TagMarkerColors } from '../../../../../../../dtos/TagMarkerColors'



const getPath = (project: string = 'main'): string => {
  return `./public/projects/${project}/pins/dynamic_colors.csv`
}


const getMatchingColor = (customTagMarkerColors: TagMarkerColors, tags: string[]): TagMarkerColor | null => {
  for (let i = 0; i !== customTagMarkerColors.length; i++) {
    const { tag: currentTag, color } = customTagMarkerColors[i]

    for (let j = 0; j !== tags.length; j++) {
      const targetTag = tags[j]

      if (currentTag === targetTag) {
        return {
          tag: currentTag,
          color
        }
      }
    }
  }

  return null
}


export interface TagMarkerColorResponse {
  data: TagMarkerColors | TagMarkerColor
  hasData: boolean
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { project, tags: tagsParam },
    method,
  } = req

  const tags = convertQueryParamToArray(tagsParam)


  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)

    return
  }

  const response: TagMarkerColorResponse = {
    hasData: false,
    data: [],
  }

  try {
    const fileContent = fs.readFileSync(
      path.resolve(getPath(project as string)),
      'utf8',
    )

    const tagMarkerColor: TagMarkerColors = parse(
      fileContent, {
        columns: true,
        skip_empty_lines: true,
      },
    )

    // nothing is wrong, just the csv file is empty
    if (tagMarkerColor.length === 0) {
      res.status(200).json(response)
      return
    }


    // return all tag marker colors
    if (tags.length === 0) {
      response.hasData = true
      response.data = tagMarkerColor
      res.status(200).json(response)
      return
    }

    // try to return the first matching
    const matchedTagMarkerColor = getMatchingColor(tagMarkerColor, tags)
    if (!matchedTagMarkerColor) {
      res.status(200).json(response)
      return
    }

    response.hasData = true
    response.data = matchedTagMarkerColor

    // could not parse the csv for any reasons
  } catch (e) {
    res.status(500)
    return
  }

  // return the first matching tak marker color
  res.status(200).json(response)
}
