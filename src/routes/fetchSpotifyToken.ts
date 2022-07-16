export async function fetchSpotifyToken<T>(init: RequestInit): Promise<T> {
  const result = await fetch('https://accounts.spotify.com/api/token', init);

  return result.json() as Promise<T>;
}
