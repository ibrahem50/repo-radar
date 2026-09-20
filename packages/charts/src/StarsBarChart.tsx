import { useEffect, useState } from 'react';
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
const PLOT_MARGIN = { top: 50, bottom: 110, left: 10, right: 20 };

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
  // Touch tooltips vanish on release (and sit under the finger), so the tapped bar is kept in state.
  const [selected, setSelected] = useState<number | null>(null);

  // Tapping anywhere except a bar dismisses the bubble (bars handle their own toggle).
  useEffect(() => {
    if (selected == null) return;
    const dismiss = (e: PointerEvent) => {
      if (!(e.target as Element).closest('.MuiBarElement-root')) setSelected(null);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [selected]);

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
  const margin = { top: PLOT_MARGIN.top, bottom: PLOT_MARGIN.bottom };
  const xAxis = [{
    dataKey: 'label',
    scaleType: 'band' as const,
    tickLabelInterval: () => true,
    tickLabelStyle: { fontSize: 11, angle: -35, textAnchor: 'end' as const },
  }];

  const selectedDatum = selected == null ? undefined : data[selected];

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
        <Box sx={{ minWidth: data.length * MIN_PX_PER_BAR, position: 'relative' }}>
          <BarChart
            height={height}
            dataset={data}
            margin={{ ...margin, left: PLOT_MARGIN.left, right: PLOT_MARGIN.right }}
            xAxis={xAxis}
            yAxis={[yAxis]}
            series={[{ dataKey: 'stars', label: 'Stars', color: '#00CCCC' }]}
            leftAxis={null}
            // Item trigger fires on tap; the default axis trigger relies on hover
            tooltip={{ trigger: 'item' }}
            onItemClick={(_event, item) =>
              setSelected((prev) => (prev === item.dataIndex ? null : item.dataIndex))
            }
          />
          {selected != null && selectedDatum && (
            // Positioned from the same fixed layout the chart uses (0..max value, known
            // margins), so it sits just above the bar and clear of the finger.
            <Box
              sx={{
                position: 'absolute',
                pointerEvents: 'none',
                left: `calc(${PLOT_MARGIN.left}px + (100% - ${PLOT_MARGIN.left + PLOT_MARGIN.right}px) * ${(selected + 0.5) / data.length})`,
                top:
                  PLOT_MARGIN.top +
                  (1 - selectedDatum.stars / (yAxis.max || 1)) * (height - PLOT_MARGIN.top - PLOT_MARGIN.bottom),
                transform: 'translate(-50%, calc(-100% - 6px))',
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: 'text.primary',
                color: 'background.paper',
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {selectedDatum.stars.toLocaleString()}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
