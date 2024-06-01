import { NextApiRequest, NextApiResponse } from 'next'
import version from 'consts/version'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Return the version
    res.status(200).json({ version })
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
