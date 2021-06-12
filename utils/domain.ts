export const getDomainFromLink = (link: string): string => {
  const { hostname } = new URL(link)
  const domain = hostname.replace(/^(www\.)/, '')

  return domain
}