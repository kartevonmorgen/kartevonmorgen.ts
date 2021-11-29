import { useRouter } from 'next/router'
import tagsDescriptions from '../../../public/projects/co-map/tag_descriptions'


function ChooseDirectionSearch() {

  const router = useRouter()

  const redirectToCurrentTags = async (arrayOfTags: Array<string>) => {
    let tagsList = ''
    for (let tagId = 0; tagId < arrayOfTags.length; tagId++) {
      if (tagId > 0) {
        tagsList = tagsList.concat('&')
      }

      tagsList = tagsList.concat(`tag=${arrayOfTags[tagId]}`)
    }


    router.push('/m/main?isSidebarOpen=true&' + tagsList)
    return
  }

  return (
    <div id={'choose-direction-container'}>
      <div className={'co_map_title'}>Выбрать направление поиска</div>
      <div className={'item-container'}>
        {tagsDescriptions.map(({ icon, description, title }) => {
          return <ItemDirection link={'https://ssr.kartevonmorgen.org/'} icon={icon} text={description} onClick={() => {
            redirectToCurrentTags([title]).then(r => console.log(r))
          }}/>
        })}
      </div>
    </div>
  )
}

export default ChooseDirectionSearch

interface ItemDirectionProps {
  text: string
  link: string
  icon: string
  onClick: () => void
}


function ItemDirection({ text, icon, onClick }: ItemDirectionProps) {
  return (
    <div className={'item-direction co_map_text noselect'} onClick={onClick}>
      <div className='choose-direction-img-container'><img src={icon} className='direction-tag-icon'/></div>
      {text}
    </div>
  )
}
