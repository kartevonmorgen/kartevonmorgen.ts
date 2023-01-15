import { OptionData, OptionGroupData } from 'rc-select/lib/interface'
import useTagMatcher from './useTagMatcher'
import { MostPopularTagsParams } from '../pages/api/v0/entries/most-popular-tags'
import { TagFrequency } from '../dtos/TagFrequency'
import useRequest from '../api/useRequest'
import API_ENDPOINTS from '../api/endpoints'
import { CSVToOptionDataResponse } from '../utils/csv'


type ResultOptions = (OptionData | OptionGroupData)[]

const convertTagFrequenciesToResultOptions = (tagFrequencies: TagFrequency[]): ResultOptions => {
  return tagFrequencies.map((tagFrequency) => ({
    label: tagFrequency.tag,
    value: tagFrequency.tag,
  }))
}


// todo: handle errors, what will happen if none of the apis response properly?
const useSearchRecommender = (
  term: string,
  categoryGroupName: string = 'main',
): ResultOptions => {

  const tokens = term.split(' ')
  const lastToken = tokens[tokens.length - 1]

  const { data: categoryResponse, error: categoryResponseError } = useRequest<CSVToOptionDataResponse>({
    url: API_ENDPOINTS.getCategories(categoryGroupName),
  })

  let resultOptionsForCategories: ResultOptions = []
  if (
    !categoryResponseError &&
    categoryResponse &&
    categoryResponse.hasData
  ) {
    resultOptionsForCategories = categoryResponse.data
  }

  const tagMatcherParams: MostPopularTagsParams = {
    contains: lastToken,
  }
  const { data: matchedTagsWithFrequency, error: tagMatcherError } = useTagMatcher(tagMatcherParams)

  let resultOptionsFromMatchedTags: ResultOptions = []
  if (matchedTagsWithFrequency && !tagMatcherError) {
    resultOptionsFromMatchedTags = convertTagFrequenciesToResultOptions(matchedTagsWithFrequency)
  }

  if (term.length === 0) {
    //  if !categories => matched tags
    //  else categories
    if (resultOptionsForCategories.length === 0) {
      return resultOptionsFromMatchedTags
    }

    return resultOptionsForCategories
  }

  if (term[term.length - 1] === ' ') {
    //  if !categories => matched tags
    //  else categories
    if (resultOptionsForCategories.length === 0) {
      return resultOptionsFromMatchedTags
    }

    return resultOptionsForCategories
  }

  // token is not empty and the last char is not space
  return resultOptionsFromMatchedTags
}


export default useSearchRecommender