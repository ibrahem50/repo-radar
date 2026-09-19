import { BarChart } from '@mui/x-charts/BarChart';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export interface RepoStarsDatum {
  label: string; // repo full name, or short name if you prefer in the caller
  stars: number;
}

export interface StarsBarChartProps {
  data: RepoStarsDatum[];
  height?: number;
}

/**
 * Deliberately has zero knowledge of Redux, RTK Query, or GitHub — it just
 * plots whatever numbers it's handed. Keeps this package reusable outside
 * this app.
 */
export function StarsBarChart({ data, height = 300 }: StarsBarChartProps) {
  if (data.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Track a repo to see its stars here.
        </Typography>
      </Box>
    );
  }

  return (
    <BarChart
      height={height}
      dataset={data}
      margin={{ left: 70, right: 20, top: 50, bottom: 60 }}
      xAxis={[{
        dataKey: 'label',
        scaleType: 'band',
        tickLabelStyle: { fontSize: 11 },
      }]}
      yAxis={[{
        valueFormatter: (v: number) =>
          v >= 1_000_000
            ? `${(v / 1_000_000).toFixed(1)}M`
            : v >= 1_000
            ? `${(v / 1_000).toFixed(0)}k`
            : String(v),
      }]}
      series={[{ dataKey: 'stars', label: 'Stars', color: '#00CCCC' }]}
    />
  );
}
