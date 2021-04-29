import { FC } from 'react'
import Image from 'next/image'
import { Space, Typography } from 'antd'

const { Paragraph, Text } = Typography

interface Member {
  name: string
  src: string
  link?: string
  description: string
}

type Members = Member[]


const members: Members = [
  {
    name: 'Helmut Wolman',
    description: 'Co-Founder, Geschäftsführung',
    src: '/assets/img/team/Helmut.webp',
  },
  {
    name: 'Anna Rogun',
    src: '/assets/img/team/Anna.webp',
    description: 'Instagram',
  },
  {
    name: 'Laura Leichtle',
    src: '/assets/img/team/Laura.webp',
    description: 'Graphic and Design',
  },
  {
    name: 'Navid Kalaei',
    src: '/assets/img/team/Navid.webp',
    description: 'Software Development',
  },
  {
    name: 'David Ziegler',
    src: '/assets/img/team/David.webp',
    description: 'Software Development',
  },
  {
    name: 'Markus Kohlhase',
    src: '/assets/img/team/Markus.webp',
    description: 'Software Development',
  },
  {
    name: 'Uwe Klotz',
    src: '/assets/img/team/Uwe.webp',
    description: 'Backend-Developer',
  },
  {
    name: 'Manuel Molt',
    src: '/assets/img/team/Manuel.webp',
    description: 'Marketing Strategies',
  },
  {
    name: 'Alex Reiner',
    src: '/assets/img/team/Alex.webp',
    description: 'Frontend-Developer',
  },
  {
    name: 'Heiko Hoffmann',
    src: '/assets/img/team/Heiko.webp',
    description: 'Glossar Developper',
  },
]


const Team: FC = () => {
  return (
    <div>
      <Space wrap>
        {
          members.map(({ name, src, description, link }) => (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              key={`team-member-${name}`}
            >
              <div
                style={{
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 100,
                    height: 100,
                    display: 'inline-block',
                    borderRadius: 50,
                  }}
                >
                  <Image
                    src={src}
                    layout="fixed"
                    width={100}
                    height={100}
                  />
                </div>

                <Text strong>{name}</Text>

                <Text>{description}</Text>
              </div>
            </a>
          ))
        }
      </Space>
    </div>
  )
}


export default Team