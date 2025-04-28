// Re-export all data from data_new.js
// This allows us to use the comprehensive dataset from fromMusic_app
// without changing imports across the application

export {
  get_categories,
  get_all_playlists_with_category,
  get_playlists_by_category,
  get_playlist_details,
  get_comprehensive_insights,
  get_optimization_recommendations
} from './data_new.js';
