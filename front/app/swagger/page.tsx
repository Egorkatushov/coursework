'use client';

import { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { SwaggerUploader, SwaggerViewer } from '@/components/Swagger';
import { useSwaggerLoader } from '@/hooks/useSwaggerLoader';
import { favoriteStore } from '@/stores/favoriteStore';
import { appStore } from '@/stores/appStore';

export default observer(function SwaggerPage() {
  const {
    schema,
    isLoading,
    error,
    validationErrors,
    loadFromUrl,
    loadFromJsonString,
    loadFromFile,
  } = useSwaggerLoader();

  // Загрузка сохраненной схемы из избранного
  useEffect(() => {
    const saved = appStore.currentSchema;
    if (saved) {
      loadFromJsonString(JSON.stringify(saved));
      appStore.clearCurrentSchema();
    }
  }, [loadFromJsonString]);

  const handleSaveToFavorites = () => {
    if (!schema) {
      alert('Нет загруженной схемы для сохранения');
      return;
    }
    const name = schema.info?.title || 'Новая схема';
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

        <SwaggerUploader
            isLoading={isLoading}
            error={error}
            validationErrors={validationErrors}
            onLoadFromUrl={loadFromUrl}
            onLoadFromJsonString={loadFromJsonString}
            onLoadFromFile={loadFromFile}
        />

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
});