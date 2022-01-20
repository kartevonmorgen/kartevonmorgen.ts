import React, {FC, useEffect, useState} from 'react';
import {NextRouter, useRouter} from 'next/router';
import Image from 'next/image'
import Link from 'next/link'
import {Select, Row, Col} from 'antd';
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
    
    const [pointTypesVisible, setPointTypesVisible] = useState<boolean>(false);
    const getPointTypesVisibilityClass = () => {
        return pointTypesVisible ? 'visible' : '';
    }

    const {data: geoLocations, error: geoLocationError} =
        useRequest<GeoLocations>({
            url: API_ENDPOINTS.queryGeoLocations(),
            params: {
                q: searchTerm,
                format: 'json',
                limit: 10,
            },
        });

    return (
        <Row justify={'center'}>
            {/* <Col span={24}> */}
                <div className={'city_search-comap'}>
                    <div className={'city_search-bar'}>
                        <Select
                            className={'city_search_bar-select'}
                            showSearch
                            showArrow={false}
                            filterOption={false}
                            notFoundContent={null}
                            dropdownMatchSelectWidth={252}
                            style={{textAlign: 'left'}}
                            onSelect={onSelect(router)}
                            onSearch={debounce(setSearchTerm, 400)}
                            placeholder={'Введите адрес'}
                            // size="large"
                        >
                            {geoLocations &&
                                !geoLocationError &&
                                geoLocations.map(({lat, lon, display_name, place_id}) =>
                            (
                                <Option
                                    key={`geoLocationOption-${place_id}`}
                                    value={[lat, lon].join()}
                                >
                                    {display_name}
                                </Option>
                            ))}
                        </Select>

                        <button className={'bg-pink'}
                            onClick={() => {
                                setPointTypesVisible(!pointTypesVisible);
                            }}
                        >
                            <Image
                                src={'/projects/co-map/assets/img/add_point.button.svg'}
                                width={'44px'}
                                height={'44px'}
                            />
                        </button>
                    </div>

                    <div className={`city_search-point_types_menu ${getPointTypesVisibilityClass()}`}>
                        <div className={'point_type'}>
                            <Link href={''}>Проект</Link>
                        </div>

                        <div className={'point_type'}>
                            <Link href={''}>Событие</Link>
                        </div>

                        <div className={'point_type'}>
                            <Link href={''}>Организация</Link>
                        </div>
                    </div>
                </div>
            {/* </Col> */}
        </Row>
    );
};

export default HomeCitySearchCoMap;