'use client';

import { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    Chip,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { SwaggerEndpoint } from './SwaggerEndpoint';
import { SwaggerDefinitions } from './SwaggerDefinitions';
import { parseSwaggerSchema } from '@/utils/parsers/swaggerParser';
import type { SwaggerSchema, SwaggerEndpoint as SwaggerEndpointType } from '@/types';

interface SwaggerViewerProps {
    data: SwaggerSchema | null;
}

type SortBy = 'method' | 'path';
type GroupBy = 'tags' | 'none';

const METHOD_ORDER: Record<string, number> = {
    get: 1,
    post: 2,
    put: 3,
    delete: 4,
    patch: 5,
    head: 6,
    options: 7,
};

export function SwaggerViewer({ data }: SwaggerViewerProps) {
    const [sortBy, setSortBy] = useState<SortBy>('method');
    const [groupBy, setGroupBy] = useState<GroupBy>('tags');

    if (!data) return null;

    const schema = parseSwaggerSchema(data);

    if (!schema?.paths || Object.keys(schema.paths).length === 0) {
        return (
            <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    Нет данных для отображения. Убедитесь, что схема содержит определения paths.
                </Typography>
            </Paper>
        );
    }

    const allEndpoints = useMemo(() => {
        const endpoints: Array<{
            path: string;
            method: string;
            endpoint: SwaggerEndpointType;
            tags: string[];
        }> = [];

        Object.entries(schema.paths).forEach(([path, methods]) => {
            Object.entries(methods).forEach(([method, endpoint]) => {
                // Если нет тегов, используем 'default'
                const tags = endpoint.tags?.length ? endpoint.tags : ['default'];
                endpoints.push({ path, method, endpoint, tags });
            });
        });

        return endpoints;
    }, [schema.paths]);

    const sortedEndpoints = useMemo(() => {
        const sorted = [...allEndpoints];

        if (sortBy === 'method') {
            sorted.sort((a, b) => {
                const orderA = METHOD_ORDER[a.method.toLowerCase()] || 99;
                const orderB = METHOD_ORDER[b.method.toLowerCase()] || 99;
                if (orderA !== orderB) return orderA - orderB;
                return a.path.localeCompare(b.path);
            });
        } else {
            sorted.sort((a, b) => a.path.localeCompare(b.path));
        }

        return sorted;
    }, [allEndpoints, sortBy]);

    const groupedEndpoints = useMemo(() => {
        if (groupBy === 'none') {
            return { 'Все эндпоинты': sortedEndpoints };
        }

        const groups: Record<string, typeof sortedEndpoints> = {};

        sortedEndpoints.forEach((endpoint) => {
            endpoint.tags.forEach((tag) => {
                if (!groups[tag]) groups[tag] = [];
                groups[tag].push(endpoint);
            });
        });

        const sortedGroups: Record<string, typeof sortedEndpoints> = {};
        const groupNames = Object.keys(groups).sort((a, b) => {
            if (a === 'default') return 1;
            if (b === 'default') return -1;
            return a.localeCompare(b);
        });

        groupNames.forEach((name) => {
            sortedGroups[name] = groups[name];
        });

        return sortedGroups;
    }, [sortedEndpoints, groupBy]);

    return (
        <Box sx={{ mt: 3 }}>
            {/* Информация об API */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {schema.info.title}
                </Typography>
                {schema.info.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {schema.info.description}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {schema.info.version && (
                        <Chip label={`Версия: ${schema.info.version}`} size="small" variant="outlined" />
                    )}
                    {schema.host && <Chip label={`Host: ${schema.host}`} size="small" variant="outlined" />}
                </Box>
            </Paper>

            {/* Панель управления */}
            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                         Группировка:
                    </Typography>
                    <ToggleButtonGroup
                        value={groupBy}
                        exclusive
                        onChange={(_, val) => val && setGroupBy(val)}
                        size="small"
                    >
                        <ToggleButton value="tags">По тегам</ToggleButton>
                        <ToggleButton value="none">Без группировки</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                         Сортировка:
                    </Typography>
                    <ToggleButtonGroup
                        value={sortBy}
                        exclusive
                        onChange={(_, val) => val && setSortBy(val)}
                        size="small"
                    >
                        <ToggleButton value="method">По методу (GET → POST → PUT → DELETE)</ToggleButton>
                        <ToggleButton value="path">По пути</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Paper>

            {/* Эндпоинты с группировкой */}
            <Typography variant="h6" gutterBottom>
                 Эндпоинты
            </Typography>

            {Object.entries(groupedEndpoints).map(([tag, endpoints]) => (
                <Box key={tag} sx={{ mb: 4 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            mb: 2,
                            pb: 1,
                            borderBottom: '2px solid',
                            borderColor: 'divider',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <span></span>
                        {tag === 'default' ? 'Все эндпоинты' : tag}
                        <Chip label={`${endpoints.length}`} size="small" variant="outlined" />
                    </Typography>
                    {endpoints.map(({ path, method, endpoint }) => (
                        <SwaggerEndpoint
                            key={`${path}-${method}`}
                            path={path}
                            method={method}
                            endpoint={endpoint}
                        />
                    ))}
                </Box>
            ))}

            {/* Схемы данных */}
            <SwaggerDefinitions definitions={schema.definitions} />
        </Box>
    );
}