import { useCallback, useEffect, useRef, useState } from 'react';
import { useLazyGetLatestCommitQuery } from '@repo-radar/github-api';
import { RepoCard, RepoCardSkeleton } from '@repo-radar/ui';
import type { RepoSummary } from '@repo-radar/github-api';

export interface RepoItemProps {
  repo: RepoSummary;
  isTracked: boolean;
  onToggleTrack: (repo: RepoSummary) => void;
  refreshSignal?: number;
}

function parseCommitError(error: unknown): string {
  const apiMsg = (error as { data?: { message?: string } } | undefined)?.data?.message;
  if (apiMsg) return apiMsg;
  return "Couldn't load commit date.";
}

export function RepoItem({ repo, isTracked, onToggleTrack, refreshSignal = 0 }: RepoItemProps) {
  const [fetchCommit, { data, isFetching, isError, error }] = useLazyGetLatestCommitQuery();
  const [isManualRefresh, setIsManualRefresh] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsManualRefresh(true);
    fetchCommit(repo.fullName);
  }, [fetchCommit, repo.fullName]);

  // Reset flag once fetch completes
  useEffect(() => {
    if (!isFetching) setIsManualRefresh(false);
  }, [isFetching]);

  const appliedSignalRef = useRef(refreshSignal);
  useEffect(() => {
    if (refreshSignal > appliedSignalRef.current) {
      appliedSignalRef.current = refreshSignal;
      handleRefresh();
    }
  }, [refreshSignal, handleRefresh]);

  if (isFetching && isManualRefresh) {
    return <RepoCardSkeleton />;
  }

  return (
    <RepoCard
      repo={repo}
      isTracked={isTracked}
      onToggleTrack={onToggleTrack}
      latestCommit={data}
      isRefreshing={isFetching && !isManualRefresh}
      isRefreshError={isError}
      refreshErrorMessage={isError ? parseCommitError(error) : undefined}
      onRefresh={handleRefresh}
    />
  );
}
