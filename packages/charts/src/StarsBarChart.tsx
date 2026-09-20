import { BarChart } from '@mui/x-charts/BarChart';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export interface RepoStarsDatum {
  label: string;
  stars: number;
  [key: string]: string | number;
}

/** Minimum horizontal space per bar so every label stays visible; the chart scrolls sideways beyond this. */
const MIN_PX_PER_BAR = 70;

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
    <Box sx={{ overflowX: 'auto' }}>
      <Box sx={{ minWidth: data.length * MIN_PX_PER_BAR }}>
    <BarChart
      height={height}
      dataset={data}
      margin={{ left: 70, right: 20, top: 50, bottom: 110 }}
      xAxis={[{
        dataKey: 'label',
        scaleType: 'band',
        tickLabelInterval: () => true,
        tickLabelStyle: { fontSize: 11, angle: -35, textAnchor: 'end' },
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
      // Item trigger fires on tap; the default axis trigger relies on hover
      tooltip={{ trigger: 'item' }}
    />
      </Box>
    </Box>
  );
}
