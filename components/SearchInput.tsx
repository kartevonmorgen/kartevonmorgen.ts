import { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import produce from 'immer'
import { AutoComplete, Input } from 'antd'
import { useDebounce } from 'ahooks'
import { convertQueryParamToString, updateRoutingQuery } from '../utils/utils'
import useSearchRecommender from '../hooks/useSearchRecommender'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'
import useTranslation from 'next-translate/useTranslation';

const {Search} = Input;

const onSearch = (router) => (searchTerm, _event) => {
  const { query } = router

  const searchURLParamKey = 'search'

  let newQueryParams = updateRoutingQuery(query, { [searchURLParamKey]: searchTerm })
  // it's an empty string so let's remove the param from the URL
  // because we have added that from the update so we are sure the key exists
  if (searchTerm.length === 0) {
    newQueryParams = produce(newQueryParams, (draftState) => {
      delete draftState[searchURLParamKey]
    })
  }

  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}


const SearchInput: FC = () => {
    const router = useRouter();
    const {query} = router;
    const {t} = useTranslation('map');

    const {dropdowns, search: searchQuery} = query;
    const searchTermFromURL: string = convertQueryParamToString(searchQuery);

    const categoryGroup = convertQueryParamToString(dropdowns, 'main');

    const [searchTerm, setSearchTerm] = useState<string>('');
    const debouncedTokenToSearch = useDebounce(searchTerm, {wait: 100});

    useEffect(() => {
        setSearchTerm(searchTermFromURL);
    }, []);

    const searchOptions = useSearchRecommender(
        debouncedTokenToSearch,
        categoryGroup,
    );

    return (
        <AutoComplete
            value={searchTerm}
            options={searchOptions}
            style={{
                width: '100%',
            }}
            onSearch={(term: string) => setSearchTerm(term)}
            onSelect={(value: string) => setSearchTerm(value)}
        >
            <Search
                placeholder={t('searchPlaceholder')}
                allowClear
                enterButton
                onSearch={onSearch(router)}
                className="primary-btn"
            />
        </AutoComplete>
    );
};

export default SearchInput
