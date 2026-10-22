import {
  ApiError,
  clearCsrfToken,
  listUsers,
  login,
} from './client';

describe('API client', () => {
  const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
    clearCsrfToken();
  });

  test('sends credentials and serializes server-side list controls', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ items: [], page: 1, pageSize: 5, total: 0 }),
    } as Response);

    await listUsers({ page: 2, pageSize: 5, search: 'Ada', sort: 'name', order: 'asc' });

    const apiBaseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/$/, '');
    expect(fetchMock).toHaveBeenCalledWith(
      `${apiBaseUrl}/api/v1/users?page=2&pageSize=5&search=Ada&sort=name&order=asc`,
      expect.objectContaining({ credentials: 'include' })
    );
  });

  test('stores the CSRF token returned by login and normalizes API failures', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ csrfToken: 'csrf-token-value', user: { id: '1' } }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 409,
        statusText: 'Conflict',
        json: async () => ({ code: 'email_conflict', message: 'Email already exists.' }),
      } as Response);

    await login({ email: 'admin@example.com', password: 'long-enough-password' });

    await expect(listUsers()).rejects.toEqual(
      new ApiError('Email already exists.', 409, 'email_conflict', undefined)
    );
  });
});
