import {FC, useState} from 'react';
import {useDebounce} from 'ahooks';
import {Select} from 'antd';
import useRegionRecommender from '../hooks/useRegionRecommender';
import {NextRouter, useRouter} from 'next/router';
import {
    convertQueryParamToString,
    convertStringToFloat,
    updateRoutingQuery,
} from '../utils/utils';
import {GeoLocations} from '../dtos/GeoLocatoinResponse';
import {AxiosInstance} from '../api';
import API_ENDPOINTS from '../api/endpoints';
import {createSlugPathFromQueryAndRemoveSlug} from '../utils/slug';
import {convertLatLngToString, LatLng} from '../utils/geolocation';

const fetchLocationFromRegionName = async (
    regionName: string,
): Promise<LatLng> => {
    // todo: catch error if the region api did not responded successfully
    const regionLookupResponse = await AxiosInstance.GetRequest<GeoLocations>(
        API_ENDPOINTS.queryGeoLocations(),
        {
            params: {
                limit: 1,
                q: regionName,
                format: 'json',
            },
        },
    );

    const regionLookup = AxiosInstance.GetSuccessData(regionLookupResponse);

    // could find a region with that name
    if (regionLookup.length === 0) {
        return Promise.reject('no matching region found');
    }

    const region = regionLookup[0];
    const regionLatLng: LatLng = {
        lat: convertStringToFloat(region.lat, 4),
        lng: convertStringToFloat(region.lon, 4),
    };

    return regionLatLng;
};

const changeLatAndLngFromRegionName =
    (router: NextRouter) => async (regionName: string) => {
        try {
            const regionCenter = await fetchLocationFromRegionName(regionName);

            const paramsToUpdate = {
                c: convertLatLngToString(regionCenter),
            };

            const {query} = router;
            const newQueryParams = updateRoutingQuery(query, paramsToUpdate);
            const [newPath, newQueryWithoutSlug] =
                createSlugPathFromQueryAndRemoveSlug(newQueryParams);

            router.replace(
                {
                    pathname: `/m/${newPath}`,
                    query: newQueryWithoutSlug,
                },
                undefined,
                {shallow: true},
            );
        } catch (e) {}
    };

const SearchRegion: FC = () => {
    const router = useRouter();
    const {query} = router;

    const {dropdowns} = query;
    const regionsGroup = convertQueryParamToString(dropdowns, 'main');

    const [regionNameToSearch, setRegionNameToSearch] = useState<string>('');
    const debouncedNameRegionToSearch = useDebounce(regionNameToSearch, {
        wait: 50,
    });

    const regionsOptions = useRegionRecommender(
        debouncedNameRegionToSearch,
        regionsGroup,
    );

    return (
        <Select
            allowClear
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            showSearch
            options={regionsOptions}
            onSearch={(term: string) => {
                setRegionNameToSearch(term);
            }}
            onSelect={changeLatAndLngFromRegionName(router)}
            onClear={() => {
                setRegionNameToSearch('');
            }}
            placeholder="Search for a region"
            style={{
                width: '100%',
                marginTop: 8,
            }}
        />
    );
};

export default SearchRegion;
