const redirectToForm = () => {
  if (process.browser) {
    let form = document.getElementById('ambassador_form')
    if (form) {
      window.scrollTo(
        {
          top: form.getBoundingClientRect().top - document.body.getBoundingClientRect().top,
          behavior: 'smooth',
        })
    }
  }
}

//TODO: add a link to the needed place when all the components will be done
const AmbassadorProgram = () => (
  <div className='ambassador-program'>
    <div className='co_map_title'>Программа амбассадоров co-map.ru</div>
    <div className='main-block'>
      <div className='rounded-block co_map_smalltext'>Амбассадоры — ключевые люди ко-маппинга. Они активно добавляют на
        карту героев устойчивого развития и проверяют достоверность информации
      </div>
      <span className='btn co_map_smalltext' onClick={redirectToForm}>Подать заявку</span>
    </div>
  </div>
)

export default AmbassadorProgram