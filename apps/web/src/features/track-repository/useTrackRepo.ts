import { trackRepo, untrackRepo, selectTrackedRepoFullNames, type TrackedRepoInfo } from '@repo-radar/store';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

export function useTrackRepo() {
  const dispatch = useAppDispatch();
  const trackedFullNames = useAppSelector(selectTrackedRepoFullNames);

  const toggleTrack = (repo: TrackedRepoInfo) => {
    if (trackedFullNames.includes(repo.fullName)) {
      dispatch(untrackRepo(repo.fullName));
    } else {
      dispatch(trackRepo(repo));
    }
  };

  return { trackedFullNames, toggleTrack };
}
