import { FC } from 'react'
import Image from 'next/image'

const instructions = [
    {
        title: 'Отмечайте на карте лидеров изменений',
        instruction:
        'Расскажите об организациях и проектах в вашем районе, которые вас вдохновляют',
        reason: 'Вы поможете им привлечь внимание СМИ, новых клиентов, волонтёров и партнёров',
        image: '/projects/co-map/assets/img/place_icon.svg',
        position: 'left',
        background: '#0198AF',
      },
      {
        title: 'Находите вдохновляющие организации и события поблизости',
        instruction:
        'Заходите в гости к лидерам изменений, которые заботятся об окружающих и о будущем.',
        reason: 'Например: Зайдите в кафе «Огурцы», которое принимает на работу ребят с нейроособенностями (перейти к карте). Сдайте ненужную одежду в Charity Shop',
        image: '/projects/co-map/assets/img/find_icon.svg',
        position: 'right',
        background: '#94C31F',
    },
    {
        title: 'Влияйте на рейтинг участников карты',
        instruction:
        'Оставляйте отзывы и оценивайте лидеров изменений по специальным критериям',
        reason: 'Ваша оценка поможет проекту стать более заметным, а обратная связь — понять, над чем стоит работать',
        image: '/projects/co-map/assets/img/mouse_icon.svg',
        position: 'left',
        background: '#AC3970',
    },
];


const HowToUseMap: FC = () => (
  <div id='HowToUseMap'>
    {
      instructions.map(({ title, instruction, reason, image, position, background }) =>
        <div
          className={'map-instruction-block ' + position}
        >
        <div 
          className='description-block'
          style={{
            background: background
          }}
        >
          <div className='co_map_subtitle'>{title}</div>
          <div className='description co_map_smalltext'>{instruction}</div>
          <div className='description co_map_smalltext'>{reason}</div>
        </div>
        <div className='image-block'>
          <Image src={image} width={220} height={240}/>
        </div>
      </div>)
    }

  </div>
)

export default HowToUseMap