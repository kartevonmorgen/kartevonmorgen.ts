import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

import {
  faCamera,
  faClock,
  faEnvelope,
  faGlobe,
  faLink,
  faMapMarkerAlt,
  faPhone,
  faRoute,
  faUser,
} from '@fortawesome/free-solid-svg-icons'


// See https://github.com/FortAwesome/react-fontawesome#integrating-with-other-tools-and-frameworks
// Tell Font Awesome to skip adding the CSS automatically since it's being imported above
config.autoAddCss = false

library.add(
  faUser,
  faPhone,
  faEnvelope,
  faGlobe,
  faRoute,
  faMapMarkerAlt,
  faClock,
  faCamera,
  faLink,
)