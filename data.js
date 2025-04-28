// Re-export all data from data_new.js
// This allows us to use the comprehensive dataset from fromMusic_app
// without changing imports across the application

import * as dataNew from './data_new.js';

// Override insights with corrected data
const correctedInsights = {
  collection_overview: {
    total_songs: 4032,
    total_playlists: 287,
    total_categories: 19
  },
  playlist_analysis: dataNew.get_comprehensive_insights().playlist_analysis,
  category_insights: dataNew.get_comprehensive_insights().category_insights,
  artist_insights: dataNew.get_comprehensive_insights().artist_insights
};

// Export functions with corrected data
export function get_categories() {
  return dataNew.get_categories();
}

export function get_all_playlists_with_category() {
  return dataNew.get_all_playlists_with_category();
}

export function get_playlists_by_category(categoryId) {
  return dataNew.get_playlists_by_category(categoryId);
}

export function get_playlist_details(playlistId) {
  return dataNew.get_playlist_details(playlistId);
}

export function get_comprehensive_insights() {
  return correctedInsights;
}

export function get_optimization_recommendations() {
  return dataNew.get_optimization_recommendations();
}
