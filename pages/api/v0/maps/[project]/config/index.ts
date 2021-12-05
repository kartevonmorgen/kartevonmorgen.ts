import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

import MapPageConfigs from '../../../../../../dtos/MapPageConfigs'


const getPath = (project: string = 'main'): string => {
  return `./public/projects/${project}/config.json`
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

  // todo: eighter move it to env or consts
  // todo: catch the error if the file is not found

  let fileContent: string = ''
  try {
    fileContent = fs.readFileSync(
      path.resolve(getPath(project as string)),
      'utf8',
    )
  } catch (e) {
    fileContent = fs.readFileSync(
      path.resolve(getPath()),
      'utf8',
    )
  }
  const mapPageConfigs: MapPageConfigs = JSON.parse(fileContent.toString())

  res
    .status(200)
    .json(mapPageConfigs)
}
