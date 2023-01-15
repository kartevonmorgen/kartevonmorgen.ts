import { FC } from 'react'
import Image from 'next/image'
import { Space, Typography } from 'antd'

const { Text } = Typography

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
    src: 'Helmut.webp',
  },
  {
    name: 'Anna Rogun',
    src: 'Anna.webp',
    description: 'Instagram',
  },
  {
    name: 'Laura Leichtle',
    src: 'Laura.webp',
    description: 'Graphic and Design',
  },
  {
    name: 'Navid Kalaei',
    src: 'Navid.webp',
    description: 'Software Development',
  },
  {
    name: 'David Ziegler',
    src: 'David.webp',
    description: 'Software Development',
  },
  {
    name: 'Markus Kohlhase',
    src: 'Markus.webp',
    description: 'Software Development',
  },
  {
    name: 'Uwe Klotz',
    src: 'Uwe.webp',
    description: 'Backend-Developer',
  },
  {
    name: 'Florian Jostock',
    src: 'placeholder_1.webp',
    description: 'Frontend-Developer',
  },
  {
    name: 'Manuel Molt',
    src: 'Manuel.webp',
    description: 'Marketing Strategies',
  },
  {
    name: 'Alex Reiner',
    src: 'Alex.webp',
    description: 'Frontend-Developer',
  },
  {
    name: 'Heiko Hoffmann',
    src: 'Heiko.webp',
    description: 'Glossar Developper',
  },
  {
    name: 'Be One of Us',
    src: 'placeholder_4.webp',
    description: 'We are always looking for new members!',
  },
]


// todo: add header for team
// todo: translate the team description from locales/home.json->chapter5
const Team: FC = () => {
  return (
    <div>
      <Space
        wrap
        align="center"
        style={{ justifyContent: 'center' }}
      >
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
                    src={`/assets/img/team/${src}`}
                    layout="intrinsic"
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
