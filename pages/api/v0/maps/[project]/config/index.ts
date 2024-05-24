import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

import MapPageConfigs from '../../../../../../dtos/MapPageConfigs'
import { MapColorModes } from '../../../../../../components/MapColorStyle'


const getPath = (project: string = 'main'): string => {
  return `./public/projects/${project}/config.json`
}


export const parseConfigFile = (project: string = 'main'): MapPageConfigs => {
  let mapPageConfigs: MapPageConfigs = {
    "map": {
      "location": {
        "lat": 50.8129,
        "lng": 5.6030,
        "zoom": 6
      },
      "colorStyle": MapColorModes.GRAY
    },
    "popularTags": {
      "min_count": 2
    },
    "sidebar": {
      "title": "Kartevonmorgen"
    }
  }

  let fileContent: string = ''
  try {
    fileContent = fs.readFileSync(
      path.resolve(getPath(project as string)),
      'utf8',
    )
  } catch (e) {
    console.error('api map config: failed to read config file for project: ', project)
    console.error(e)
    try {
      console.log('api map config: trying to read default config file')
      fileContent = fs.readFileSync(
        path.resolve(getPath()),
      'utf8',
      )
    } catch (e) {
      console.error('api map config: failed to read default config file')
      console.error(e)
    }
  }

  try {
    mapPageConfigs = JSON.parse(fileContent.toString())
  } catch(e) {
    console.error('api map config: failed to parse config file')
    console.error(e)
  }
  
  console.log(mapPageConfigs)
  return mapPageConfigs
}


export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { project },
    method,
  } = req

  // only GET is allowed
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)

    return
  }

  
  const mapPageConfigs: MapPageConfigs = parseConfigFile(project as string)

  res
    .status(200)
    .json(mapPageConfigs)
}
