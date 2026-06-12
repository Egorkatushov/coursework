'use client';

import { Typography, Box, Paper } from '@mui/material';
import { SqlUploader } from '@/components/Sql';

export default function SqlPage() {
    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                SQL визуализатор
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Загрузите SQL файл с CREATE TABLE выражениями для визуализации структуры
                базы данных
            </Typography>

            <Paper sx={{ p: 3 }}>
                <SqlUploader />
            </Paper>
        </Box>
    );
}