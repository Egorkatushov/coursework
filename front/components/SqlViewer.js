'use client';
import dynamic from 'next/dynamic';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LinkIcon from '@mui/icons-material/Link';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function SqlViewer({ tables, links }) {
  const chartOptions = {
    title: { text: 'Связи таблиц', left: 'center' },
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (params.dataType === 'node') {
          return `${params.name}<br/>Колонок: ${tables.find(t => t.name === params.name)?.columns.length || 0}`;
        }
        if (params.dataType === 'edge') {
          return `${params.data.source} → ${params.data.target}`;
        }
        return params.name;
      }
    },
    series: [{
      type: 'graph',
      layout: 'force',
      symbolSize: 50,
      roam: true,
      label: {
        show: true,
        position: 'bottom',
        fontSize: 12
      },
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [0, 10],
      force: {
        repulsion: 500,
        edgeLength: 150,
        gravity: 0.1
      },
      data: tables.map(t => ({
        name: t.name,
        symbolSize: 50,
        itemStyle: {
          color: t.columns.some(c => c.isPrimaryKey) ? '#4caf50' : '#2196f3'
        }
      })),
      links: links.map(l => ({
        source: l.source,
        target: l.target,
        label: {
          show: true,
          formatter: `${l.sourceColumn} → ${l.targetColumn}`
        },
        lineStyle: {
          color: '#ff9800',
          width: 2,
          curveness: 0.3
        }
      })),
      emphasis: {
        focus: 'adjacency'
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3
      }
    }]
  };

  return (
      <Box sx={{ mt: 3 }}>
        {tables.length > 0 && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Визуализация связей</Typography>
              <ReactECharts option={chartOptions} style={{ height: '500px' }} />
            </Paper>
        )}

        <Typography variant="h6" gutterBottom>Таблицы базы данных</Typography>

        {tables.map(table => (
            <Paper key={table.name} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" color="primary">{table.name}</Typography>
                {table.columns.some(c => c.isPrimaryKey) && (
                    <Chip icon={<VpnKeyIcon />} label="PRIMARY KEY" size="small" color="success" variant="outlined" />
                )}
                {table.columns.some(c => c.isForeignKey) && (
                    <Chip icon={<LinkIcon />} label="FOREIGN KEYS" size="small" color="warning" variant="outlined" />
                )}
              </Box>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Поле</TableCell>
                    <TableCell>Тип</TableCell>
                    <TableCell>Ключ</TableCell>
                    <TableCell>Nullable</TableCell>
                    <TableCell>Связь</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {table.columns.map(col => (
                      <TableRow key={col.name} sx={{
                        bgcolor: col.isPrimaryKey ? 'action.hover' : 'inherit'
                      }}>
                        <TableCell>
                          <Typography fontFamily="monospace" fontWeight={col.isPrimaryKey ? 'bold' : 'normal'}>
                            {col.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{col.type}</TableCell>
                        <TableCell>
                          {col.isPrimaryKey && <Chip label="PK" size="small" color="success" />}
                          {col.isForeignKey && !col.isPrimaryKey && <Chip label="FK" size="small" color="warning" />}
                        </TableCell>
                        <TableCell>
                          {col.isNullable ? (
                              <Chip label="Да" size="small" variant="outlined" />
                          ) : (
                              <Chip label="Нет" size="small" color="error" variant="outlined" />
                          )}
                        </TableCell>
                        <TableCell>
                          {col.references && (
                              <Chip
                                  label={`→ ${col.references.table}.${col.references.column}`}
                                  size="small"
                                  color="info"
                                  variant="outlined"
                              />
                          )}
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
        ))}
      </Box>
  );
}