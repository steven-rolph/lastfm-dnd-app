import { v4 as uuidv4 } from 'uuid'
import { shuffle } from 'lodash'

export interface Artist {
  name: string;
  playcount: string;
  '@attr': {
    rank: string;
  };
}

export interface unrankedArtist {
  id: string;
  name: string;
}

export interface rankedArtist {
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
): unrankedArtist[] => {
  const topArtists = artists.slice(0, count);
  
  const rankedArtists: unrankedArtist[] = topArtists.map(artist => ({
    id: generateId(),
    name: artist.name,
  }));

  return shuffle(rankedArtists);
};

export const getOriginalRanking = (
  artists: Artist[],
  count: number = 10
): rankedArtist[] => {
  return artists.slice(0, count).map(artist => ({
    id: generateId(),
    name: artist.name,
    rank: parseInt(artist['@attr'].rank),
    playcount: artist.playcount,
  }));
};

export const createRankingMap = (artists: Artist[]): Map<string, number> => {
  const rankMap = new Map<string, number>();
  
  artists.forEach(artist => {
    rankMap.set(artist.name, parseInt(artist['@attr'].rank));
  });
  
  return rankMap;
};