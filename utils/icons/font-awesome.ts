import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

import {
  faBars,
  faCamera,
  faChevronLeft,
  faChevronRight,
  faClock,
  faCode,
  faColumns,
  faCompass,
  faEnvelope,
  faGlobe,
  faHeadset,
  faHome,
  faLink,
  faMapMarker,
  faMapMarkerAlt,
  faPhone,
  faRoute,
  faShare,
  faUser,
  faUserFriends,
  faUsers,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons'

import { faCopy, faMap, faTimesCircle } from '@fortawesome/free-regular-svg-icons'

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
  faHome,
  faUserFriends,
  faColumns,
  faHeadset,
  faUsers,
  faUserShield,
  faBars,
  faCompass,
  faShare,
  faCode,
  faChevronLeft,
  faChevronRight,
)

// @fortawesome/free-regular-svg-icons
library.add(
  faCopy,
  faTimesCircle,
  faMap,
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