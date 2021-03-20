import { FC } from 'react'
import PropTypes from 'prop-types'
import has from 'lodash/has'
import mainStyle from '../styles/main'


const projectToStyleMapper = {
  'main': mainStyle,
}

interface LayoutProps {
  project?: string
}

const Layout: FC<LayoutProps> = (props) => {
  const project = props.project && has(projectToStyleMapper, props.project) ? props.project : 'main'
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
  project: PropTypes.string,
}

Layout.defaultProps = {
  project: 'main',
}


export default Layout