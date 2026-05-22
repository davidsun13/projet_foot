import { describe, it, expect, vi } from 'vitest';

vi.mock('argon2', async () => ({
  hash: vi.fn(async () => 'mocked-hash'),
  verify: vi.fn(async () => true),
}));

const { Repository } = await import('../../Back/src/db.ts');

function createFakeSql() {
  const fakeSql = vi.fn(async (strings: TemplateStringsArray | string, ...values: unknown[]) => {
    const query = typeof strings === 'string' ? strings : strings.join('').trim();

    if (query.includes('FROM player WHERE mail')) {
      if (values[0] === 'existing@mail.test') {
        return [{
          id_player: 1,
          surname: 'Paul',
          name: 'Dupont',
          mail: 'existing@mail.test',
          position: null,
          number: null,
          phone: null,
          status: null,
        }];
      }
      return [];
    }

    if (query.includes('INSERT INTO player')) {
      return [{ id_player: 42, surname: values[0], name: values[1], mail: values[2] }];
    }

    if (query.includes('INSERT INTO refresh_tokens')) {
      return [{ id: 1, player_id: values[0], token: values[1], expires_at: values[2] }];
    }

    if (query.includes('SELECT * FROM coach WHERE mail')) {
      return [];
    }

    return [];
  });

  return fakeSql as unknown as any;
}

describe('Repository integration', () => {
  it('registers a new player when the email does not already exist', async () => {
    const fakeSql = createFakeSql();
    const repo = new Repository(fakeSql);
    const user = await repo.registerPlayer({
      surname: 'Paul',
      name: 'Dupont',
      mail: 'new@mail.test',
      phone: null,
      password: 'secret',
    });
    expect(user).toEqual({ id_player: 42, surname: 'Paul', name: 'Dupont', mail: 'new@mail.test' });
    expect(fakeSql).toHaveBeenCalled();
  });

  it('throws when registering a player with an existing email', async () => {
    const fakeSql = createFakeSql();
    const repo = new Repository(fakeSql);

    await expect(
      repo.registerPlayer({
        surname: 'Paul',
        name: 'Dupont',
        mail: 'existing@mail.test',
        phone: null,
        password: 'secret',
      })
    ).rejects.toThrow('Un compte existe déjà avec cet email.');
  });

  it('returns a player record from getPlayerByEmail', async () => {
    const fakeSql = createFakeSql();
    const repo = new Repository(fakeSql);

    const player = await repo.getPlayerByEmail('existing@mail.test');

    expect(player).toEqual({
      id_player: 1,
      surname: 'Paul',
      name: 'Dupont',
      mail: 'existing@mail.test',
      position: null,
      number: null,
      phone: null,
      status: null,
    });
  });
});
