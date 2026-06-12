'use client';

import { useState, ChangeEvent } from 'react';
import {
    Tabs,
    Tab,
    Box,
    TextField,
    Button,
    Alert,
    Typography,
    Paper,
    CircularProgress,
} from '@mui/material';

interface SwaggerUploaderProps {
    isLoading: boolean;
    error: string | null;
    validationErrors: string[];
    onLoadFromUrl: (url: string) => Promise<void>;
    onLoadFromJsonString: (jsonString: string) => void;
    onLoadFromFile: (file: File) => Promise<void>;
}

export function SwaggerUploader({
                                    isLoading,
                                    error,
                                    validationErrors,
                                    onLoadFromUrl,
                                    onLoadFromJsonString,
                                    onLoadFromFile,
                                }: SwaggerUploaderProps) {
    const [tab, setTab] = useState<number>(0);
    const [url, setUrl] = useState<string>('');
    const [jsonText, setJsonText] = useState<string>('');

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        onLoadFromFile(file);
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="По ссылке" />
                <Tab label="Файл" />
                <Tab label="Текст JSON" />
            </Tabs>

            {tab === 0 && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://petstore.swagger.io/v2/swagger.json"
                        disabled={isLoading}
                    />
                    <Button
                        variant="contained"
                        onClick={() => onLoadFromUrl(url)}
                        disabled={isLoading || !url.trim()}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Загрузить'}
                    </Button>
                </Box>
            )}

            {tab === 1 && (
                <Box>
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        disabled={isLoading}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Поддерживаются .json файлы со Swagger/OpenAPI схемой
                    </Typography>
                </Box>
            )}

            {tab === 2 && (
                <Box>
                    <TextField
                        fullWidth
                        multiline
                        rows={8}
                        value={jsonText}
                        onChange={(e) => setJsonText(e.target.value)}
                        placeholder={`{
  "swagger": "2.0",
  "info": { "title": "API", "version": "1.0.0" },
  "paths": {}
}`}
                        disabled={isLoading}
                    />
                    <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        onClick={() => onLoadFromJsonString(jsonText)}
                        disabled={isLoading || !jsonText.trim()}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Парсить JSON'}
                    </Button>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {validationErrors.length > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Найдены проблемы в схеме:</Typography>
                    <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                        {validationErrors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                        ))}
                    </ul>
                </Alert>
            )}
        </Paper>
    );
}