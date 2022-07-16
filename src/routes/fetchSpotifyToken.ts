export async function fetchSpotifyToken<T>(init: RequestInit): Promise<T> {
  const result = await fetch('https://accounts.spotify.com/api/token', init);
  console.log(result);
  return result.json() as Promise<T>;
}
