import { configureStore } from '@reduxjs/toolkit';
import { githubApi } from '@repo-radar/github-api';
import {
  trackedReposReducer,
  hydrateTrackedRepos,
  loadTrackedReposFromStorage,
  saveTrackedReposToStorage,
} from '@repo-radar/store';

export const store = configureStore({
  reducer: {
    trackedRepos: trackedReposReducer,
    [githubApi.reducerPath]: githubApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(githubApi.middleware),
});

store.dispatch(hydrateTrackedRepos(loadTrackedReposFromStorage()));

let previousRepos = store.getState().trackedRepos.repos;
store.subscribe(() => {
  const current = store.getState().trackedRepos.repos;
  if (current !== previousRepos) {
    previousRepos = current;
    saveTrackedReposToStorage(current);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
