import fs from 'fs'
import path from 'path'

import MapPageConfigs from '../../../../maps/types'


export default (req, res) => {
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
  const fileContent = fs.readFileSync(
    path.resolve(`./public/projects/${project}/config.json`),
    'utf8'
  )
  const mapPageConfigs: MapPageConfigs = JSON.parse(fileContent.toString())

  res.statusCode = 200
  res.json(mapPageConfigs)
}