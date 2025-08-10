import { useState, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  type DragEndEvent
} from '@dnd-kit/core'
import './App.css'
import topArtistsData from './data/dummy.json'
import {
  type LastFmArtist,
  type InteractionArtist,
  type AppPhase,
  prepareArtists,
  getOriginalRanking
} from './utils/artistData'
import { DraggableArtist } from './components/DraggableArtist'
import { DroppableSlot } from './components/DroppableSlot'

const parseSlotId = (id: string): number | null => {
  return id.startsWith('slot-') ? parseInt(id.slice(5)) : null
}

function App() {
  const [phase, setPhase] = useState<AppPhase>('initial')
  const [placedArtists, setPlacedArtists] = useState<Map<number, InteractionArtist>>(new Map())
  
  const artists: LastFmArtist[] = topArtistsData.topartists.artist
  const interactionArtists = prepareArtists(artists, 10)
  const originalRanking = getOriginalRanking(artists, 10)
  
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

  return (
    <div className="app">
      <div className="header">
        <h1>Last.fm DnD App - Steven Rolph</h1>
      </div>
      
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="main-content">
          <div className="left-column">
            <h2>Artists</h2>
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
            <h2>Ranking</h2>
            <div className="ranking-slots">
              {Array.from({ length: 10 }, (_, index) => {
                const position = index + 1
                const artist = placedArtists.get(position) || null
                return (
                  <DroppableSlot
                    key={position}
                    position={position}
                    artist={artist}
                  />
                )
              })}
            </div>
            
            {placedArtists.size === 10 && phase === 'interaction' && (
              <button
                onClick={() => setPhase('reveal')}
              >
                Reveal Last.fm Ranking!
              </button>
            )}
            
          </div>
        </div>
      </DndContext>
    </div>
  )
}

export default App
