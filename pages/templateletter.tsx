import React, { FC } from 'react'
import Link from 'next/link'
import HomeHeaderCoMap from '../projects/co-map/components/HomeHeaderCoMap'


const TemplateLetter: FC = () => {

  return (
    <>
    <HomeHeaderCoMap/>
    <div className='template'>
      <div className='instructions__container'>
        <section>
          <h1>Рассылка для новых участников карты</h1>
          <p className='co_map_mediumtext'>Если в новую запись на карте устойчивых практик добавлен адрес эл. почты, то
            её владелец автоматически
            получит следующее письмо. В дальнейшем вы можете отправить другое письмо, написанное индивидуально, если
            хотите добавить больше деталей.
          </p>
        </section>
        <section>
          <h3 className='co_map_subtitle'>Шаблон письма </h3>
          <p className='co_map_mediumtext'>{`Тема: {{title}}, добро пожаловать на карту устойчивых практик России!`}</p>
          <p className='co_map_mediumtext'>Добро пожаловать на карту устойчивых практик России!</p>
          <p className='co_map_mediumtext'>{`Вы или кто-то из ваших сторонников добавили ваш проект в {{created}} на карту`} <Link
            href={'/maps/main'}>co-map.ru</Link>,
            платформу энтузиастов устойчивого развития.</p>
          <p className='co_map_mediumtext'>Поздравляем! Это означает, что вы создаёте устойчивое будущее, находитесь на пути к этому или **ведёте
            других людей за собой**.</p>
          <p className='co_map_mediumtext'>Вы можете улучшить описание вашего проекта или добавить оценку вашей организации по специальным
            критериям. <Link href={'#'}>{`{{link}}`}</Link></p>
          <p className='co_map_mediumtext'>И, конечно, вы можете нанести на карту и оценить ещё больше устойчивых проектов, с которыми вы знакомы и
            которые делают значимые вещи для людей и окружающей среды. </p>
          <p className='co_map_mediumtext'>Всё остальное об идее карты вы можете найти на нашем <Link href={'/maps/main'}>сайте</Link>. Например, вы
            можете
            разместить карту на своём сайте через <Link href={'#'}>{`iframe`}</Link>, чтобы люди, интересующиеся
            устойчивым
            развитием, могли быстро найти вас и другие проекты.</p>
          <p className='co_map_mediumtext'>Карта устойчивых всегда будет доступна бесплатно. </p>
          <p className='co_map_mediumtext'>Развитие платформы и добавление новых функций зависит от **пожертвований** участников карты. Если каждый
            проект будет жертвовать __ рублей в месяц, платформа сможет развиваться самостоятельно и органично, в том
            числе, <Link href={'https://blog.vonmorgen.org/tag/papierkarten/'}>бумажные карты</Link>, которые печатаются
            тысячами во всё новых и новых регионах. Просто <Link href={'https://blog.vonmorgen.org/spenden/'}>оформите
              регулярное пожертвование</Link> сейчас!
          </p>
          <p className='co_map_mediumtext'>Удачи и продолжайте в том же духе!</p>
          <p className='co_map_mediumtext'>Ваш региональный амбассадор и команда <Link href={'/maps/main'}>co-map.ru</Link></p>

        </section>
      </div>
    </div>
    </>
  )
}

export default TemplateLetter
