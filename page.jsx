"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { get_comprehensive_insights, get_optimization_recommendations, get_all_playlists_with_category, get_categories } from './data';

export default function OptimizationPage() {
  const [insights, setInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Force synchronous data loading to ensure all data is available before rendering
      // This will fix inconsistent data loading between local and GitHub Pages
      console.log("Loading data...");
      
      // Get all data sources upfront
      const categoriesData = get_categories();
      const insightsData = get_comprehensive_insights();
      const recommendationsData = get_optimization_recommendations();
      const playlistsData = get_all_playlists_with_category();
      
      console.log("Categories loaded:", categoriesData.length);
      console.log("Recommendations categories:", Object.keys(recommendationsData.category_highlights).length);
      
      // Ensure all required data is present
      if (!insightsData || !recommendationsData || !categoriesData || categoriesData.length === 0) {
        throw new Error("Missing required data");
      }
      
      // Store all data in state
      setCategories(categoriesData);
      setInsights(insightsData);
      setRecommendations(recommendationsData);
      setPlaylists(playlistsData);
      setLoading(false);
    } catch (err) {
      console.error('Error getting data:', err);
      setError('Failed to load optimization data. Please try again later.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg">Loading music collection...</p>
      </div>
    </div>;
  }

  if (error) {
    return <div className="container mx-auto p-4"><p className="text-red-500">{error}</p></div>;
  }

  if (!insights || !recommendations || !categories || categories.length === 0) {
    return <div className="container mx-auto p-4"><p>No optimization data available</p></div>;
  }

  return (
    <div className="container mx-auto p-4 bg-mint-50">
      <div className="bg-green-50 p-6 rounded-lg shadow mb-8">
        <h1 className="text-3xl font-bold mb-4">Playlist Optimization Recommendations</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Overall Recommended Playlist Length</h2>
          <h3 className="text-3xl font-bold mb-2">{recommendations.overall_findings.recommended_ideal_length} songs</h3>
          <p className="text-gray-600">Recommended range: {recommendations.overall_findings.recommended_range}</p>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Category-Specific Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(recommendations.category_highlights).map(([category, data]) => (
            <div key={category} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2 text-blue-600">
                <Link href={`/category/${categories.find(c => c.name === category)?.id || '#'}`}>
                  {category}
                </Link>
              </h3>
              <p className="mb-1">Current median: {data.current_median} songs</p>
              <p className="font-medium">Recommended: {data.recommended_ideal} songs</p>
              <p className="text-sm text-gray-600">Range: {data.recommended_range}</p>
            </div>
          ))}
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {categories.map((category) => (
          <Link
            href={`/category/${category.id}`}
            key={category.id}
            className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg">{category.name}</h3>
            <p className="text-gray-600">{category.playlist_count} playlists</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
