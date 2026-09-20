import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  RepoSummary,
  RepoDetails,
  CommitInfo,
  SearchResult,
  GitHubRepoRaw,
  GitHubSearchResponseRaw,
  GitHubCommitRaw,
} from './types';

const PER_PAGE = 12;

function mapRepoSummary(raw: GitHubRepoRaw): RepoSummary {
  return {
    id: raw.id,
    fullName: raw.full_name,
    name: raw.name,
    owner: raw.owner.login,
    avatarUrl: raw.owner.avatar_url,
    description: raw.description,
    htmlUrl: raw.html_url,
    language: raw.language,
    stargazersCount: raw.stargazers_count,
    openIssuesCount: raw.open_issues_count,
    pushedAt: raw.pushed_at,
  };
}

function mapLatestCommit(raw: GitHubCommitRaw[]): CommitInfo | null {
  const latest = raw[0];
  if (!latest) return null;
  return {
    sha: latest.sha,
    message: latest.commit.message,
    authoredAt: latest.commit.author?.date ?? null,
  };
}

export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.github.com',
    // GitHub asks for this header; also lets you add an Authorization token
    // later (via an env var) to raise the unauthenticated 60 req/hr limit.
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/vnd.github+json');
      const token = (import.meta as { env?: { VITE_GITHUB_TOKEN?: string } }).env?.VITE_GITHUB_TOKEN;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['RepoDetails', 'Commit'],
  endpoints: (builder) => ({
    searchRepos: builder.query<SearchResult, { query: string; page: number }>({
      query: ({ query, page }) => ({
        url: '/search/repositories',
        params: { q: query, per_page: PER_PAGE, page, sort: 'stars', order: 'desc' },
      }),
      transformResponse: (response: GitHubSearchResponseRaw): SearchResult => ({
        items: response.items.map(mapRepoSummary),
        // GitHub hard-caps search results at 1000
        totalCount: Math.min(response.total_count, 1000),
      }),
    }),

    getRepoDetails: builder.query<RepoDetails, string>({
      query: (fullName) => `/repos/${fullName}`,
      transformResponse: (response: GitHubRepoRaw) => mapRepoSummary(response),
      providesTags: (_result, _error, fullName) => [{ type: 'RepoDetails', id: fullName }],
    }),

    getLatestCommit: builder.query<CommitInfo | null, string>({
      query: (fullName) => ({
        url: `/repos/${fullName}/commits`,
        params: { per_page: 1 },
      }),
      transformResponse: (response: GitHubCommitRaw[]) => mapLatestCommit(response),
      providesTags: (_result, _error, fullName) => [{ type: 'Commit', id: fullName }],
    }),
  }),
});

export const {
  useSearchReposQuery,
  useLazySearchReposQuery,
  useGetRepoDetailsQuery,
  useLazyGetRepoDetailsQuery,
  useGetLatestCommitQuery,
  useLazyGetLatestCommitQuery,
} = githubApi;

/** Invalidate one tracked repo's cached stats + commit, forcing a refetch. */
export function invalidateRepo(fullName: string) {
  return githubApi.util.invalidateTags([
    { type: 'RepoDetails', id: fullName },
    { type: 'Commit', id: fullName },
  ]);
}

/** Invalidate every tracked repo at once — used by "Refresh all". */
export function invalidateRepos(fullNames: string[]) {
  return githubApi.util.invalidateTags([
    ...fullNames.map((id) => ({ type: 'RepoDetails' as const, id })),
    ...fullNames.map((id) => ({ type: 'Commit' as const, id })),
  ]);
}
