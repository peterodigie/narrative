const fs = require('fs');
const path = require('path');

// Folder containing the playlist files
const playlistFolder = path.join(__dirname, 'fromMusic_app');

// Read all files from the folder
const files = fs.readdirSync(playlistFolder);

// Category mapping based on filename prefixes
const categoryMap = {
  'instru': { id: 1, name: 'Instrumental' },
  'artist': { id: 2, name: 'Artist' },
  'song': { id: 3, name: 'Song Collections' },
  'friend': { id: 4, name: 'Friend' },
  'mood': { id: 5, name: 'Mood' },
  'strack': { id: 6, name: 'Soundtrack' },
  'esp': { id: 7, name: 'Spanish' },
  'spirit': { id: 8, name: 'Spiritual' },
  'xment': { id: 9, name: 'Experimental' },
  'naija': { id: 10, name: 'Nigerian' },
  'ida': { id: 11, name: 'Travel' },
  'fscore': { id: 12, name: 'Film Score' },
  'evocative': { id: 13, name: 'Evocative' },
  'oscar': { id: 14, name: 'Award-winning' },
  'anime': { id: 15, name: 'Anime' },
  'person': { id: 16, name: 'Personal' },
  'mix': { id: 17, name: 'Mixed Genre' },
  'mashup': { id: 18, name: 'Mashups' },
  'melody': { id: 19, name: 'Melodic' }
};

// Initialize data structures
const categories = [];
const playlists = [];
const songs = [];

// Category count map
const categoryCount = {};

// Keep track of song ID
let songId = 1;
let playlistId = 1;

// Process each file
files.forEach(file => {
  if (file.endsWith('.txt')) {
    // Skip .DS_Store and other non-playlist files
    if (file === '.DS_Store') return;
    
    // Extract category from filename
    let categoryKey = 'mix'; // Default category
    let categoryId = categoryMap['mix'].id;
    let categoryName = categoryMap['mix'].name;
    
    // Find matching category prefix
    Object.keys(categoryMap).forEach(prefix => {
      if (file.startsWith(prefix)) {
        categoryKey = prefix;
        categoryId = categoryMap[prefix].id;
        categoryName = categoryMap[prefix].name;
      }
    });
    
    // Increment category count
    categoryCount[categoryKey] = (categoryCount[categoryKey] || 0) + 1;
    
    // Create playlist name from filename (remove extension and replace underscores)
    const playlistName = file.replace('.txt', '')
                            .replace(/_/g, ' ')
                            .split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(' ');
    
    // Read file content
    const content = fs.readFileSync(path.join(playlistFolder, file), 'utf8');
    const songLines = content.split('\n').filter(line => line.trim() !== '');
    
    // Add playlist
    playlists.push({
      id: playlistId,
      name: playlistName,
      category_id: categoryId,
      category_name: categoryName,
      song_count: songLines.length
    });
    
    // Add songs from this playlist
    songLines.forEach(songLine => {
      // Parse artist and title
      let title = songLine;
      let artist = 'Unknown';
      
      if (songLine.includes(' - ')) {
        const parts = songLine.split(' - ');
        title = parts[1] || parts[0];
        artist = parts[0];
      }
      
      songs.push({
        id: songId++,
        title: title.trim(),
        artist: artist.trim(),
        playlist_id: playlistId
      });
    });
    
    playlistId++;
  }
});

// Create category list with counts
Object.keys(categoryMap).forEach(key => {
  if (categoryCount[key]) {
    categories.push({
      id: categoryMap[key].id,
      name: categoryMap[key].name,
      playlist_count: categoryCount[key]
    });
  }
});

// Sort categories by playlist count (descending)
categories.sort((a, b) => b.playlist_count - a.playlist_count);

// Calculate total songs and playlists
const totalSongs = songs.length;
const totalPlaylists = playlists.length;
const totalCategories = categories.length;

