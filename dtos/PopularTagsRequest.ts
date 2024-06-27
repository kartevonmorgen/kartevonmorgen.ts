import z from 'zod'


export const PopularTagsRequestSchema = z.object({
  min_count: z.number().nullish(),
  max_count: z.number().nullish(),
  limit: z.number().nullish(),
  offset: z.number().nullish(),
})

type PopularTagsRequest = z.infer<typeof PopularTagsRequestSchema> 


export default PopularTagsRequest