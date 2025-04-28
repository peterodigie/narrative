import PlaylistDetailClient from '../../../playlist_client';
import { get_all_playlists_with_category } from '../../../data';

export default function PlaylistDetailPage({ params }) {
  return <PlaylistDetailClient params={params} />;
}

// This function generates all possible playlist IDs at build time
export async function generateStaticParams() {
  const playlists = get_all_playlists_with_category();
  
  return playlists.map((playlist) => ({
    id: playlist.id.toString(),
  }));
} 