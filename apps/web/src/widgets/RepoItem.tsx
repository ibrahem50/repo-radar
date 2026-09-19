import { useCallback, useEffect, useRef } from 'react';
import { useLazyGetLatestCommitQuery } from '@repo-radar/github-api';
import { RepoCard, RepoCardSkeleton } from '@repo-radar/ui';
import type { RepoSummary } from '@repo-radar/github-api';

export interface RepoItemProps {
  repo: RepoSummary;
  isTracked: boolean;
  onToggleTrack: (repo: RepoSummary) => void;
  /** Increments each time the parent wants all cards to refresh simultaneously. */
  refreshSignal?: number;
}

function parseCommitError(error: unknown): string {
  const apiMsg = (error as { data?: { message?: string } } | undefined)?.data?.message;
  if (apiMsg) return apiMsg;
  return "Couldn't load commit date.";
}

export function RepoItem({ repo, isTracked, onToggleTrack, refreshSignal = 0 }: RepoItemProps) {
  const [triggerCommit, commitResult] = useLazyGetLatestCommitQuery();

  const handleRefresh = useCallback(() => {
    triggerCommit(repo.fullName);
  }, [repo.fullName, triggerCommit]);

  // Only react to signal increases — not on initial mount.
  const appliedSignalRef = useRef(refreshSignal);
  useEffect(() => {
    if (refreshSignal > appliedSignalRef.current) {
      appliedSignalRef.current = refreshSignal;
      handleRefresh();
    }
  }, [refreshSignal, handleRefresh]);

  if (commitResult.isFetching) {
    return <RepoCardSkeleton />;
  }

  return (
    <RepoCard
      repo={repo}
      isTracked={isTracked}
      onToggleTrack={onToggleTrack}
      latestCommit={commitResult.data}
      isRefreshing={false}
      isRefreshError={commitResult.isError}
      refreshErrorMessage={commitResult.isError ? parseCommitError(commitResult.error) : undefined}
      onRefresh={handleRefresh}
    />
  );
}
