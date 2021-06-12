import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

import {
  faCamera,
  faClock,
  faEnvelope,
  faGlobe,
  faLink,
  faMapMarker,
  faMapMarkerAlt,
  faPhone,
  faRoute,
  faUser,
} from '@fortawesome/free-solid-svg-icons'

import {
  faCreativeCommons,
  faFacebook,
  faGithub,
  faInstagram,
  faTelegram,
  faTwitter,
  faWhatsapp,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons'


// See https://github.com/FortAwesome/react-fontawesome#integrating-with-other-tools-and-frameworks
// Tell Font Awesome to skip adding the CSS automatically since it's being imported above
config.autoAddCss = false

// free-solid-svg-icons
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
  faMapMarker,
)

// free-brands-svg-icons
library.add(
  faGithub,
  faFacebook,
  faInstagram,
  faTwitter,
  faWhatsapp,
  faTelegram,
  faYoutube,
  faCreativeCommons,
)