'use client';

import { useState, ChangeEvent } from 'react';
import {
    Box,
    Typography,
    Alert,
} from '@mui/material';
import SqlViewer from './SqlViewer';
import { parseSQL, validateSQL } from '../utils/sqlParser';
import type { SqlParseResult } from '../types';

interface SqlParserProps {
    onParse?: (result: SqlParseResult) => void;
}

export default function SqlParser({ onParse }: SqlParserProps) {
    const [error, setError] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<SqlParseResult | null>(null);

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        const reader = new FileReader();
        reader.onload = async (ev) => {
            const sqlContent = ev.target?.result as string;

            const errors = validateSQL(sqlContent);
            if (errors.length > 0) {
                setError(errors.join(', '));
                return;
            }

            const result = parseSQL(sqlContent);
            setParsedData(result);
            if (onParse) onParse(result);
        };

        reader.onerror = () => {
            setError('Ошибка при чтении файла');
        };

        reader.readAsText(file);
    };

    return (
        <Box>
            <Box sx={{ mb: 2 }}>
    <input
        type="file"
    accept=".sql"
    onChange={handleFileUpload}
    style={{ marginBottom: 16 }}
    />
    <Typography variant="body2" color="text.secondary">
        Поддерживаются SQL файлы с CREATE TABLE выражениями
    </Typography>
    </Box>

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