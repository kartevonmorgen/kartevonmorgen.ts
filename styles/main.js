import css from 'styled-jsx/css'


const INITIATIVE_COLOR = '#a4c93e'
const COMPANY_COLOR = '#31a1b6'
const EVENT_COLOR = '#eb80a9'


export default css.global`
.ant-btn-primary {
 background-color: #666;
 border-color: #555;
}

.hashtag_checkbox_group {
  margin: 10px;
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

`