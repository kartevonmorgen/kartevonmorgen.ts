import React, {FC} from 'react';
import AmbassadorCommunity from '../projects/co-map/components/AmbassadorCommunity';
import AmbassadorForm from '../projects/co-map/components/AmbassadorForm';
import HomeHeaderCoMap from '../projects/co-map/components/HomeHeaderCoMap';
import Slider from '../projects/co-map/components/Slider';
import {BASICS_ENDPOINTS} from '../api/endpoints/BasicsEndpoints';
import {BASICS_ENDPOINTS as CO_MAP_BASICS_ENDPOINTS} from '../projects/co-map/api/endpoints/BasicEndpoints';
import AmbassadorProgram from '../projects/co-map/components/AmbassadorProgram';
import WhyAmbassador from '../projects/co-map/components/WhyAmbassador';

const Ambassadors: FC = () => {
    return (
        <>
            <HomeHeaderCoMap />

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div className={'bounding_element'}>
                    <Slider
                        API_URL={CO_MAP_BASICS_ENDPOINTS.getAmbassadorCard()}
                    />

                    <AmbassadorProgram />
                    <WhyAmbassador />
                    <AmbassadorCommunity />
                    <AmbassadorForm />
                </div>
            </div>
        </>
    );
};

export default Ambassadors;
