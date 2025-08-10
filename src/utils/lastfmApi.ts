import { type Artist } from './artistData'

interface LastfmResponse {
  topartists: {
    artist: Artist[]
  }
}

const API_BASE_URL = 'https://ws.audioscrobbler.com/2.0/'
const USERNAME = 'jcvandmg' 
const LIMIT = 100

export const fetchTopArtists = async (): Promise<Artist[]> => {
  const apiKey = import.meta.env.VITE_LASTFM_API_KEY
  
  if (!apiKey) {
    throw new Error('VITE_LASTFM_API_KEY environment variable is not set')
  }

  const url = new URL(API_BASE_URL)
  url.searchParams.set('method', 'user.gettopartists')
  url.searchParams.set('user', USERNAME)
  url.searchParams.set('api_key', apiKey)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', LIMIT.toString())

  const response = await fetch(url.toString())
  
  if (!response.ok) {
    throw new Error(`Last.fm API error: ${response.status} ${response.statusText}`)
  }

  const data: LastfmResponse = await response.json()
  
  if (!data.topartists?.artist) {
    throw new Error('Invalid response format from Last.fm API')
  }

  return data.topartists.artist
}