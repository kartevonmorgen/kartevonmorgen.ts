import { FC } from 'react'
import PropTypes from 'prop-types'
import has from 'lodash/has'
import isString from 'lodash/isString'
import mainStyle from '../styles/main'


const projectToStyleMapper = {
  'main': mainStyle,
}

interface LayoutProps {
  project?: string | object
}

const Layout: FC<LayoutProps> = (props) => {
  let project = 'main'
  if (
    props.project &&
    isString(props.project) &&
    has(projectToStyleMapper, props.project)
  ) {
    project = props.project
  }

  const globalStyle = projectToStyleMapper[project]

  return (
    <div className="page-layout">
      {props.children}

      <style jsx global>
        {globalStyle}
      </style>
    </div>
  )
}


Layout.propTypes = {
  project: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
}

Layout.defaultProps = {
  project: 'main',
}


export default Layout
