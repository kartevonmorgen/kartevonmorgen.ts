import css from 'styled-jsx/css'
import { RatingFactor } from '../dtos/RatingFactor'


export const INITIATIVE_COLOR = '#a4c93e'
export const COMPANY_COLOR = '#31a1b6'
export const EVENT_COLOR = '#eb80a9'
export const UNKNOWN_COLOR = 'rgb(221,221,221)'


export const grayBlue = 'rgb(100,122,133)'
export const blue = 'rgb(0,153,173)'
export const green = 'rgb(151,191,13)'
export const yellow = 'rgb(255,221,0)'
export const pink = 'rgb(229,98,146)'
export const berry = 'rgb(170,56,108)'
export const coal = 'rgb(26,26,26)'
export const anthracite = 'rgb(45,45,45)'
export const darkGray = 'rgb(102,102,102)'
export const gray = 'rgb(136,136,136)'
export const lightGray = 'rgb(221,221,221)'
export const teal = 'rgb(0,152,137)'
export const yellowText = 'rgb(214,201,0)'


export const RatingFactorColors = {
  'default': lightGray,
  [RatingFactor.diversity]: green,
  [RatingFactor.fairness]: yellow,
  [RatingFactor.humanity]: pink,
  [RatingFactor.renewable]: berry,
  [RatingFactor.solidarity]: grayBlue,
  [RatingFactor.transparency]: blue,
}


export default css.global`
    .ant-btn-primary {
        background-color: #666;
        border-color: #555;
    }

    .ant-btn-primary:hover {
        background-color: #777;
        border-color: #666;
    }

    .initiative-tag {
        background-color: ${INITIATIVE_COLOR};
        color: white;
    }

    .company-tag {
        background-color: ${COMPANY_COLOR};
        color: white;
    }

    .event-tag {
        background-color: ${EVENT_COLOR};
        color: white;
    }

    .initiative-result-card {
        border-left: solid 5px ${INITIATIVE_COLOR};
    }

    .company-result-card {
        border-left: solid 5px ${COMPANY_COLOR};
    }

    .event-result-card {
        border-left: solid 5px ${EVENT_COLOR};
    }

    .initiative-circle-marker {
        fill: ${INITIATIVE_COLOR};
    }

    .company-circle-marker {
        fill: ${COMPANY_COLOR};
    }

    .event-circle-marker {
        fill: ${EVENT_COLOR};
    }
`;