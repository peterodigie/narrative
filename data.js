// Mock data module for static export
// This replaces the original data.js that used sqlite3 and json modules

// Mock categories data
const categories = [
  { id: 1, name: 'Instrumental', playlist_count: 54 },
  { id: 2, name: 'Artist', playlist_count: 51 },
  { id: 3, name: 'Song Collections', playlist_count: 32 },
  { id: 4, name: 'Friend', playlist_count: 32 },
  { id: 5, name: 'Mood', playlist_count: 25 },
  { id: 6, name: 'Soundtrack', playlist_count: 12 },
  { id: 7, name: 'Spanish', playlist_count: 12 },
  { id: 8, name: 'Spiritual', playlist_count: 11 }
];

// Mock playlists data
const playlists = [
  { id: 1, name: 'Piano Classics', category_id: 1, category_name: 'Instrumental', song_count: 12 },
  { id: 2, name: 'Guitar Solos', category_id: 1, category_name: 'Instrumental', song_count: 8 },
  { id: 3, name: 'Violin Concertos', category_id: 1, category_name: 'Instrumental', song_count: 15 },
  { id: 4, name: 'Taylor Swift Collection', category_id: 2, category_name: 'Artist', song_count: 18 },
  { id: 5, name: 'Ed Sheeran Hits', category_id: 2, category_name: 'Artist', song_count: 14 },
  { id: 6, name: 'Queen Classics', category_id: 2, category_name: 'Artist', song_count: 16 },
  { id: 7, name: 'Pop Hits 2023', category_id: 3, category_name: 'Song Collections', song_count: 20 },
  { id: 8, name: 'Classic Rock Anthems', category_id: 3, category_name: 'Song Collections', song_count: 15 },
  { id: 9, name: 'Ray\'s Favorites', category_id: 4, category_name: 'Friend', song_count: 10 },
  { id: 10, name: 'Tobi\'s Mix', category_id: 4, category_name: 'Friend', song_count: 12 },
  { id: 11, name: 'Sad Songs', category_id: 5, category_name: 'Mood', song_count: 8 },
  { id: 12, name: 'Workout Energy', category_id: 5, category_name: 'Mood', song_count: 15 },
  { id: 13, name: 'Lord of the Rings', category_id: 6, category_name: 'Soundtrack', song_count: 18 },
  { id: 14, name: 'Spanish Hits', category_id: 7, category_name: 'Spanish', song_count: 14 },
  { id: 15, name: 'Gospel Collection', category_id: 8, category_name: 'Spiritual', song_count: 10 }
];

// Mock songs data
const songs = [
  // Piano Classics
  { id: 1, title: 'Moonlight Sonata', artist: 'Ludwig van Beethoven', playlist_id: 1 },
  { id: 2, title: 'Clair de Lune', artist: 'Claude Debussy', playlist_id: 1 },
  { id: 3, title: 'Für Elise', artist: 'Ludwig van Beethoven', playlist_id: 1 },
  { id: 4, title: 'Nocturne Op. 9 No. 2', artist: 'Frédéric Chopin', playlist_id: 1 },
  { id: 5, title: 'River Flows in You', artist: 'Yiruma', playlist_id: 1 },
  
  // Guitar Solos
  { id: 6, title: 'Asturias', artist: 'Isaac Albéniz', playlist_id: 2 },
  { id: 7, title: 'Recuerdos de la Alhambra', artist: 'Francisco Tárrega', playlist_id: 2 },
  { id: 8, title: 'Capricho Árabe', artist: 'Francisco Tárrega', playlist_id: 2 },
  
  // Taylor Swift Collection
  { id: 9, title: 'Anti-Hero', artist: 'Taylor Swift', playlist_id: 4 },
  { id: 10, title: 'Cruel Summer', artist: 'Taylor Swift', playlist_id: 4 },
  { id: 11, title: 'Love Story', artist: 'Taylor Swift', playlist_id: 4 },
  { id: 12, title: 'Blank Space', artist: 'Taylor Swift', playlist_id: 4 },
  { id: 13, title: 'Cardigan', artist: 'Taylor Swift', playlist_id: 4 },
  
  // Ed Sheeran Hits
  { id: 14, title: 'Shape of You', artist: 'Ed Sheeran', playlist_id: 5 },
  { id: 15, title: 'Perfect', artist: 'Ed Sheeran', playlist_id: 5 },
  { id: 16, title: 'Thinking Out Loud', artist: 'Ed Sheeran', playlist_id: 5 },
  { id: 17, title: 'Photograph', artist: 'Ed Sheeran', playlist_id: 5 },
  
  // Sad Songs
  { id: 18, title: 'Someone Like You', artist: 'Adele', playlist_id: 11 },
  { id: 19, title: 'Fix You', artist: 'Coldplay', playlist_id: 11 },
  { id: 20, title: 'Hurt', artist: 'Johnny Cash', playlist_id: 11 }
];

// Mock insights data
const insights = {
  collection_overview: {
    total_songs: 4132,
    total_playlists: 286,
    total_categories: 26
  },
  playlist_analysis: {
    length_distribution: {
      mean: 14.45,
      median: 13,
      min: 1,
      max: 100
    }
  },
  category_insights: {
    top_categories: [
      { category: 'Instrumental', playlist_count: 54, song_count: 923 },
      { category: 'Artist', playlist_count: 51, song_count: 737 },
      { category: 'Song Collections', playlist_count: 32, song_count: 455 },
      { category: 'Friend', playlist_count: 32, song_count: 387 },
      { category: 'Mood', playlist_count: 25, song_count: 399 }
    ]
  },
  artist_insights: {
    top_artists: [
      { artist: 'Taylor Swift', song_count: 87 },
      { artist: 'Ed Sheeran', song_count: 65 },
      { artist: 'Adele', song_count: 42 },
      { artist: 'Coldplay', song_count: 38 },
      { artist: 'Queen', song_count: 35 }
    ]
  }
};

// Mock recommendations data
const recommendations = {
  overall_findings: {
    recommended_ideal_length: 15,
    recommended_range: '12-20',
    current_median: 13
  },
  category_highlights: {
    'Instrumental': {
      current_median: 12,
      recommended_ideal: 12,
      recommended_range: '8-16'
    },
    'Artist': {
      current_median: 15,
      recommended_ideal: 15,
      recommended_range: '13-17'
    },
    'Song Collections': {
      current_median: 15,
      recommended_ideal: 15,
      recommended_range: '12-18'
    },
    'Friend': {
      current_median: 11,
      recommended_ideal: 11,
      recommended_range: '8-14'
    },
    'Mood': {
      current_median: 13,
      recommended_ideal: 13,
      recommended_range: '9-17'
    },
    'Soundtrack': {
      current_median: 14,
      recommended_ideal: 14,
      recommended_range: '10-18'
    },
    'Spanish': {
      current_median: 12,
      recommended_ideal: 12,
      recommended_range: '8-16'
    },
    'Spiritual': {
      current_median: 10,
      recommended_ideal: 10,
      recommended_range: '8-12'
    }
  }
};

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
