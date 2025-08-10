import { useState, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  type DragEndEvent
} from '@dnd-kit/core'
import './App.css'
import topArtistsData from './data/dummy.json'
import {
  type Artist,
  type unrankedArtist,
  type Phase,
  prepareArtists,
  getOriginalRanking
} from './utils/artistData'
import { DraggableArtist } from './components/DraggableArtist'
import { DroppableSlot } from './components/DroppableSlot'

const parseSlotId = (id: string): number | null => {
  return id.startsWith('slot-') ? parseInt(id.slice(5)) : null
}

function App() {
  const [phase, setPhase] = useState<Phase>('initial')
  const [placedArtists, setPlacedArtists] = useState<Map<number, unrankedArtist>>(new Map())
  
  const artists: Artist[] = topArtistsData.topartists.artist
  const [interactionArtists] = useState(() => prepareArtists(artists, 10)) // Generate once, stable IDs
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

  const isExactMatch = (userPosition: number, artistName: string): boolean => {
    const lastfmArtist = originalRanking.find(artist => artist.name === artistName)
    return lastfmArtist?.rank === userPosition
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
                const isWrong = artist ? !isMatch : false // Artist is placed but in wrong position
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
        </div>
      </DndContext>
    </div>
  )
}

export default App
