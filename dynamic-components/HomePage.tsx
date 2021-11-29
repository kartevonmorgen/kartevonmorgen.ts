import { FC } from 'react'
import DefaultHomePage from '../components/HomePage'
import CoMapHomePage from '../projects/co-map/components/CoMapHomePage'
import { AvailableProjects, config as projectConfig } from '../project.config'


const DynamicHomePage: FC = () => {
  switch (projectConfig.project) {
    case AvailableProjects.CO_MAP:
      return <CoMapHomePage/>
    default:
      return <DefaultHomePage/>
  }
}


export default DynamicHomePage