'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [insights, setInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, insightsRes, recommendationsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/insights'),
          fetch('/api/recommendations')
        ]);
        
        const categoriesData = await categoriesRes.json();
        const insightsData = await insightsRes.json();
        const recommendationsData = await recommendationsRes.json();
        
        setCategories(categoriesData);
        setInsights(insightsData);
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your music collection...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Music Collection Manager</h1>
      
      {insights && (
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Collection Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600">Total Songs</p>
              <p className="text-2xl font-bold">{insights.collection_overview.total_songs}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600">Total Playlists</p>
              <p className="text-2xl font-bold">{insights.collection_overview.total_playlists}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600">Categories</p>
              <p className="text-2xl font-bold">{insights.collection_overview.total_categories}</p>
            </div>
          </div>
        </div>
      )}
      
      {recommendations && (
        <div className="bg-green-50 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Playlist Optimization Recommendations</h2>
          <div className="bg-white p-4 rounded shadow mb-4">
            <p className="text-gray-600">Overall Recommended Playlist Length</p>
            <p className="text-2xl font-bold">{recommendations.overall_findings.recommended_ideal_length} songs</p>
            <p className="text-sm text-gray-500">Recommended range: {recommendations.overall_findings.recommended_range}</p>
          </div>
          
          <h3 className="text-lg font-medium mt-6 mb-3">Category-Specific Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(recommendations.category_highlights).map(([category, data]) => (
              <div key={category} className="bg-white p-4 rounded shadow">
                <p className="font-medium text-blue-700">{category}</p>
                <p className="text-sm">Current median: {data.current_median} songs</p>
                <p className="text-sm font-bold">Recommended: {data.recommended_ideal} songs</p>
                <p className="text-xs text-gray-500">Range: {data.recommended_range}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <Link 
              href={`/category/${category.id}`} 
              key={category.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
            >
              <h3 className="font-medium text-blue-700">{category.name}</h3>
              <p className="text-sm text-gray-600">
                {category.playlist_count || 0} playlists
              </p>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            href="/playlists" 
            className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="font-medium text-blue-700">All Playlists</h3>
            <p className="text-sm text-gray-600">
              View and manage all playlists in your collection
            </p>
          </Link>
          <Link 
            href="/optimization" 
            className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="font-medium text-blue-700">Optimization Tool</h3>
            <p className="text-sm text-gray-600">
              Get recommendations for optimizing your playlists
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
