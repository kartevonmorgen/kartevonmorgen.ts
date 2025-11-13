import { Entry } from '../../../../../../dtos/Entry'
import { Metadata } from 'next'
import { BASICS_ENDPOINTS } from '../../../../../../api/endpoints/BasicsEndpoints'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { isbot } from 'isbot'

// Default Open Graph image when entry has no image
const DEFAULT_OG_IMAGE = 'https://bildung.vonmorgen.org/wp-content/uploads/2018/08/Ideen%C2%B3Header-quadrat.png'

// Fetch entry data from API
async function fetchEntry(id: string): Promise<Entry | null> {
  try {
    const response = await fetch(`${BASICS_ENDPOINTS.getEntries()}/${id}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })
    
    if (!response.ok) {
      console.error(`Failed to fetch entry ${id}: ${response.status}`)
      return null
    }
    
    const data = await response.json()
    if (!data || data.length === 0) {
      return null
    }

    return data[0] as Entry
  } catch (error) {
    console.error(`Error fetching entry ${id}:`, error)
    return null
  }
}

// Generate Open Graph metadata from Entry
// Next.js will automatically inject these as <meta> tags in the <head>
export async function generateMetadata({ 
  params,
  searchParams 
}: { 
  params: { locale: string; project: string; id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  // Fetch entry by params.id
  const entry = await fetchEntry(params.id)
  
  // Fallback metadata if entry not found
  if (!entry) {
    return {
      title: 'Entry not found',
      description: 'The requested entry could not be found.'
    }
  }
  
  // Build the canonical URL that matches the redirect destination
  const queryString = new URLSearchParams(searchParams as Record<string, string>).toString()
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SELF_DOMAIN}/${params.locale}/m/${params.project}/e/${params.id}${queryString ? `?${queryString}` : ''}`
  
  return {
    title: entry.title || 'Entry',
    description: entry.description || '',
    // Standard Open Graph tags for Facebook, LinkedIn, etc.
    openGraph: {
      title: entry.title || 'Entry',
      description: entry.description || '',
      url: canonicalUrl,
      siteName: 'Karte von morgen',
      images: [
        {
          url: entry.image_url || DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: entry.title || 'Entry',
        },
      ],
      locale: params.locale,
      type: 'website',
    },
    // Twitter Card tags for Twitter/X
    twitter: {
      card: 'summary_large_image',
      title: entry.title || 'Entry',
      description: entry.description || '',
      images: [entry.image_url || DEFAULT_OG_IMAGE],
    },
    // Additional metadata for location and business info (Telegram will also read these)
    other: {
      'place:location:latitude': entry.lat?.toString() || '',
      'place:location:longitude': entry.lng?.toString() || '',
      'business:contact_data:street_address': entry.street || '',
      'business:contact_data:locality': entry.city || '',
      'business:contact_data:region': entry.state || '',
      'business:contact_data:postal_code': entry.zip || '',
      'business:contact_data:country_name': entry.country || '',
      'business:contact_data:email': entry.email || '',
      'business:contact_data:phone_number': entry.telephone || '',
      'business:contact_data:website': entry.homepage || '',
    },
  }
}

/*
 * The generateMetadata function above will generate these HTML meta tags in the <head>:
 * 
 * <head>
 *   <title>Green Coffee Roasters</title>
 *   <meta name="description" content="Sustainable organic coffee roastery..." />
 *   
 *   <!-- Open Graph tags for Facebook, LinkedIn, WhatsApp -->
 *   <meta property="og:title" content="Green Coffee Roasters" />
 *   <meta property="og:description" content="Sustainable organic coffee roastery..." />
 *   <meta property="og:url" content="https://kartevonmorgen.org/s/e/abc123def456" />
 *   <meta property="og:site_name" content="Karte von morgen" />
 *   <meta property="og:image" content="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085" />
 *   <meta property="og:image:width" content="1200" />
 *   <meta property="og:image:height" content="630" />
 *   <meta property="og:image:alt" content="Green Coffee Roasters" />
 *   <meta property="og:locale" content="de_DE" />
 *   <meta property="og:type" content="website" />
 *   
 *   <!-- Twitter Card tags for Twitter/X -->
 *   <meta name="twitter:card" content="summary_large_image" />
 *   <meta name="twitter:title" content="Green Coffee Roasters" />
 *   <meta name="twitter:description" content="Sustainable organic coffee roastery..." />
 *   <meta name="twitter:image" content="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085" />
 *   
 *   <!-- Additional metadata for Telegram and other platforms -->
 *   <meta name="place:location:latitude" content="52.52" />
 *   <meta name="place:location:longitude" content="13.405" />
 *   <meta name="business:contact_data:street_address" content="Hauptstraße 42" />
 *   <meta name="business:contact_data:locality" content="Berlin" />
 *   <meta name="business:contact_data:region" content="Berlin" />
 *   <meta name="business:contact_data:postal_code" content="10115" />
 *   <meta name="business:contact_data:country_name" content="Germany" />
 *   <meta name="business:contact_data:email" content="info@greencoffee.example" />
 *   <meta name="business:contact_data:phone_number" content="+49 30 12345678" />
 *   <meta name="business:contact_data:website" content="https://greencoffee.example" />
 * </head>
 */

export default async function ServerComponentPage({ 
  params,
  searchParams 
}: { 
  params: { locale: string; project: string; id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Fetch entry data
  const entry = await fetchEntry(params.id)
  
  // Handle entry not found
  if (!entry) {
    return (
      <div>
        <h1>Entry not found</h1>
        <p>The entry with ID {params.id} could not be found.</p>
      </div>
    )
  }
  
  // Check if the request is from a bot
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const isRequestFromBot = isbot(userAgent)
  
  // If not a bot, redirect to the main entry page
  if (!isRequestFromBot) {
    // Build query string from incoming search params
    const queryString = new URLSearchParams(searchParams as Record<string, string>).toString()
    const redirectUrl = `/${params.locale}/m/${params.project}/e/${params.id}${queryString ? `?${queryString}` : ''}`
    
    redirect(redirectUrl)
  }
  
  // For bots, show the static content with all metadata
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
        {entry.image_url && (
          <img src={entry.image_url} alt={entry.title} style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }} />
        )}
        
        <h1>{entry.title}</h1>
        
        {entry.description && (
          <div style={{ marginBottom: '20px' }}>
            <p>{entry.description}</p>
          </div>
        )}
        
        {(entry.street || entry.city || entry.zip || entry.state || entry.country) && (
          <div style={{ marginBottom: '20px' }}>
            <strong>Address:</strong>
            <p style={{ margin: '5px 0' }}>
              {entry.street && <>{entry.street}<br /></>}
              {(entry.zip || entry.city) && <>{entry.zip} {entry.city}<br /></>}
              {entry.state && <>{entry.state}<br /></>}
              {entry.country}
            </p>
          </div>
        )}
        
        {(entry.lat && entry.lng) && (
          <div style={{ marginBottom: '20px' }}>
            <strong>Location:</strong>
            <p style={{ margin: '5px 0' }}>Latitude: {entry.lat}, Longitude: {entry.lng}</p>
          </div>
        )}
        
        {(entry.email || entry.telephone || entry.homepage) && (
          <div style={{ marginBottom: '20px' }}>
            <strong>Contact:</strong>
            <p style={{ margin: '5px 0' }}>
              {entry.email && <><a href={`mailto:${entry.email}`}>{entry.email}</a><br /></>}
              {entry.telephone && <><a href={`tel:${entry.telephone}`}>{entry.telephone}</a><br /></>}
              {entry.homepage && <><a href={entry.homepage} target="_blank" rel="noopener noreferrer">{entry.homepage}</a><br /></>}
            </p>
          </div>
        )}
        
        {entry.tags && entry.tags.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <strong>Tags:</strong>
            <p style={{ margin: '5px 0' }}>
              {entry.tags.map((tag, index) => (
                <span key={index} style={{ display: 'inline-block', background: '#e0e0e0', padding: '3px 8px', margin: '2px', borderRadius: '3px', fontSize: '0.9em' }}>
                  {tag}
                </span>
              ))}
            </p>
          </div>
        )}
        
        {entry.categories && entry.categories.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <strong>Categories:</strong>
            <p style={{ margin: '5px 0' }}>{entry.categories.join(', ')}</p>
          </div>
        )}
      </body>
    </html>
  )
}
