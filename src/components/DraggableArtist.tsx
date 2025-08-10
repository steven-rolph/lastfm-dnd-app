import { useDraggable } from '@dnd-kit/core'
import { type InteractionArtist } from '../utils/artistData'

interface DraggableArtistProps {
  artist: InteractionArtist
}

export function DraggableArtist({ artist }: DraggableArtistProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: artist.id,
  })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="artist-item"
    >
      <span className="name">{artist.name}</span>
    </div>
  )
}