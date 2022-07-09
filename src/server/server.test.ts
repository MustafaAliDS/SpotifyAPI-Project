import { server } from "./index";
import supertest from 'supertest';


const requestWithSupertest = supertest(server);

describe('endpoints', () => {
    describe('GET /', () => {
        it('redirects to `/login`', async () => {
            const res = await requestWithSupertest.get('/');
            expect(res.status).toEqual(302);
        })
    })
})