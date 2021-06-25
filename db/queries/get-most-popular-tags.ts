import db from '../index'
import { TagFrequency } from '../../dtos/TagFrequency'


export interface GetMostPopularTagsParams {
  limit: number
  offset: number
  contains: string
}

export default async (params: GetMostPopularTagsParams): Promise<TagFrequency[]> => {
  const query = `SELECT tag, frequency FROM tag_frequency WHERE tag LIKE ? ORDER BY frequency DESC LIMIT ? OFFSET ? `
  const { contains, limit, offset } = params
  const queryParams = [`%${contains}%`, limit, offset]

  return new Promise<TagFrequency[]>((resolve, reject) => {
    db.all(
      query,
      queryParams,
      (err, records) => {
        if (err) {
          reject(err)

          return
        }

        resolve(records)
      },
    )
  })

}