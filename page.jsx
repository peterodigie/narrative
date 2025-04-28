"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OptimizationPage() {
  const [insights, setInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch insights
        const insightsRes = await fetch('/playlist/api/insights');
        // Fetch recommendations
        const recommendationsRes = await fetch('/playlist/api/recommendations');
        // Fetch playlists
        const playlistsRes = await fetch('/playlist/api/playlists');
        
        if (!insightsRes.ok || !recommendationsRes.ok || !playlistsRes.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const insightsData = await insightsRes.json();
        const recommendationsData = await recommendationsRes.json();
        const playlistsData = await playlistsRes.json();
        
        setInsights(insightsData);
        setRecommendations(recommendationsData);
        setPlaylists(playlistsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load optimization data. Please try again later.');
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4"><p>Loading optimization data...</p></div>;
  }

  if (error) {
    return <div className="container mx-auto p-4"><p className="text-red-500">{error}</p></div>;
  }

  if (!insights || !recommendations) {
    return <div className="container mx-auto p-4"><p>No optimization data available</p></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Playlist Optimization</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Collection Overview</h2>
          <div className="space-y-2">
            <p><strong>Total Songs:</strong> {insights.collection_overview.total_songs}</p>
            <p><strong>Total Playlists:</strong> {insights.collection_overview.total_playlists}</p>
            <p><strong>Total Categories:</strong> {insights.collection_overview.total_categories}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Playlist Length Analysis</h2>
          <div className="space-y-2">
            <p><strong>Average Length:</strong> {insights.playlist_analysis.length_distribution.mean.toFixed(2)} songs</p>
            <p><strong>Median Length:</strong> {insights.playlist_analysis.length_distribution.median} songs</p>
            <p><strong>Range:</strong> {insights.playlist_analysis.length_distribution.min} - {insights.playlist_analysis.length_distribution.max} songs</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Overall Recommendations</h2>
        <div className="space-y-2">
          <p><strong>Recommended Ideal Length:</strong> {recommendations.overall_findings.recommended_ideal_length} songs</p>
          <p><strong>Recommended Range:</strong> {recommendations.overall_findings.recommended_range}</p>
          <p className="mt-4">These recommendations are based on analysis of your playlist collection, considering factors like listening patterns, genre distribution, and optimal listening session length.</p>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Category-Specific Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(recommendations.category_highlights).map(([category, data]) => (
          <div key={category} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-2 capitalize">{category}</h3>
            <div className="space-y-1">
              <p><strong>Current Median:</strong> {data.current_median} songs</p>
              <p><strong>Recommended Ideal:</strong> {data.recommended_ideal} songs</p>
              <p><strong>Recommended Range:</strong> {data.recommended_range}</p>
            </div>
          </div>
        ))}
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Top Artists</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artist
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Song Count
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {insights.artist_insights.top_artists.map((artist) => (
              <tr key={artist.artist} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {artist.artist}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {artist.song_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-center">
        <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
