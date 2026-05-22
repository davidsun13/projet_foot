import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { start_web_server } from '../../Back/src/server.ts';

const mockRepo: any = {
  loginPlayer: vi.fn(async (mail: string, password: string) => {
    return { id_player: 1, surname: 'Paul', name: 'Dupont', mail };
  }),
  saveRefreshToken: vi.fn(async () => ({ id: 1 })),
  registerPlayer: vi.fn(async ({ surname, name, mail }: any) => ({ id_player: 2, surname, name, mail })),
};

let app: any;

beforeAll(async () => {
  app = await start_web_server({ repo: mockRepo, listen: false });
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('Backend API', () => {
  it('POST /login returns accessToken and sets refresh_token cookie', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/login',
      payload: { mail: 'test@mail.test', password: 'secret' },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('user');
    const cookie = res.headers['set-cookie'];
    expect(cookie).toBeDefined();
  });
  it('POST /register creates a user and returns accessToken', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/register',
      payload: {
        surname: 'New',
        name: 'User',
        mail: 'new@mail.test',
        password: 'pw1234',
      },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('user');
  });
});
