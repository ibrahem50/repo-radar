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
const Y_AXIS_WIDTH = 70;

function formatStars(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
  return String(v);
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

  // Two charts share one value range and vertical layout: a fixed one that
  // only draws the y-axis, and a scrolling one that draws the bars.
  const yAxis = {
    min: 0,
    max: Math.max(...data.map((d) => d.stars)),
    valueFormatter: formatStars,
  };
  const margin = { top: 50, bottom: 110 };
  const xAxis = [{
    dataKey: 'label',
    scaleType: 'band' as const,
    tickLabelInterval: () => true,
    tickLabelStyle: { fontSize: 11, angle: -35, textAnchor: 'end' as const },
  }];

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexShrink: 0, width: Y_AXIS_WIDTH }}>
        <BarChart
          height={height}
          width={Y_AXIS_WIDTH}
          dataset={data}
          margin={{ ...margin, left: Y_AXIS_WIDTH, right: 0 }}
          xAxis={xAxis}
          yAxis={[yAxis]}
          series={[{ dataKey: 'stars', color: 'transparent' }]}
          bottomAxis={null}
          tooltip={{ trigger: 'none' }}
          slotProps={{ legend: { hidden: true } }}
        />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0, overflowX: 'auto' }}>
        <Box sx={{ minWidth: data.length * MIN_PX_PER_BAR }}>
          <BarChart
            height={height}
            dataset={data}
            margin={{ ...margin, left: 10, right: 20 }}
            xAxis={xAxis}
            yAxis={[yAxis]}
            series={[{ dataKey: 'stars', label: 'Stars', color: '#00CCCC' }]}
            leftAxis={null}
            // Item trigger fires on tap; the default axis trigger relies on hover
            tooltip={{ trigger: 'item' }}
          />
        </Box>
      </Box>
    </Box>
  );
}
