import { FC } from 'react'
import Image from 'next/image'

const instructions = [
    {
        title: 'Находите вдохновляющие организации и события поблизости',
        image: '/projects/co-map/assets/img/current_location.png',
        instruction:
            'Заходите в гости к лидерам изменений, которые заботятся об окружающих и о будущем.',
        reason: 'Например: Зайдите в кафе «Огурцы», которое принимает на работу ребят с нейроособенностями (перейти к карте). Сдайте ненужную одежду в Charity Shop',
    },
    {
        title: 'Отмечайте на карте лидеров изменений',
        image: '/projects/co-map/assets/img/right_direction.png',
        instruction:
            'Расскажите об организациях и проектах в вашем районе, которые вас вдохновляют',
        reason: 'Вы поможете им привлечь внимание СМИ, новых клиентов, волонтёров и партнёров',
    },
    {
        title: 'Влияйте на рейтинг участников карты',
        image: '/projects/co-map/assets/img/winners.png',
        instruction:
            'Оставляйте отзывы и оценивайте лидеров изменений по специальным критериям',
        reason: 'Ваша оценка поможет проекту стать более заметным, а обратная связь — понять, над чем стоит работать',
    },
];


const HowToUseMap: FC = () => (
  <div id={'HowToUseMap'}>
    <div className='co_map_title how-to-use-title'>Как использовать карту</div>
    {
      instructions.map(({ title, instruction, reason, image }) => <div className='map-instruction-block'>
        <div className='description-block'>
          <div className='co_map_subtitle'>{title}</div>
          <div className='description co_map_smalltext'>{instruction}</div>
          <div className='description co_map_smalltext'>{reason}</div>
        </div>
        <div className='image-block'><Image src={image} width={250} height={200}/></div>
      </div>)
    }

  </div>
)

export default HowToUseMap