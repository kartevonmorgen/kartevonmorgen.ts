import React, {FC, useEffect, useState} from 'react';
import {NextRouter, useRouter} from 'next/router';
import {Select} from 'antd';
import debounce from 'lodash/debounce';
import API_ENDPOINTS from '../../../api/endpoints';
import {GeoLocations} from '../../../dtos/GeoLocatoinResponse';
import useRequest from '../../../api/useRequest';
import ShowMapButton from './ShowMapButton';

const {Option} = Select;

const onSelect = (router: NextRouter) => (value: string) => {
    const center: string = value;

    router.push(
        {
            pathname: '/m/co-map',
            query: {
                c: center,
                z: 10,
            },
        },
        undefined,
        {shallow: false},
    );
};

const showMapByClickOnButton = (router: NextRouter) => () => {
    router.push('/m/co-map');
};

const HomeCitySearchCoMap: FC = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState<string>('');

    const {data: geoLocations, error: geoLocationError} =
        useRequest<GeoLocations>({
            url: API_ENDPOINTS.queryGeoLocations(),
            params: {
                q: searchTerm,
                format: 'json',
                limit: 10,
            },
        });

    const [showMapButton, setShowMapButton] = useState<boolean>(false);

    useEffect(() => {
        if (searchTerm.length > 0 && geoLocations?.length === 0) {
            setShowMapButton(true);
        }
        if (searchTerm.length === 0 || geoLocations?.length > 0) {
            setShowMapButton(false);
        }
    }, [geoLocations]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
            }}
        >
            <Select
                showSearch
                showArrow={false}
                filterOption={false}
                notFoundContent={null}
                dropdownMatchSelectWidth={252}
                style={{width: 250, textAlign: 'left'}}
                onSelect={onSelect(router)}
                onSearch={debounce(setSearchTerm, 400)}
                placeholder={'где будем искать?'}
                size="large"
            >
                {geoLocations &&
                    !geoLocationError &&
                    geoLocations.map(({lat, lon, display_name, place_id}) => (
                        <Option
                            key={`geoLocationOption-${place_id}`}
                            value={[lat, lon].join()}
                        >
                            {display_name}
                        </Option>
                    ))}
            </Select>
            <div>
                {showMapButton && (
                    <ShowMapButton
                        placeholder={'Показать карту...'}
                        showMapByClickOnButton={showMapByClickOnButton(router)}
                    />
                )}
            </div>
        </div>
    );
};

export default HomeCitySearchCoMap;
