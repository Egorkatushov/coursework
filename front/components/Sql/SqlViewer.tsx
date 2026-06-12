'use client';

import dynamic from 'next/dynamic';
import { Box, Paper, Typography } from '@mui/material';
import { SqlTableCard } from './SqlTableCard';
import type { SqlTable, SqlLink } from '../../types';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface SqlViewerProps {
    tables: SqlTable[];
    links: SqlLink[];
}

export function SqlViewer({ tables, links }: SqlViewerProps) {
    const chartOptions = {
        title: { text: 'Связи таблиц', left: 'center' },
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                if (params.dataType === 'node') {
                    return `${params.name}<br/>Колонок: ${tables.find((t) => t.name === params.name)?.columns.length || 0}`;
                }
                if (params.dataType === 'edge') {
                    return `${params.data.source} → ${params.data.target}`;
                }
                return params.name;
            },
        },
        series: [
            {
                type: 'graph',
                layout: 'force',
                symbolSize: 50,
                roam: true,
                label: {
                    show: true,
                    position: 'bottom',
                    fontSize: 12,
                },
                edgeSymbol: ['none', 'arrow'],
                edgeSymbolSize: [0, 10],
                force: {
                    repulsion: 500,
                    edgeLength: 150,
                    gravity: 0.1,
                },
                data: tables.map((t) => ({
                    name: t.name,
                    symbolSize: 50,
                    itemStyle: {
                        color: t.columns.some((c) => c.isPrimaryKey) ? '#4caf50' : '#2196f3',
                    },
                })),
                links: links.map((l) => ({
                    source: l.source,
                    target: l.target,
                    label: {
                        show: true,
                        formatter: `${l.sourceColumn} → ${l.targetColumn}`,
                    },
                    lineStyle: {
                        color: '#ff9800',
                        width: 2,
                        curveness: 0.3,
                    },
                })),
                emphasis: {
                    focus: 'adjacency',
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.3,
                },
            },
        ],
    };

    return (
        <Box sx={{ mt: 3 }}>
            {tables.length > 0 && (
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Визуализация связей
                    </Typography>
                    <ReactECharts option={chartOptions} style={{ height: '500px' }} />
                </Paper>
            )}

            <Typography variant="h6" gutterBottom>
                Таблицы базы данных
            </Typography>

            {tables.map((table) => (
                <SqlTableCard key={table.name} table={table} />
            ))}
        </Box>
    );
}
