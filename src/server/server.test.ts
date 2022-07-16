import { server } from './server';
import supertest from 'supertest';
import querystring from 'querystring';
import * as fetchSpotifyTokenModule from '../routes/fetchSpotifyToken';

jest.mock('querystring', () => ({
  stringify: () => jest.fn(),
}));

const requestWithSupertest = supertest(server);

describe('endpoints', () => {
  describe('GET /', () => {
    it('redirects to `/login`', async () => {
      const res = await requestWithSupertest.get('/');
      expect(res.status).toEqual(302);
    });
  });

  describe('GET /login', () => {
    it('redirects to `/callback`', async () => {
      const mockStringify = jest.spyOn(querystring, 'stringify');
      const res = await requestWithSupertest.get('/login');

      expect(res.status).toEqual(302);
      expect(mockStringify).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /callback', () => {
    it('calls `fetchSpotifyToken`', async () => {
      const mockFetchSpotifyToken = jest.spyOn(
        fetchSpotifyTokenModule,
        'fetchSpotifyToken',
      );

      mockFetchSpotifyToken.mockReturnValue({
        data: {
          body: {
            access_token: 'string',
            token_type: 'string',
            scope: 'string',
            expires_in: 'string',
          },
        },
      } as unknown as Promise<unknown>);

      const res = await requestWithSupertest.get('/callback');

      expect(res.status).toEqual(200);
      expect(mockFetchSpotifyToken).toHaveBeenCalledTimes(1);
    });

    it('sends back the spotify response', async () => {
      const mockFetchSpotifyToken = jest.spyOn(
        fetchSpotifyTokenModule,
        'fetchSpotifyToken',
      );

      const mockError = {
        error: 'fooo',
      };

      mockFetchSpotifyToken.mockReturnValue(
        mockError as unknown as Promise<unknown>,
      );

      const res = await requestWithSupertest.get('/callback');
      expect(res.body).toMatchObject(mockError);
    });
  });
});
