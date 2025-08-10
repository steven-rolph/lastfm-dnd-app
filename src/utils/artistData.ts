import { v4 as uuidv4 } from 'uuid'
import { shuffle } from 'lodash'

export interface Artist {
  name: string;
  playcount: string;
  '@attr': {
    rank: string;
  };
}

export interface UnrankedArtist {
  id: string;
  name: string;
}

export interface RankedArtist {
  id: string;
  name: string;
  rank: number;
  playcount: string;
}

export type Phase = 'initial' | 'interaction' | 'reveal' | 'comparison';

const generateId = (): string => uuidv4()

export const prepareArtists = (
  artists: Artist[],
  count: number = 10
): UnrankedArtist[] => {
  const topArtists = artists.slice(0, count);
  
  const interactionArtists: UnrankedArtist[] = topArtists.map(artist => ({
    id: generateId(),
    name: artist.name,
  }));

  return shuffle(interactionArtists);
};

export const getOriginalRanking = (
  artists: Artist[],
  count: number = 10
): RankedArtist[] => {
  return artists.slice(0, count).map(artist => ({
    id: `original-${artist.name.replace(/\s+/g, '-').toLowerCase()}`,
    name: artist.name,
    rank: parseInt(artist['@attr'].rank),
    playcount: artist.playcount,
  }));
};

