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


export const CategoryColorsSchema = z.object({
  initiative: z.string().default('#a4c93e'),
  company: z.string().default('#31a1b6'),
  event: z.string().default('#eb80a9'),
})

export type CategoryColors = z.infer<typeof CategoryColorsSchema>


export const ThemeConfigsSchema = z.object({
  categoryColors: CategoryColorsSchema,
})

export type ThemeConfigs = z.infer<typeof ThemeConfigsSchema>


export const MapPageConfigsSchema = z.object({
  map: MapConfigsSchema,
  popularTags: PopularTagsRequestSchema,
  sidebar: SidebarConfigsSchema,
  theme: ThemeConfigsSchema.optional(),
})

// it's the same from the /public/[project]/config.json
type MapPageConfigs = z.infer<typeof MapPageConfigsSchema>

export default MapPageConfigs
