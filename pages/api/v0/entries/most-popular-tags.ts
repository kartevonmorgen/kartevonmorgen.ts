import { NextApiRequest, NextApiResponse } from 'next'
import getMostPopularTags, { QueryMostPopularTagsParams } from '../../../../db/queries/get-most-popular-tags'
import toNumber from 'lodash/toNumber'
import toString from 'lodash/toString'
import { TagFrequency } from '../../../../dtos/TagFrequency'


export interface MostPopularTagsParams {
  limit?: number
  offset?: number
  contains?: string
}

const DEFAULT_PARAMS: MostPopularTagsParams = {
  limit: 10,
  offset: 0,
  contains: '',
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: {
      limit = DEFAULT_PARAMS.limit,
      offset = DEFAULT_PARAMS.offset,
      contains = DEFAULT_PARAMS.contains,
    },
    method,
  } = req

  // only GET is allowed
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)

    return
  }

  const queryParams: QueryMostPopularTagsParams = {
    limit: toNumber(limit),
    offset: toNumber(offset),
    contains: toString(contains),
  }

  try {
    const matchedMostPopularTagsWithFrequency: TagFrequency[] = await getMostPopularTags(queryParams)
    res.status(200).json(matchedMostPopularTagsWithFrequency)
  } catch (e) {
    res.status(500)
  }
}
