import z from 'zod'


export const MapLocationPropsSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  zoom: z.number(),
})


type MapLocationProps = z.infer<typeof MapLocationPropsSchema>


export default MapLocationProps
