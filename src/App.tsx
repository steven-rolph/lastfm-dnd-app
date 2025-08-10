import { useState, useMemo, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  type DragEndEvent
} from '@dnd-kit/core'
import './App.css'
import {
  type Artist,
  type UnrankedArtist,
  type Phase,
  prepareArtists,
  getOriginalRanking
} from './utils/artistData'
import { fetchTopArtists } from './utils/lastfmApi'
import { DraggableArtist } from './components/DraggableArtist'
import { DroppableSlot } from './components/DroppableSlot'

const parseSlotId = (id: string): number | null => {
  return id.startsWith('slot-') ? parseInt(id.slice(5)) : null
}

function App() {
  const [phase, setPhase] = useState<Phase>('initial')
  const [placedArtists, setPlacedArtists] = useState<Map<number, UnrankedArtist>>(new Map())
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [interactionArtists, setInteractionArtists] = useState<UnrankedArtist[]>([])
  const originalRanking = useMemo(() => getOriginalRanking(artists, 10), [artists])
  
  useEffect(() => {
    const loadArtists = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedArtists = await fetchTopArtists()
        setArtists(fetchedArtists)
        setInteractionArtists(prepareArtists(fetchedArtists, 10))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artists')
      } finally {
        setLoading(false)
      }
    }
    
    loadArtists()
  }, [])
  
  const availableArtists = useMemo(() => {
    const placedIds = new Set(Array.from(placedArtists.values()).map(artist => artist.id))
    return interactionArtists.filter(artist => !placedIds.has(artist.id))
  }, [interactionArtists, placedArtists])
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return
    
    const draggedArtistId = active.id as string
    const draggedArtist = interactionArtists.find(a => a.id === draggedArtistId)
    const targetPosition = parseSlotId(over.id.toString())
    
    if (!draggedArtist || !targetPosition) return
    
    setPlacedArtists(prev => {
      const newPlaced = new Map(prev)
      
      for (const [pos, artist] of newPlaced.entries()) {
        if (artist.id === draggedArtistId) {
          newPlaced.delete(pos)
          break
        }
      }
      
      newPlaced.set(targetPosition, draggedArtist)
      return newPlaced
    })
    
    if (phase === 'initial') {
      setPhase('interaction')
    }
  }

  const isExactMatch = (userPosition: number, artistName: string): boolean => {
    const lastfmArtist = originalRanking.find(artist => artist.name === artistName)
    return lastfmArtist?.rank === userPosition
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading Last.fm data...
        </div>
      )
    }
    
    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>
          Error: {error}
        </div>
      )
    }
    
    return (
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="left-column">
          <h2>{phase === 'reveal' || phase === 'comparison' ? "Steven's Last.fm Reality" : 'Artists'}</h2>
          <div className="artists-list">
            {phase === 'initial' || phase === 'interaction' ? (
              availableArtists.map((artist) => (
                <DraggableArtist key={artist.id} artist={artist} />
              ))
            ) : (
              originalRanking.map((artist) => (
                <div key={artist.id} className="artist-item">
                  <span className="rank">#{artist.rank}</span>
                  <span className="name">{artist.name}</span>
                  <span className="playcount">{artist.playcount} plays</span>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="right-column">
          <h2>{phase === 'reveal' || phase === 'comparison' ? 'Your Prediction' : 'Your Ranking'}</h2>
          <div className="ranking-slots">
            {Array.from({ length: 10 }, (_, index) => {
              const position = index + 1
              const artist = placedArtists.get(position) || null
              const isMatch = artist ? isExactMatch(position, artist.name) : false
              const isWrong = artist ? !isMatch : false
              const showComparison = phase === 'reveal' || phase === 'comparison'
              
              return (
                <DroppableSlot
                  key={position}
                  position={position}
                  artist={artist}
                  isExactMatch={showComparison ? isMatch : false}
                  isWrongMatch={showComparison ? isWrong : false}
                />
              )
            })}
          </div>
          
          {placedArtists.size === 10 && phase === 'interaction' && (
            <button
              className="reveal-button"
              onClick={() => setPhase('reveal')}
            >
              Reveal Last.fm Ranking!
            </button>
          )}
        </div>
      </DndContext>
    )
  }
  
  return (
    <div className="app">
      <div className="header">
        <h1>Last.fm DnD App - Steven Rolph</h1>
      </div>
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default App
