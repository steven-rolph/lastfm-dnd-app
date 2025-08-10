import { v4 as uuidv4 } from 'uuid'
import { shuffle } from 'lodash'

export interface LastFmArtist {
  name: string;
  playcount: string;
  '@attr': {
    rank: string;
  };
}

export interface InteractionArtist {
  id: string;
  name: string;
}

export interface RevealArtist {
  id: string;
  name: string;
  rank: number;
  playcount: string;
}

export type AppPhase = 'initial' | 'interaction' | 'reveal' | 'comparison';

const generateId = (): string => uuidv4()

export const prepareArtists = (
  artists: LastFmArtist[],
  count: number = 10
): InteractionArtist[] => {
  const topArtists = artists.slice(0, count);
  
  const interactionArtists: InteractionArtist[] = topArtists.map(artist => ({
    id: generateId(),
    name: artist.name,
  }));

  return shuffle(interactionArtists);
};

export const getOriginalRanking = (
  artists: LastFmArtist[],
  count: number = 10
): RevealArtist[] => {
  return artists.slice(0, count).map(artist => ({
    id: generateId(),
    name: artist.name,
    rank: parseInt(artist['@attr'].rank),
    playcount: artist.playcount,
  }));
};

export const createRankingMap = (artists: LastFmArtist[]): Map<string, number> => {
  const rankMap = new Map<string, number>();
  
  artists.forEach(artist => {
    rankMap.set(artist.name, parseInt(artist['@attr'].rank));
  });
  
  return rankMap;
};