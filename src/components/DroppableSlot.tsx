import { useDroppable } from '@dnd-kit/core'
import { type InteractionArtist } from '../utils/artistData'

interface DroppableSlotProps {
  position: number
  artist: InteractionArtist | null
}

export function DroppableSlot({ position, artist }: DroppableSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `slot-${position}`,
  })

  return (
    <div
      ref={setNodeRef}
      className={`ranking-slot ${isOver ? 'drag-over' : ''} ${artist ? 'filled' : ''}`}
    >
      <span className="slot-number">{position}.</span>
      <span className="slot-content">
        {artist ? artist.name : 'Drop here'}
      </span>
    </div>
  )
}