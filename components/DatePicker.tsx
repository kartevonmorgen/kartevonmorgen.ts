import { DatePicker as AntDatePicker } from 'antd'
import type { Moment } from 'moment'
import momentGenerateConfig from 'rc-picker/lib/generate/moment'


const DatePicker = AntDatePicker.generatePicker<Moment>(momentGenerateConfig)

export default DatePicker

