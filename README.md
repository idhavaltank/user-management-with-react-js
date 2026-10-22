# User Management Frontend (TypeScript)

This directory is an isolated TypeScript implementation of the user-management frontend. The existing `frontend/` directory is intentionally not modified by this migration.

## Architecture and SOLID boundaries

- `src/api/httpClient.ts` owns fetch, credentials, CSRF headers, response parsing, and normalized API errors.
- `src/api/authApi.ts` and `src/api/userApi.ts` expose small capability interfaces and receive an `HttpClient` through dependency injection.
- `src/api/client.ts` is a compatibility facade for existing Redux action imports; it composes the default implementations without duplicating endpoint logic.
- `src/redux/` owns application state transitions and async orchestration; it does not own transport details.
- `src/components/`, `src/sections/`, and `src/pages/` own presentation and user interaction.
- `src/theme/` owns MUI theme construction and module augmentation.
- `src/utils/localStorageMigration.ts` is retained only as a one-time migration boundary for legacy browser data. Normal CRUD operations use the backend API.

The design applies single responsibility at module boundaries, interface segregation through `AuthApi`/`UserApi`, dependency inversion through `HttpClient`, and open/closed endpoint factories that can be tested with a fake transport.

## Commands

```bash
npm ci
npm run typecheck
npm run lint
CI=true npm test -- --watchAll=false --runInBand
npm run build
npm start
```

For browser tests, set `FRONTEND_URL` and `API_URL` when running the local frontend and FastAPI backend on non-default ports.
