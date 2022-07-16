import { fetchSpotifyToken } from './fetchSpotifyToken';
global.fetch = jest.fn();
jest
  .spyOn(global, 'fetch')
  .mockImplementation(
    (
      _input: RequestInfo | URL,
      _init?: RequestInit | undefined,
    ): Promise<Response> => {
      return new Promise(resolve => {
        // @ts-expect-error this is a test
        resolve({
          json: () =>
            Promise.resolve({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              data: 'foo',
            } as unknown as Response),
        });
      });
    },
  );

describe('fetchSpotifyToken', () => {
  it('calls `fetch` with the correct argument', async () => {
    const foo = 'foo';
    await fetchSpotifyToken(foo as RequestInit);
    expect(fetch).toHaveBeenCalledWith(
      'https://accounts.spotify.com/api/token',
      foo,
    );
  });
});
