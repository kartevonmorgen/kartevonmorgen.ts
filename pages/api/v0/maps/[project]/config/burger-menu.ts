import fs from 'fs'
import path from 'path'
import { LinkWithIcon } from '../../../../../../dtos/LinkWithIcon'


const getPath = (project: string = 'main'): string => {
  return `./public/projects/${project}/burger-menu.json`
}

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
  const burgerMenuItems: LinkWithIcon[] = JSON.parse(fileContent.toString())

  res
    .status(200)
    .json(burgerMenuItems)
}
