'use client';

import { useState, ChangeEvent } from 'react';
import { Box, Button, Typography, Alert, Paper } from '@mui/material';
import { SqlViewer } from './SqlViewer';
import type { SqlParseResult } from '../../types';

interface SqlUploaderProps {
    onParse?: (result: SqlParseResult) => void;
}

export function SqlUploader({ onParse }: SqlUploaderProps) {
    const [error, setError] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<SqlParseResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = async (ev) => {
            const sqlContent = ev.target?.result as string;

            // Динамический импорт парсера
            const { parseSQL, validateSQL } = await import('../../utils/parsers/sqlParser');

            const errors = validateSQL(sqlContent);
            if (errors.length > 0) {
                setError(errors.join(', '));
                setIsLoading(false);
                return;
            }

            const result = parseSQL(sqlContent);
            setParsedData(result);
            if (onParse) onParse(result);
            setIsLoading(false);
        };

        reader.onerror = () => {
            setError('Ошибка при чтении файла');
            setIsLoading(false);
        };

        reader.readAsText(file);
    };

    return (
        <Box>
            <Box sx={{ mb: 2 }}>
                <input type="file" accept=".sql" onChange={handleFileUpload} disabled={isLoading} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Поддерживаются SQL файлы с CREATE TABLE выражениями
                </Typography>
            </Box>

            {isLoading && <Typography>Загрузка и парсинг...</Typography>}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {parsedData && (
                <>
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Найдено таблиц: {parsedData.tables.length}, связей: {parsedData.links.length}
                    </Alert>
                    <SqlViewer tables={parsedData.tables} links={parsedData.links} />
                </>
            )}
        </Box>
    );
}