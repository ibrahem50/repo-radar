import { StarsBarChart, type RepoStarsDatum } from '@repo-radar/charts';
import type { TrackedRepoInfo } from '@repo-radar/store';

export interface StatsChartWidgetProps {
  trackedRepos: TrackedRepoInfo[];
}

export function StatsChartWidget({ trackedRepos }: StatsChartWidgetProps) {
  const data: RepoStarsDatum[] = trackedRepos.map((repo) => ({
    label: repo.fullName,
    stars: repo.stargazersCount,
  }));

  return <StarsBarChart data={data} />;
}
