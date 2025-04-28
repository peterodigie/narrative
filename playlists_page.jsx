"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { get_all_playlists_with_category } from './data';

export default function AllPlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Get data directly from the mock data module instead of API fetch
      const playlistsData = get_all_playlists_with_category();
      setPlaylists(playlistsData);
      setLoading(false);
    } catch (err) {
      console.error('Error getting data:', err);
      setError('Failed to load playlists data. Please try again later.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4"><p>Loading playlists data...</p></div>;
  }

  if (error) {
    return <div className="container mx-auto p-4"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">All Playlists</h1>
      
      {playlists.length === 0 ? (
        <p>No playlists found.</p>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Songs</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {playlists.map((playlist) => (
                <tr key={playlist.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {playlist.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Link href={`/category/${playlist.category_id}`} className="text-blue-500 hover:underline">
                      {playlist.category_name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {playlist.song_count}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link href={`/playlist/${playlist.id}`} className="text-blue-600 hover:text-blue-900">
                      View<span className="sr-only">, {playlist.name}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 