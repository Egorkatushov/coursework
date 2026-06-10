'use client';
import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Alert,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    Tooltip,
    IconButton
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import SqlViewer from './SqlViewer';

export default function SqlParser({ onParse }) {
    const [error, setError] = useState(null);
    const [parsedData, setParsedData] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError(null);

        const reader = new FileReader();
        reader.onload = async (ev) => {
            const sqlContent = ev.target.result;

            const { parseSQL, validateSQL } = await import('../utils/sqlParser');

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