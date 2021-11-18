import { Button } from 'antd'
import { useRouter } from 'next/router'
import Link from 'next/link'


function HeaderCardContainer() {

  const scrollToMyRef = () => {
    let yToScroll = 0

    if (process.browser) {
      let howTo = document.getElementById('HowToUseMap')
      if (howTo) {
        yToScroll = howTo.getBoundingClientRect().top - document.body.getBoundingClientRect().top

      }
    }

    window.scrollTo({ top: yToScroll, behavior: 'smooth' })
  }

  const router = useRouter()


  return (
    <div id={'header-card-container'}>
      <HeaderCard title={'Каждому'} text={'Найдите места, где люди создают устойчивое будущее'}
                  onClick={scrollToMyRef}/>
      <HeaderCard title={'Амбассадорам'}
                  text={'Станьте частью глобального движения в роли локального автора карты co-map.ru'}
                  onClick={() => {
                    router.replace(
                      {
                        pathname: '/ambassadors',
                      })
                  }}/>

      <HeaderCard title={'Лидерам изменений'} link={'co-map/co-map.ru для лидеров изменений.pdf'}
                  text={'Продвигайте свои проекты среди ответственной релеувантной аудитории'} onClick={() => {
      }}/>

      <HeaderCard title={'Партнерам'} link={'co-map/co-map.ru для профессионалов.pdf'}
                  text={'Изучайте и поддерживайте социальные инициативы'} onClick={() => {
      }}/>
    </div>
  )
}

interface HeaderCardProps {
  title: string
  text: string
  onClick: () => void
  link?: string
}

function HeaderCard(props: HeaderCardProps) {

  return (
    <div id={'header-card'}>
      <span className={'title'}>{props.title}</span>
      <span className={'text'}>{props.text}</span>
      {props.link ?
        <Button className={'button'} onClick={props.onClick}>
          <Link href={props.link} passHref>
            <a target="_blank" rel="noreferrer" style={{ outline: 'none', color: 'white' }}>
              Подробнее
            </a>
          </Link>
        </Button> :
        <Button className={'button'} onClick={props.onClick}>
          Подробнее
        </Button>
      }


    </div>
  )
}

export default HeaderCardContainer
