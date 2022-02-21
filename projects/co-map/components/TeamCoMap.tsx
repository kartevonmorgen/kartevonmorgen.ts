
import React, { FC, useState } from 'react'
import { Col, Row, Typography, Button } from 'antd'
import data from '../utils/team.json'
import Image from 'next/image'
import styles from 'TeamCoMap.module.css'
import { BASICS_ENDPOINTS as CO_MAP_BASICS_ENDPOINTS } from '../api/endpoints/BasicEndpoints'

const { Paragraph } = Typography

enum TeamGroups {
  Managment = 'Managment',
  Develop = 'Develop',
  Hackathon = 'hackathon',
}

interface TeamMemberProps {
  name: string;
  pictureSrc: string;
  position: string;
  hackathon: boolean;
}

interface TeamCoMapProps {
  showDescription: boolean;
}
interface TeamListProps {
  teamGroup?: TeamGroups;
  isVisible: boolean;
}

const TeamMember = (props: TeamMemberProps) => {
  return (
    <Col className={'team_member'}>
      <div>
        <Image
          width={'40px'}
          height={'40px'}
          src={props.pictureSrc}
          layout={'fixed'}
        />
      </div>
      <div className='team_member-info'>
        <div>
          <span className={'team_member-hackathon_label'}>
            {
              props.hackathon === true ?
                <div className={'bg-contrast'}>хакатон</div> :
                ''
            }
          </span>
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

const TeamList: FC<TeamListProps> = (props: TeamListProps) => {
  const bgClass = () => {
    switch(props.teamGroup) {
      case TeamGroups.Managment: {
        return 'bg-light_yellow';
      }
      case TeamGroups.Develop: {
        return 'bg-light_blue';
      }
      case TeamGroups.Hackathon: {
        return 'bg-light_green';
      }
    }
  }

  if (props.isVisible) {
    return (
      <Row justify={'center'}>
        <Col xs={24} sm={21}>
          <Row
            className={`team_list ${bgClass()}`}
            justify={'center'}
            gutter={[19, 25]}
          >
            {
              props.teamGroup === TeamGroups.Managment ?
                <>{data.Managment.map(e => {
                  return <TeamMember name={e.name} pictureSrc={e.pic} position={e.position} hackathon={e.hackathon} />
                })}</> :
              props.teamGroup === TeamGroups.Develop ?
                <>{data.Develop.map(e => {
                  return <TeamMember name={e.name} pictureSrc={e.pic} position={e.position} hackathon={e.hackathon} />
                })}</> :
                <>{data.Hackathon.map(e => {
                  return <TeamMember name={e.name} pictureSrc={e.pic} position={e.position} hackathon={e.hackathon} />
                })}</>
            }
          </Row>
        </Col>
      </Row>
    )
  }

  return (<></>)
}

export const TeamCoMap = (props: TeamCoMapProps) => {
  const {showDescription} = props;
  const [teamGroup, setTeamGroupState] = useState<TeamGroups>(null);

  function setTeamGroup(newTeamGroup: TeamGroups) {
    if (newTeamGroup === teamGroup) {
      setTeamGroupState(null)
    } else {
      setTeamGroupState(newTeamGroup)
    }
  }

  return (
    <Col className={showDescription ? 'team' : 'team_no_text'}>
      { showDescription && <Row className={'team_description'}>
        <div className={'team_description-title'}>Карта создана международной командой</div>

        <Paragraph>
          co-map.ru - это карта устойчивых практик на территории России, созданная для того, чтобы каждый день активист мог создать карту для своих проектов и событий и привлечь новых участниковю
        </Paragraph>

        <Paragraph>
          Карта разработана на основе открытого программного кода по лицензии Creative Commons — CC0 1.0
        </Paragraph>

        <Paragraph>
          Проект co-map стартовал в 2021 г. в рамках совместной работы некоммерческих организаций из России (Центр СОЛь, www.s-ol.ru). и Германии (wechange.de), нацеленных на развитие практик устойчивого развития.
        </Paragraph>

        <Paragraph>
          Развитие проекта осуществляется силами региональных волонтеров (амбассадоров) при поддержке:
        </Paragraph>
      </Row>}

      <Row>
        <Col flex={'auto'}>
          <Row
            className={'team_group-buttons'}
            justify={'center'}
          >
            <button
              className={`bg-yellow ' ${teamGroup === TeamGroups.Managment ? 'active' : ''}`}
              onClick={() => { setTeamGroup(TeamGroups.Managment) }}
            >
              {/* <div class='team_group-button_angle'></div> */}
              Управление
            </button>

            <button
              className={`bg-blue ' ${teamGroup === TeamGroups.Develop ? 'active' : ''}`}
              onClick={() => { setTeamGroup(TeamGroups.Develop) }}
            >
              Разработка
            </button>

            <button
              className={`bg-green ' ${teamGroup === TeamGroups.Hackathon ? 'active' : ''}`}
              onClick={() => { setTeamGroup(TeamGroups.Hackathon) }}
            >
              Хакатон
            </button>
          </Row>

          
            <TeamList
              teamGroup={ teamGroup }
              isVisible={ teamGroup === null ? false : true }
            />
        </Col>
      </Row>
    </Col>
  );
}