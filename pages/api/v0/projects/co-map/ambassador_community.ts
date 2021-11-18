import { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  let response = {
    'cities_count': '7',
    'ambassadors_count': '7',
  }

  res.status(200).json(response)
}