# Repo Radar

A dashboard for searching GitHub repositories, tracking favorites, and monitoring their latest stats — stars, open issues, last commit date, and a bar chart of stars across tracked repos.

## Live Demo

Deployed on Vercel: _(https://repo-radar-web-five.vercel.app/)_

---

## Setup

```bash
pnpm install
pnpm dev
```

```bash
pnpm build   # builds all packages + app in dependency order via Turborepo
```

---

## Monorepo Structure

```
apps/
  web/                    React 19 + TypeScript SPA (Vite)
    src/
      app/                store setup, theme, typed hooks
      pages/              SearchPage, TrackedReposPage
      widgets/            RepoListWidget, TrackedRepoListWidget,
                          StatsChartWidget, RepoItem
      features/           search-repositories, track-repository
      shared/             useDebouncedValue and other shared hooks

packages/
  ui/                     Shared MUI components: SearchBar, RepoCard,
                          RepoCardSkeleton, LoadingSkeleton, ErrorState
  charts/                 StarsBarChart — props-only, zero Redux/API knowledge
  github-api/             RTK Query API slice + typed GitHub REST shapes
  store/                  trackedRepos Redux slice + localStorage persistence
  config/                 Shared base tsconfig
```

`apps/web` uses **Feature-Sliced Design**: layers only import downward (`pages → widgets → features → shared`), preventing circular dependencies as the project grows. Packages are each scoped to one concern — `ui` and `charts` have no knowledge of Redux or the API and could be dropped into any other app unchanged.

---

## Architecture & Technical Decisions

### Stack choices

| Decision           | Choice                          | Reason                                                                                                                                                 |
| ------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| State / data layer | Redux Toolkit + RTK Query       | Per-endpoint `isLoading`, `isError`, `data`, `refetch` — maps directly onto the "independent loading/error per repo" requirement with no manual wiring |
| Build tool         | Vite                            | No SSR requirement; fastest dev/build loop for a pure SPA                                                                                              |
| Monorepo tooling   | pnpm workspaces + Turborepo     | Lower setup overhead than Nx at this project's size; dependency-aware build caching                                                                    |
| Charts             | MUI X Charts                    | Stays within the MUI ecosystem already required by the task                                                                                            |
| Debounce           | Custom `useDebouncedValue` hook | One small hook — no lodash dependency needed                                                                                                           |

### State & data layer

**Tracked repos slice** stores the full `TrackedRepoInfo` object (name, owner, avatar, stars, issues, language, description) — not just the `fullName` string. This means:

- The Tracked Repos page renders immediately with zero API calls on mount.
- Stars for the chart come directly from the stored data — no extra network requests.
- The only lazy fetch is the latest commit date, which fires only when the user explicitly clicks Refresh on a card.

**RTK Query lazy queries** (`useLazyGetLatestCommitQuery`) are used for per-card commit fetches. Eager queries (`useGetRepoDetailsQuery`) were intentionally avoided on the tracked page — they would fire for every card on every mount, hitting the rate limit fast.

**Refresh coordination** uses a `refreshSignal` counter: the parent increments it on "Refresh All", each `RepoItem` watches for increases via `useEffect` and fires its own lazy query. An `appliedSignalRef` prevents auto-firing on mount when a signal is already > 0 (e.g., when navigating pages).

### API efficiency

GitHub's search endpoint returns `stargazers_count`, `open_issues_count`, `language`, and `owner.avatar_url` inside each search result item — so no per-card detail fetch is needed after a search. All card stats come from the search response directly.

### Component unification

A single `RepoCard` component and a single `RepoItem` wrapper are used on both the Search and Tracked pages. `RepoItem` handles the lazy commit query, refresh signal, and skeleton state; `RepoCard` is pure UI. The tracked page was previously using a separate `TrackedRepoCard` — this was removed in favour of the unified component.

### Persistence

A `store.subscribe` listener in `app/store.ts` writes the full tracked-repo record to `localStorage` on every change. On app start, the record is rehydrated via `hydrateTrackedRepos`. Old format (string array from earlier versions) is detected and migrated gracefully to an empty state.

## Assumptions & Limitations

- Only **public repositories** are accessible — the token requires no scopes beyond public read.
- GitHub's search API hard-caps results at **1,000 total** regardless of `total_count`; pagination reflects this.
- "Last commit date" is the most recent commit on the **default branch** via `/repos/{owner}/{repo}/commits?per_page=1`. It is not fetched automatically — only on explicit refresh — to avoid rate limit exhaustion.
- Tracked repos are stored **per-browser** in `localStorage`. No account or sync across devices.
- No automated test suite included.
- The stars bar chart shows data as of the last time the repo was tracked or refreshed — it does not live-update.
