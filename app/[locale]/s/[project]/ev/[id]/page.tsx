import Event from '../../../../../../dtos/Event'
import { Metadata } from 'next'
import { BASICS_ENDPOINTS } from '../../../../../../api/endpoints/BasicsEndpoints'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { isbot } from 'isbot'

// Additional bot detection for social media crawlers
// Telegram doesn't identify itself as a bot, so we need to check other factors
function isSocialMediaCrawler(userAgent: string, headers: Headers): boolean {
  const ua = userAgent.toLowerCase()
  
  // Explicit bot user agents
  const botPatterns = [
    'telegrambot',
    'whatsapp',
    'facebookexternalhit',
    'facebookcatalog',
    'twitterbot',
    'linkedinbot',
    'slackbot',
    'discordbot',
    'pinterest',
    'tumblr',
    'reddit',
    'skype',
    'viber',
    'line',
    'kakaotalk',
    'wechat',
  ]
  
  if (botPatterns.some(pattern => ua.includes(pattern))) {
    return true
  }
  
  // Check for headless browsers often used by social media crawlers
  if (ua.includes('headless') || ua.includes('phantomjs') || ua.includes('prerender')) {
    return true
  }
  
  // Check for missing Accept-Language header (common for bots)
  const acceptLanguage = headers.get('accept-language')
  if (!acceptLanguage && ua.includes('mozilla')) {
    // Real browsers almost always send Accept-Language
    return true
  }
  
  // Check for Purpose header (used by link preview services)
  const purpose = headers.get('purpose')
  const xPurpose = headers.get('x-purpose')
  if (purpose === 'preview' || xPurpose === 'preview') {
    return true
  }
  
  return false
}

// Fetch event data from API
async function fetchEvent(id: string): Promise<Event | null> {
  try {
    const url = `${BASICS_ENDPOINTS.getEvent()}/${id}`
    
    const response = await fetch(url, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })

    if (!response.ok) {
      console.error(`Failed to fetch event ${id}: ${response.status}`)
      return null
    }
    
    const data = await response.json()
    if (!data || data.length === 0) {
      return null
    }

    return data as Event
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error)
    return null
  }
}

// Convert Unix timestamp to ISO 8601 format for Open Graph
function timestampToISO(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString()
}

