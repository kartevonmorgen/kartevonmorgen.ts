import React, { FC, Fragment, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import lodashIsEqual from 'lodash/isEqual'
import { convertQueryParamToArray } from '../utils/utils'
import TagsSelect from './TagsSelect'
import { addTagToRouter, removeAllTagsFromRouter, removeTagFromRouter } from '../utils/router'
import useTranslation from 'next-translate/useTranslation'


const SearchTags: FC = (_props) => {
  const router = useRouter()
  const {
    query: {
      tag: tagQueryParam,
    },
  } = router

  const {t} = useTranslation('map');
  
  const tagsFromURL: string[] = convertQueryParamToArray(tagQueryParam)


  // the ant select uses useLayout internally and we need to be sure it's mounted on the browser
  const [showSelect, setShowSelect] = useState<boolean>(false)
  useEffect(() => {
    setShowSelect(true)
  }, [])

  const [selectedTags, setSelectedTags] = useState<string[]>([''])
  const selectedTagsRef = useRef<string[]>([''])
  useEffect(() => {
    if (!lodashIsEqual(selectedTagsRef.current, tagsFromURL)) {
      selectedTagsRef.current = tagsFromURL
      setSelectedTags(tagsFromURL)
    }
  }, [tagsFromURL])


  return (
      <Fragment>
          {showSelect && (
              <div
                  style={{
                      marginTop: 8,
                  }}
              >
                  <TagsSelect
                      placeholder={
                          t('searchForTagsPlaceholder') || 'Search for tags'
                      }
                      value={selectedTags}
                      onSelect={addTagToRouter(router)}
                      onDeselect={removeTagFromRouter(router)}
                      onClear={removeAllTagsFromRouter(router)}
                  />
              </div>
          )}
      </Fragment>
  );
}

SearchTags.defaultProps = {
  optionsCount: [],
}

export default SearchTags
