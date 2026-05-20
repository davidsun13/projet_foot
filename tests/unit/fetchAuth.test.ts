import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAuth } from '../../src/utils/fetchAuth';

const localStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

describe('fetchAuth util', () => {
  beforeEach(() => {
    globalThis.localStorage = localStorageMock() as unknown as Storage;
    globalThis.window = globalThis as unknown as Window;
    globalThis.location = { href: '' } as unknown as Location;
    globalThis.fetch = vi.fn();
  });

  it('sends Authorization header when access token exists', async () => {
    localStorage.setItem('access_token', 'token-123');
    const fakeResponse = { status: 200, ok: true } as unknown as Response;
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(fakeResponse);

    const response = await fetchAuth('http://example.test/api', { method: 'GET' });

    expect(response).toBe(fakeResponse);
    expect(globalThis.fetch).toHaveBeenCalledWith('http://example.test/api', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-123',
      },
    });
  });

  it('refreshes token on 401 and retries the request', async () => {
    const originalResponse = { status: 401, ok: false } as unknown as Response;
    const refreshResponse = {
      ok: true,
      json: vi.fn(async () => ({ accessToken: 'new-token' })),
    } as unknown as Response;
    const finalResponse = { status: 200, ok: true } as unknown as Response;

    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValueOnce(originalResponse);
    fetchMock.mockResolvedValueOnce(refreshResponse);
    fetchMock.mockResolvedValueOnce(finalResponse);

    const result = await fetchAuth('http://example.test/secret', { method: 'POST' });

    expect(result).toBe(finalResponse);
    expect(refreshResponse.json).toHaveBeenCalled();
    expect(localStorage.getItem('access_token')).toBe('new-token');
  });

  it('removes token and redirects when refresh fails', async () => {
    localStorage.setItem('access_token', 'expired-token');
    const unauthResponse = { status: 401, ok: false } as unknown as Response;
    const refreshFailure = { ok: false, status: 401 } as unknown as Response;

    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValueOnce(unauthResponse);
    fetchMock.mockResolvedValueOnce(refreshFailure);

    const response = await fetchAuth('http://example.test/secret', { method: 'GET' });

    expect(response).toBe(unauthResponse);
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(globalThis.location.href).toBe('/connexion');
  });
});
