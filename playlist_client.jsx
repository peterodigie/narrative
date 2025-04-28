"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { get_playlist_details } from './data';

export default function PlaylistDetailClient({ params }) {
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const playlistId = parseInt(params.id);
      
      // Get data directly from the mock data module instead of API fetch
      const playlistData = get_playlist_details(playlistId);
      
      if (playlistData) {
        setPlaylist(playlistData.playlist);
        setSongs(playlistData.songs);
      } else {
        setError('Playlist not found.');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error getting data:', err);
      setError('Failed to load playlist data. Please try again later.');
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return <div className="container mx-auto p-4"><p>Loading playlist data...</p></div>;
  }

  if (error) {
    return <div className="container mx-auto p-4"><p className="text-red-500">{error}</p></div>;
  }

  if (!playlist) {
    return <div className="container mx-auto p-4"><p>Playlist not found</p></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link 
          href={`/playlist/category/${playlist.category_id}`} 
          className="text-blue-500 hover:underline"
        >
          ← Back to {playlist.category_name} Playlists
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
        <p className="text-gray-600 mb-4">Category: {playlist.category_name} • {songs.length} songs</p>
        
        {songs.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Songs</h2>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">#</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Artist</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {songs.map((song, index) => (
                    <tr key={song.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {song.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {song.artist}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic">No songs in this playlist</p>
        )}
      </div>
      
      <div className="flex space-x-4">
        <Link href="/playlist" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </Link>
        <Link href="/playlist/playlists" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
          All Playlists
        </Link>
      </div>
    </div>
  );
} 