// Generate Open Graph metadata from Event
// Next.js will automatically inject these as <meta> tags in the <head>
export async function generateMetadata({ 
  params,
  searchParams 
}: { 
  params: { locale: string; project: string; id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  // Fetch event by params.id
  const event = await fetchEvent(params.id)
  
  // Fallback metadata if event not found
  if (!event) {
    return {
      title: 'Event not found',
      description: 'The requested event could not be found.'
    }
  }
  
  // Build the canonical URL that matches the redirect destination
  const queryString = new URLSearchParams(searchParams as Record<string, string>).toString()
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SELF_DOMAIN}/${params.locale}/m/${params.project}/ev/${params.id}${queryString ? `?${queryString}` : ''}`
  
  return {
    title: event.title || 'Event',
    description: event.description || '',
    // Standard Open Graph tags for Facebook, LinkedIn, etc.
    openGraph: {
      title: event.title || 'Event',
      description: event.description || '',
      url: canonicalUrl,
      siteName: 'Karte von morgen',
      ...(event.image_url ? {
        images: [
          {
            url: event.image_url,
            width: 1200,
            height: 630,
            alt: event.title || 'Event',
          },
        ],
      } : {}),
      locale: params.locale,
      type: 'website',
    },
    // Twitter Card tags for Twitter/X
    twitter: {
      card: 'summary_large_image',
      title: event.title || 'Event',
      description: event.description || '',
      ...(event.image_url ? { images: [event.image_url] } : {}),
    },
    // Event-specific metadata and additional information
    other: {
      // Event-specific Open Graph tags
      'event:start_time': event.start ? timestampToISO(event.start) : '',
      'event:end_time': event.end ? timestampToISO(event.end) : '',
      'event:organizer': event.organizer || '',
      // Location metadata
      'place:location:latitude': event.lat?.toString() || '',
      'place:location:longitude': event.lng?.toString() || '',
      // Business contact data
      'business:contact_data:street_address': event.street || '',
      'business:contact_data:locality': event.city || '',
      'business:contact_data:region': event.state || '',
      'business:contact_data:postal_code': event.zip || '',
      'business:contact_data:country_name': event.country || '',
      'business:contact_data:email': event.email || '',
      'business:contact_data:phone_number': event.telephone || '',
      'business:contact_data:website': event.homepage || '',
    },
  }
}

/*
 * The generateMetadata function above will generate these HTML meta tags in the <head>:
 * 
 * <head>
 *   <title>Community Workshop: Sustainable Living</title>
 *   <meta name="description" content="Join us for an interactive workshop on sustainable living practices..." />
 *   
 *   <!-- Open Graph tags for Facebook, LinkedIn, WhatsApp -->
 *   <meta property="og:title" content="Community Workshop: Sustainable Living" />
 *   <meta property="og:description" content="Join us for an interactive workshop on sustainable living practices..." />
 *   <meta property="og:url" content="https://kartevonmorgen.org/s/ev/abc123def456" />
 *   <meta property="og:site_name" content="Karte von morgen" />
 *   <meta property="og:image" content="https://images.unsplash.com/photo-1234567890" />
 *   <meta property="og:image:width" content="1200" />
 *   <meta property="og:image:height" content="630" />
 *   <meta property="og:image:alt" content="Community Workshop: Sustainable Living" />
 *   <meta property="og:locale" content="de_DE" />
 *   <meta property="og:type" content="website" />
 *   
 *   <!-- Twitter Card tags for Twitter/X -->
 *   <meta name="twitter:card" content="summary_large_image" />
 *   <meta name="twitter:title" content="Community Workshop: Sustainable Living" />
 *   <meta name="twitter:description" content="Join us for an interactive workshop on sustainable living practices..." />
 *   <meta name="twitter:image" content="https://images.unsplash.com/photo-1234567890" />
 *   
 *   <!-- Event-specific metadata -->
 *   <meta name="event:start_time" content="2025-11-15T10:00:00.000Z" />
 *   <meta name="event:end_time" content="2025-11-15T16:00:00.000Z" />
 *   <meta name="event:organizer" content="Green Community Network" />
 *   
 *   <!-- Location and contact metadata for Telegram and other platforms -->
 *   <meta name="place:location:latitude" content="52.52" />
 *   <meta name="place:location:longitude" content="13.405" />
 *   <meta name="business:contact_data:street_address" content="Hauptstraße 42" />
 *   <meta name="business:contact_data:locality" content="Berlin" />
 *   <meta name="business:contact_data:region" content="Berlin" />
 *   <meta name="business:contact_data:postal_code" content="10115" />
 *   <meta name="business:contact_data:country_name" content="Germany" />
 *   <meta name="business:contact_data:email" content="info@greencommunity.example" />
 *   <meta name="business:contact_data:phone_number" content="+49 30 12345678" />
 *   <meta name="business:contact_data:website" content="https://greencommunity.example" />
 * </head>
 */

export default async function ServerComponentPage({ 
  params,
  searchParams 
}: { 
  params: { locale: string; project: string; id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Fetch event data
  const event = await fetchEvent(params.id)
  
  // Handle event not found
  if (!event) {
    return (
      <div>
        <h1>Event not found</h1>
        <p>The event with ID {params.id} could not be found.</p>
      </div>
    )
  }
  
  // Check if the request is from a bot
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  
  // Use comprehensive bot detection
  const isRequestFromBot = isbot(userAgent) || isSocialMediaCrawler(userAgent, headersList)
  
  // If not a bot, redirect to the main event page
  if (!isRequestFromBot) {
    // Build query string from incoming search params
    const queryString = new URLSearchParams(searchParams as Record<string, string>).toString()
    const redirectUrl = `/${params.locale}/m/${params.project}/ev/${params.id}${queryString ? `?${queryString}` : ''}`
    
    redirect(redirectUrl)
  }
  
  // For bots, show the static content with all metadata
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
        {event.image_url && (
          <img src={event.image_url} alt={event.title} style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }} />
        )}
        
        <h1>{event.title}</h1>
        
        {event.description && (
          <div style={{ marginBottom: '20px' }}>
            <p>{event.description}</p>
          </div>
        )}
        
        {(event.start || event.end) && (
          <div style={{ marginBottom: '20px' }}>
            <strong>Event Time:</strong>
            <p style={{ margin: '5px 0' }}>
              {event.start && <>Start: {new Date(event.start * 1000).toLocaleString()}<br /></>}
              {event.end && <>End: {new Date(event.end * 1000).toLocaleString()}<br /></>}
            </p>
          </div>
        )}
        
        {event.organizer && (
          <div style={{ marginBottom: '20px' }}>
            <strong>Organizer:</strong>
            <p style={{ margin: '5px 0' }}>{event.organizer}</p>
          </div>
        )}
        
        {(event.street || event.city || event.zip || event.state || event.country) && (
          <div style={{ marginBottom: '20px' }}>
            <strong>Address:</strong>
            <p style={{ margin: '5px 0' }}>
              {event.street && <>{event.street}<br /></>}
              {(event.zip || event.city) && <>{event.zip} {event.city}<br /></>}
              {event.state && <>{event.state}<br /></>}
              {event.country}
            </p>
          </div>
        )}
        
        {(event.lat && event.lng) && (
          <div style={{ marginBottom: '20px' }}>
            <strong>Location:</strong>
            <p style={{ margin: '5px 0' }}>Latitude: {event.lat}, Longitude: {event.lng}</p>
          </div>
        )}
        
        {(event.email || event.telephone || event.homepage) && (
          <div style={{ marginBottom: '20px' }}>
            <strong>Contact:</strong>
            <p style={{ margin: '5px 0' }}>
              {event.email && <><a href={`mailto:${event.email}`}>{event.email}</a><br /></>}
              {event.telephone && <><a href={`tel:${event.telephone}`}>{event.telephone}</a><br /></>}
              {event.homepage && <><a href={event.homepage} target="_blank" rel="noopener noreferrer">{event.homepage}</a><br /></>}
            </p>
          </div>
        )}
        
        {event.tags && event.tags.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <strong>Tags:</strong>
            <p style={{ margin: '5px 0' }}>
              {event.tags.map((tag, index) => (
                <span key={index} style={{ display: 'inline-block', background: '#e0e0e0', padding: '3px 8px', margin: '2px', borderRadius: '3px', fontSize: '0.9em' }}>
                  {tag}
                </span>
              ))}
            </p>
          </div>
        )}
      </body>
    </html>
  )
}
