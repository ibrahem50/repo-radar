import { StarsBarChart, type RepoStarsDatum } from '@repo-radar/charts';
import type { TrackedRepoInfo } from '@repo-radar/store';

export interface StatsChartWidgetProps {
  trackedRepos: TrackedRepoInfo[];
}

export function StatsChartWidget({ trackedRepos }: StatsChartWidgetProps) {
  // Bar labels are the axis categories, so two repos with the same name would
  // collapse into one bar — fall back to owner/name only for those.
  const nameCounts = new Map<string, number>();
  for (const repo of trackedRepos) nameCounts.set(repo.name, (nameCounts.get(repo.name) ?? 0) + 1);

  const data: RepoStarsDatum[] = trackedRepos.map((repo) => ({
    label: (nameCounts.get(repo.name) ?? 0) > 1 ? repo.fullName : repo.name,
    stars: repo.stargazersCount,
  }));

  return <StarsBarChart data={data} />;
}
