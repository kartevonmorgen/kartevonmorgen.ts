import fs from 'fs'
import path from 'path'
import { LinkWithIcon } from '../../../../../../dtos/LinkWithIcon'


export default async (req, res) => {
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

  const fileContent = fs.readFileSync(
    path.resolve(`./public/projects/${project}/burger-menu.json`),
    'utf8',
  )

  const burgerMenuItems: LinkWithIcon[] = JSON.parse(fileContent.toString())
  res
    .status(200)
    .json(burgerMenuItems)
}