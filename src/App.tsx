import './App.css'
import topArtistsData from './data/dummy.json'

interface Artist {
  name: string;
  playcount: string;
  '@attr': {
    rank: string;
  };
}

function App() {
  const artists: Artist[] = topArtistsData.topartists.artist;
  const top10Artists = artists.slice(0, 10);

  return (
    <div className="app">
      <div className="header">
        <h1>Last.fm DnD App - Steven Rolph</h1>
        <p>Explore the top artists on Last.fm through a Drag and Drop lens.</p>
      </div>
      
      <div className="main-content">
        <div className="left-column">
          <h2>Last.fm Top Artists</h2>
          <div className="artists-list">
            {top10Artists.map((artist) => (
              <div key={artist['@attr'].rank} className="artist-item">
                <span className="rank">#{artist['@attr'].rank}</span>
                <span className="name">{artist.name}</span>
                <span className="playcount">{artist.playcount} plays</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="right-column">
          <h2>Drop Zone</h2>
          <div className="drop-area">
            <p>Drag artists here...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
