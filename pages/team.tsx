import { FC } from 'react';
import HomeHeaderCoMap from '../projects/co-map/components/HomeHeaderCoMap';
import Partners from '../projects/co-map/components/Partners';
import { Collapse, Col, Row } from 'antd';
import Image from 'next/image'
import data from '../projects/co-map/utils/team.json'

const { Panel } = Collapse;


interface TeamMemberProps {
  name: string;
  pictureSrc: string;
  position: string;
  hackathon: boolean;
}

const TeamMember = (props: TeamMemberProps) => {
	return (
		<Col className={'team_member'}>
			<div className={'team_member-img'}>
				<Image
					width={'120px'}
					height={'120px'}
					src={props.pictureSrc}
					layout={'fixed'}
				/>
			</div>
			<div className='team_member-info'>
				<div className={'team_member-name_wrap'}>
					<span className={'team_member-name'}>
							{props.name}
					</span>
				</div>
				<span className={'team_member-position'}>
					{props.position}
				</span>
			</div>
		</Col>
	)
}


const TeamPage: FC = () => {
	return (
		<>
			<HomeHeaderCoMap />


			<Collapse className={'team_page-accordion'}>
				<Panel className={'team-panel'} key='1' header='Управление'>
					<>
            {data.Managment.map(e => {
              return <TeamMember
                name={e.name} pictureSrc={e.pic} position={e.position} hackathon={e.hackathon}
              />
            })}
					</>
				</Panel>
				<Panel className={'team-panel'} key='2' header='Разработка'>
          <>
            {data.Develop.map(e => {
              return <TeamMember
                name={e.name} pictureSrc={e.pic} position={e.position} hackathon={e.hackathon}
              />
            })}
					</>
        </Panel>
				<Panel className={'team-panel'} key='3' header='Хакатон'>
          <>
            {data.Hackathon.map(e => {
              return <TeamMember
                name={e.name} pictureSrc={e.pic} position={e.position} hackathon={e.hackathon}
              />
            })}
					</>
        </Panel>
			</Collapse>


			<Partners />
		</>
	)
}

export default TeamPage;