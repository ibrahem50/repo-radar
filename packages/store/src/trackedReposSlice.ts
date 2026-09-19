import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';

export interface TrackedRepoInfo {
  id: number;
  fullName: string;
  name: string;
  owner: string;
  avatarUrl: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stargazersCount: number;
  openIssuesCount: number;
}

export interface TrackedReposState {
  repos: Record<string, TrackedRepoInfo>;
}

const initialState: TrackedReposState = {
  repos: {},
};

const trackedReposSlice = createSlice({
  name: 'trackedRepos',
  initialState,
  reducers: {
    trackRepo: (state, action: PayloadAction<TrackedRepoInfo>) => {
      state.repos[action.payload.fullName] = action.payload;
    },
    untrackRepo: (state, action: PayloadAction<string>) => {
      delete state.repos[action.payload];
    },
    hydrateTrackedRepos: (state, action: PayloadAction<Record<string, TrackedRepoInfo>>) => {
      state.repos = action.payload;
    },
  },
});

export const { trackRepo, untrackRepo, hydrateTrackedRepos } = trackedReposSlice.actions;
export const trackedReposReducer = trackedReposSlice.reducer;

const selectRepos = (state: { trackedRepos: TrackedReposState }) => state.trackedRepos.repos;

export const selectTrackedRepoFullNames = createSelector(
  selectRepos,
  (repos) => Object.keys(repos),
);

export const selectTrackedRepos = createSelector(
  selectRepos,
  (repos) => Object.values(repos),
);

export const selectIsTracked = (fullName: string) => (state: { trackedRepos: TrackedReposState }) =>
  fullName in state.trackedRepos.repos;
