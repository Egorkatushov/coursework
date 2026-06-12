'use client';

import { Box, Typography, Paper, Chip } from '@mui/material';
import { SwaggerEndpoint } from './SwaggerEndpoint';
import { SwaggerDefinitions } from './SwaggerDefinitions';
import { parseSwaggerSchema } from '../../utils/parsers/swaggerParser';
import type { SwaggerSchema } from '../../types';

interface SwaggerViewerProps {
    data: SwaggerSchema | null;
}

export function SwaggerViewer({ data }: SwaggerViewerProps) {
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

            {/* Эндпоинты */}
            <Typography variant="h6" gutterBottom>
                Эндпоинты
            </Typography>

            {Object.entries(schema.paths).map(([path, methods]) =>
                Object.entries(methods).map(([method, endpoint]) => (
                    <SwaggerEndpoint key={`${path}-${method}`} path={path} method={method} endpoint={endpoint} />
                ))
            )}

            {/* Схемы данных */}
            <SwaggerDefinitions definitions={schema.definitions} />
        </Box>
    );
}