// Calculate playlist lengths
const playlistLengths = playlists.map(p => p.song_count);
const mean = playlistLengths.reduce((a, b) => a + b, 0) / playlistLengths.length;
const sortedLengths = [...playlistLengths].sort((a, b) => a - b);
const median = sortedLengths[Math.floor(sortedLengths.length / 2)];
const min = Math.min(...playlistLengths);
const max = Math.max(...playlistLengths);

// Count songs per artist
const artistCounts = {};
songs.forEach(song => {
  artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1;
});

// Get top artists
const topArtists = Object.keys(artistCounts)
  .map(artist => ({ artist, song_count: artistCounts[artist] }))
  .sort((a, b) => b.song_count - a.song_count)
  .slice(0, 5);

// Count songs per category
const categorySongCounts = {};
playlists.forEach(playlist => {
  categorySongCounts[playlist.category_name] = (categorySongCounts[playlist.category_name] || 0) + playlist.song_count;
});

// Get top categories
const topCategories = categories
  .map(category => ({
    category: category.name,
    playlist_count: category.playlist_count,
    song_count: categorySongCounts[category.name] || 0
  }))
  .sort((a, b) => b.playlist_count - a.playlist_count)
  .slice(0, 5);

// Create insights
const insights = {
  collection_overview: {
    total_songs: totalSongs,
    total_playlists: totalPlaylists,
    total_categories: totalCategories
  },
  playlist_analysis: {
    length_distribution: {
      mean: parseFloat(mean.toFixed(2)),
      median,
      min,
      max
    }
  },
  category_insights: {
    top_categories: topCategories
  },
  artist_insights: {
    top_artists: topArtists
  }
};

// Calculate category medians for recommendations
const categoryMedians = {};
categories.forEach(category => {
  const categoryPlaylists = playlists.filter(p => p.category_id === category.id);
  const lengths = categoryPlaylists.map(p => p.song_count);
  lengths.sort((a, b) => a - b);
  const median = lengths[Math.floor(lengths.length / 2)];
  categoryMedians[category.name] = median;
});

// Create recommendations
const recommendations = {
  overall_findings: {
    recommended_ideal_length: median,
    recommended_range: `${Math.max(8, median - 4)}-${median + 5}`,
    current_median: median
  },
  category_highlights: {}
};

// Add category recommendations
categories.forEach(category => {
  const median = categoryMedians[category.name] || 12;
  recommendations.category_highlights[category.name] = {
    current_median: median,
    recommended_ideal: median,
    recommended_range: `${Math.max(8, median - 4)}-${Math.min(median + 4, 30)}`
  };
});

// Generate data.js file
const dataJsContent = `// Generated from parse_playlists.js
// This data is based on real playlists from the fromMusic_app folder

// Categories data
const categories = ${JSON.stringify(categories, null, 2)};

// Playlists data (showing first 100 for performance)
const playlists = ${JSON.stringify(playlists.slice(0, 100), null, 2)};

// Songs data (showing first 500 for performance)
const songs = ${JSON.stringify(songs.slice(0, 500), null, 2)};

// Insights data
const insights = ${JSON.stringify(insights, null, 2)};

// Recommendations data
const recommendations = ${JSON.stringify(recommendations, null, 2)};

// Export functions to get data
export function get_categories() {
  return categories;
}

export function get_all_playlists_with_category() {
  return playlists;
}

export function get_playlists_by_category(categoryId) {
  return playlists.filter(playlist => playlist.category_id === categoryId);
}

export function get_playlist_details(playlistId) {
  const playlist = playlists.find(p => p.id === playlistId);
  if (!playlist) return null;
  
  const playlistSongs = songs.filter(song => song.playlist_id === playlistId);
  
  return {
    playlist: playlist,
    songs: playlistSongs
  };
}

export function get_comprehensive_insights() {
  return insights;
}

export function get_optimization_recommendations() {
  return recommendations;
}
`;

// Write to file
fs.writeFileSync('data_new.js', dataJsContent);
console.log('Generated data_new.js successfully!'); 