import { NextApiRequest, NextApiResponse } from 'next'
import util from 'util'
import child_process from 'child_process'
import { AmbassadorFormType } from '../../../../projects/co-map/components/AmbassadorForm'


const exec = util.promisify(child_process.exec)
const script_path = 'scripts/python/email_sender.py'
const python_path = 'scripts/python/venv/bin/python3'
const email_receiver = 'andrusov.n@gmail.com'


export function textFromData(data: AmbassadorFormType) {
  let name: string = data['name']
  let location: string = data['location']
  let contact: string = data['contact']
  let facebook_link: string = data['facebook_link']
  let motivation: string = data['motivation']

  let messageTheme = `${name} хочет стать амбассадором! (co-map.ru)`

  let totalText = `${name} просит стать амбассадором. ${name} находится по адресу: ${location}. Свяжитесь с ним/ней: ${contact}, но также не забудьте посмотреть профиль в facebook: ${facebook_link}. Вот, как ${name} мотивирует свое желание стать амбассадором: ${motivation}.\n\nС уважением, автоматическая рассылка уведомлений co-map.ru`

  return {
    messageTheme,
    totalText,
  }
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req)

  const {
    body: data,
  } = req

  let name: string = data['name']
  let location: string = data['location']
  let contact: string = data['contact']
  let facebook_link: string = data['facebook_link']
  let motivation: string = data['motivation']

  let messageTheme = `${name} хочет стать амбассадором! (co-map.ru)`

  let totalText = `${name} просит стать амбассадором. ${name} находится по адресу: ${location}. Свяжитесь с ним/ней: ${contact}, но также не забудьте посмотреть профиль в facebook: ${facebook_link}. Вот, как ${name} мотивирует свое желание стать амбассадором: ${motivation}.\n\nС уважением, автоматическая рассылка уведомлений co-map.ru`

  let totalText64 = new Buffer(totalText).toString('base64')

  console.log('started sending message')

  let command = `"${python_path}" "${script_path}" "${totalText64}" "${email_receiver}" "${messageTheme}"`

  child_process.exec(command,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`ERROR!!! ${error}`)
        return
      }

      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
    })
  console.log('message sent')
  res.status(200).json({})
}