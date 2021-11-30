import React from 'react'
import Image from 'next/image'

const reasonsToBeAmbassador = [
  'Сделайте видимыми наиболее важных игроков для обеспечения устойчивости в вашем регионе.',
  'Завести новые знакомства в сфере устойчивого развития',
  'Пополнить портфолио проектов для учёбы и карьеры',
  'Развивать профессиональную репутацию как лидер изменений',
  'Узнавать первым об экологичных и социальных проектах и продуктах у себя в регионе',
  'Продвигать повестку устойчивого развития в регионе',
]

const WhyAmbassador = () => (
    <div className="why-ambassador-container">
        <div className="why-ambassador-block">
            <div className="co_map_title">Зачем быть амбассадором?</div>
            {reasonsToBeAmbassador.map((reason, index) => (
                <div key={index} className="reasons-ambassador-block">
                    <div className="co_map_title huge">{index + 1}</div>
                    <div>{reason}</div>
                </div>
            ))}
        </div>
        <div>
            <div className="co_map_title">Этапы отбора</div>
            <Image
                className="selection"
                src={'/projects/co-map/selection.svg'}
                layout="responsive"
                width={100}
                height={100}
            />
        </div>
    </div>
);

export default WhyAmbassador