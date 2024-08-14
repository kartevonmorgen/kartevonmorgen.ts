import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import z from 'zod'


const TagIconSchema = z.object({
  tag: z.string(),
  icon: z.string(),
})

type TagIcon = z.infer<typeof TagIconSchema>

const TagsIconsSchema = z.array(TagIconSchema)
type TagsIcons = z.infer<typeof TagsIconsSchema>


export const getTagsIcons = (project: string): TagsIcons => {
  let records: TagsIcons = []
  try {
    const fileContent = fs.readFileSync(
      path.resolve(`./public/projects/${project}/pins/dynamic_icons.csv`),
      'utf8',
    )

    records = parse(
      fileContent, {
        columns: true,
        skip_empty_lines: true,
      },
    )

    const parseResult = TagsIconsSchema.safeParse(records)
    if (!parseResult.success) {
      console.error(`failed to parse tags icons for project ${project}`)
      return []
    }
  } catch (e) {
  }

  return records
}

export default getTagsIcons
