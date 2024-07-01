import z from 'zod'
import { MapColorModesEnums } from '../components/MapColorStyle'
import { PopularTagsRequestSchema } from './PopularTagsRequest'
import { MapLocationPropsSchema } from './MapLocationProps'


export const MapConfigsSchema = z.object({
  location: MapLocationPropsSchema,
  colorStyle: MapColorModesEnums,
})

export type MapConfigs = z.infer<typeof MapConfigsSchema>


export const SidebarConfigsSchema = z.object({
  title: z.string(),
})

export type SidebarConfigs = z.infer<typeof SidebarConfigsSchema>


export const MapPageConfigsSchema = z.object({
  map: MapConfigsSchema,
  popularTags: PopularTagsRequestSchema,
  sidebar: SidebarConfigsSchema,
})

// it's the same from the /public/[project]/config.json
type MapPageConfigs = z.infer<typeof MapPageConfigsSchema>

export default MapPageConfigs
