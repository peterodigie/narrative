"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CategoryPageClient({ params }) {
  const [playlists, setPlaylists] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const categoryId = parseInt(params.id);
        
        // Fetch category playlists
        const playlistsResponse = await fetch(`/playlist/api/category/${categoryId}`);
        if (!playlistsResponse.ok) {
          throw new Error('Failed to fetch playlists');
        }
        const playlistsData = await playlistsResponse.json();
        
        // Get category name from first playlist or fetch categories
        let categoryName = '';
        if (playlistsData.length > 0) {
          categoryName = playlistsData[0].category_name;
        } else {
          const categoriesResponse = await fetch('/playlist/api/categories');
          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            const foundCategory = categoriesData.find(c => c.id === categoryId);
            if (foundCategory) {
              categoryName = foundCategory.name;
            }
          }
        }
        
        setCategory({
          id: categoryId,
          name: categoryName
        });
        setPlaylists(playlistsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load category data. Please try again later.');
        setLoading(false);
      }
    }
    
    fetchData();
  }, [params.id]);

  if (loading) {
    return <div className="container mx-auto p-4"><p>Loading category data...</p></div>;
  }

  if (error) {
    return <div className="container mx-auto p-4"><p className="text-red-500">{error}</p></div>;
  }

  if (!category) {
    return <div className="container mx-auto p-4"><p>Category not found</p></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Categories
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">{category.name} Playlists</h1>
      
      {playlists.length === 0 ? (
        <p>No playlists found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map(playlist => (
            <div key={playlist.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <Link href={`/playlist/${playlist.id}`}>
                <h2 className="text-xl font-semibold mb-2">{playlist.name}</h2>
                <p className="text-gray-600">{playlist.song_count} songs</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
