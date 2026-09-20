/** Shape returned by both search results and individual repo fetches. */
export interface RepoSummary {
  id: number;
  fullName: string; // "owner/repo" — used as the tracking key everywhere
  name: string;
  owner: string;
  avatarUrl: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stargazersCount: number;
  openIssuesCount: number;
  pushedAt?: string | null;
}

/** Alias kept for semantic clarity; both endpoints return the same fields. */
export type RepoDetails = RepoSummary;

export interface CommitInfo {
  sha: string;
  message: string;
  authoredAt: string | null;
}

/** Raw shapes as returned by api.github.com — kept private to this package. */
export interface GitHubRepoRaw {
  id: number;
  full_name: string;
  name: string;
  owner: { login: string; avatar_url: string };
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  open_issues_count: number;
  pushed_at: string | null;
}

export interface GitHubSearchResponseRaw {
  items: GitHubRepoRaw[];
  total_count: number;
}

/** Paginated search result returned by searchRepos. */
export interface SearchResult {
  items: RepoSummary[];
  /** Capped at 1000 — GitHub's hard limit for the search API. */
  totalCount: number;
}

export interface GitHubCommitRaw {
  sha: string;
  commit: {
    message: string;
    author: { date: string | null } | null;
  };
}
