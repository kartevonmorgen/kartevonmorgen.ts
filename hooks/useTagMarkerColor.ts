import { useContext } from 'react'
import { TagMarkerColorsContext } from '../contexts'
import Tag from '../dtos/Tag'


const useTagMarkerColor = (tags: Tag[]): string => {
  const allTagMarkerColors = useContext(TagMarkerColorsContext)

  // If no colors available, return empty string
  if (!allTagMarkerColors || allTagMarkerColors.length === 0) {
    return ''
  }

  // Find the first matching color for the given tags
  // This replicates the logic from the API endpoint
  for (let i = 0; i < allTagMarkerColors.length; i++) {
    const { tag: currentTag, color } = allTagMarkerColors[i]

    for (let j = 0; j < tags.length; j++) {
      const targetTag = tags[j]

      if (currentTag === targetTag) {
        return color
      }
    }
  }

  return ''
}


export default useTagMarkerColor
