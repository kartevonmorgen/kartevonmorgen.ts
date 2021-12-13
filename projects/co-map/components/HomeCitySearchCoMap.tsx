import {AutoComplete, Input} from 'antd';
import {NextRouter, useRouter} from 'next/router';
import React, {useState} from 'react';
import {API_ENDPOINTS} from '../../../api/endpoints';
import useRequest from '../../../api/useRequest';
import {onAddEntity} from '../../../components/AddEntryButton';
import {GeoLocations} from '../../../dtos/GeoLocatoinResponse';

enum HoveredChooseTypes {
    Left = 1,
    Right = 2,
}

interface Option {
    label: string;
    value: string;
}

const BORDER_RADIUS_VAL = '32px';

const SearchInput = () => {
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

    const couldFetchGeoLocations: boolean = geoLocations && !geoLocationError;

    const onSelect = (router: NextRouter) => (value: string) => {
        const center: string = value;

        router.push(
            {
                pathname: '/m/co-map/main',
                query: {
                    c: center,
                    z: 10,
                },
            },
            undefined,
            {shallow: false},
        );
    };

    const convertGeoLocationsToOptions = (
        geoLocations: GeoLocations,
    ): Option[] => {
        const options: Option[] = geoLocations.map((geoLocation) => {
            const {lat, lon, display_name} = geoLocation;

            return {
                label: display_name,
                value: [lat, lon].join(),
            };
        });

        return options;
    };

    let options = [];
    if (couldFetchGeoLocations) {
        options = convertGeoLocationsToOptions(geoLocations);
    }

    return (
        <AutoComplete
            showArrow={false}
            filterOption={false}
            notFoundContent={null}
            dropdownMatchSelectWidth={600}
            options={options}
            onSelect={onSelect(router)}
            onSearch={setSearchTerm}
            style={{width: '100%'}}
        >
            <Input
                style={{
                    fontSize: '18px',
                    width: '316px',
                    backgroundColor: 'transparent',
                    border: '0',
                    borderBottom: '1px solid white',
                    color: 'white',
                }}
                placeholder="Введите адрес"
            />
        </AutoComplete>
    );
};

const HomeCitySearchCoMap = () => {
    const [hoveredChoose, setHoveredChoose] = useState(HoveredChooseTypes.Left);
    const [inputExpanded, setInputExpanded] = useState(false);

    const router = useRouter();

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                width: 'inherit',
            }}
        >
            <div
                style={{
                    width: '726px',
                    height: '64px',
                    backgroundColor: 'white',
                    position: 'relative',
                    borderRadius: BORDER_RADIUS_VAL,
                    border: '5px solid white',
                }}
            >
                {/* Bar, that shows active choose */}
                <div
                    style={{
                        width: inputExpanded ? '716px' : '395px',
                        height: '100%',
                        position: 'absolute',
                        top: '0',
                        right:
                            hoveredChoose === HoveredChooseTypes.Right ||
                            inputExpanded
                                ? '0px'
                                : '321px',
                        transition: '0.2s',
                        backgroundColor: '#AC3970',
                        borderRadius: BORDER_RADIUS_VAL,
                    }}
                />

                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        display: 'flex',
                    }}
                >
                    <div
                        onMouseEnter={() => {
                            setHoveredChoose(HoveredChooseTypes.Left);
                        }}
                        onClick={() => {
                            setInputExpanded(!inputExpanded);
                        }}
                        style={{
                            fontSize: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width:
                                hoveredChoose === HoveredChooseTypes.Left &&
                                !inputExpanded
                                    ? '395px'
                                    : '325px',
                            height: '100%',
                            justifyContent: 'center',
                            color:
                                hoveredChoose === HoveredChooseTypes.Left
                                    ? 'white'
                                    : 'black',
                            transition: '0.2s',
                        }}
                    >
                        <span>Найти точку</span>
                    </div>

                    {!inputExpanded ? (
                        <div
                            onClick={onAddEntity(router, true)}
                            onMouseEnter={() => {
                                setHoveredChoose(HoveredChooseTypes.Right);
                            }}
                            style={{
                                fontSize: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width:
                                    hoveredChoose === HoveredChooseTypes.Right
                                        ? '395px'
                                        : '325px',
                                height: '100%',
                                justifyContent: 'center',
                                color:
                                    hoveredChoose === HoveredChooseTypes.Right
                                        ? 'white'
                                        : 'black',
                                transition: '0.2s',
                            }}
                        >
                            <span>Добавить точку</span>
                        </div>
                    ) : (
                        <div
                            style={{
                                width: '395px',
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <SearchInput />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeCitySearchCoMap;
