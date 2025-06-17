import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env';

let accessToken: string | null = null;
let tokenExpiresAt = 0;

async function authenticate(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }
  const creds = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    throw new Error('Failed to authenticate with Spotify');
  }
  const data = await res.json();
  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return accessToken;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  previewUrl: string | null;
  artworkUrl: string | undefined;
}

async function searchTracks(query: string, limit = 20): Promise<Track[]> {
  const token = await authenticate();
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch tracks');
  }
  const data = await res.json();
  return (data.tracks.items || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    artist: item.artists.map((a: any) => a.name).join(', '),
    previewUrl: item.preview_url,
    artworkUrl: item.album.images[0]?.url,
  }));
}

function decadeToRange(decade: string): string {
  const start = parseInt(decade.slice(0, 4), 10);
  if (Number.isNaN(start)) return '';
  return `${start}-${start + 9}`;
}

export async function getTracks(options: {
  genres?: string[];
  decades?: string[];
  limit?: number;
}): Promise<Track[]> {
  const { genres = [], decades = [], limit = 20 } = options;
  const parts: string[] = [];
  if (genres.length) {
    parts.push(genres.map(g => `genre:%22${g}%22`).join(' OR '));
  }
  if (decades.length) {
    parts.push(decades.map(d => `year:${decadeToRange(d)}`).join(' OR '));
  }
  const query = parts.join(' ');
  return searchTracks(query || '');
}

export { authenticate, searchTracks };
