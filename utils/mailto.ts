const createMailToHref = (email: string, subject = '', body = ''): string => {
  let params = subject || body ? '?' : ''
  if (subject) params += `subject=${encodeURIComponent(subject)}`
  if (body) params += `${subject ? '&' : ''}body=${encodeURIComponent(body)}`

  return `mailto:${email}${params}`
}


export default createMailToHref