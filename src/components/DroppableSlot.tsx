import { useDroppable } from '@dnd-kit/core'
import { type UnrankedArtist } from '../utils/artistData'

interface DroppableSlotProps {
  position: number
  artist: UnrankedArtist | null
  isExactMatch?: boolean
  isWrongMatch?: boolean
}

export function DroppableSlot({ position, artist, isExactMatch = false, isWrongMatch = false }: DroppableSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot-${position}`,
  })

  return (
    <div
      ref={setNodeRef}
      className={`ranking-slot ${isOver ? 'drag-over' : ''} ${artist ? 'filled' : ''} ${isExactMatch ? 'exact-match' : ''} ${isWrongMatch ? 'wrong-match' : ''}`}
    >
      <span className="slot-number">{position}.</span>
      <span className="slot-content">
        {artist ? artist.name : 'Drop here'}
      </span>
    </div>
  )
}