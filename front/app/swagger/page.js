'use client';
import { useState, useEffect } from 'react';
import { Tabs, Tab, Box, TextField, Button, Alert, Typography, Paper } from '@mui/material';
import SwaggerViewer from '../../components/SwaggerViewer';
import { favoriteStore } from '../../stores/favoriteStore';
import { appStore } from '../../stores/appStore';
import { validateSwaggerSchema } from '../../utils/swaggerParser';
import axios from 'axios';

export default function SwaggerPage() {
  const [tab, setTab] = useState(0);
  const [url, setUrl] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [schema, setSchema] = useState(null);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    const saved = appStore.currentSchema;
    if (saved) {
      setSchema(saved);
      appStore.clearCurrentSchema();
    }
  }, []);

  const handleLoadUrl = async () => {
    try {
      setError(null);
      setValidationErrors([]);
      const res = await axios.get(url);
      const errors = validateSwaggerSchema(res.data);
      if (errors.length > 0) {
        setValidationErrors(errors);
      }
      setSchema(res.data);
    } catch (e) {
      setError('Ошибка загрузки URL. Проверьте ссылку и CORS.');
    }
  };

  const handleParseJson = () => {
    try {
      setError(null);
      setValidationErrors([]);
      const parsed = JSON.parse(jsonText);
      const errors = validateSwaggerSchema(parsed);
      if (errors.length > 0) {
        setValidationErrors(errors);
      }
      setSchema(parsed);
    } catch (e) {
      setError(`Ошибка парсинга JSON: ${e.message}`);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        setError(null);
        setValidationErrors([]);
        const parsed = JSON.parse(ev.target.result);
        const errors = validateSwaggerSchema(parsed);
        if (errors.length > 0) {
          setValidationErrors(errors);
        }
        setSchema(parsed);
      } catch (e) {
        setError(`Ошибка в файле: ${e.message}`);
      }
    };
    reader.onerror = () => {
      setError('Ошибка при чтении файла');
    };
    reader.readAsText(file);
  };

  const handleSaveToFavorites = () => {
    const name = schema?.info?.title || 'Новая схема';
    favoriteStore.addFavorite(name, schema);
    alert('Схема сохранена в избранное!');
  };

  return (
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Swagger визуализатор
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Загрузите Swagger/OpenAPI схему для просмотра структуры API
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
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
                />
                <Button variant="contained" onClick={handleLoadUrl}>Загрузить</Button>
              </Box>
          )}

          {tab === 1 && (
              <Box>
                <input type="file" accept=".json" onChange={handleFileUpload} />
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
                    placeholder='{
  "swagger": "2.0",
  "info": { ... },
  "paths": { ... }
}'
                />
                <Button sx={{ mt: 2 }} variant="contained" onClick={handleParseJson}>
                  Парсить JSON
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

        {schema && (
            <Box>
              <Button
                  sx={{ mb: 2 }}
                  color="secondary"
                  variant="contained"
                  onClick={handleSaveToFavorites}
              >
                Сохранить в избранное
              </Button>
              <SwaggerViewer data={schema} />
            </Box>
        )}
      </Box>
  );
}