'use client';

import { useEffect, useCallback } from 'react';
import { Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { favoriteStore } from '../stores/favoriteStore';
import { appStore } from '../stores/appStore';
import { useRouter } from 'next/navigation';
import type { SwaggerSchema } from '../types';

export default observer(function HomePage() {
    const router = useRouter();

    useEffect(() => {
        const loadFavorites = async () => {
            await favoriteStore.fetchFavorites();
        };
        loadFavorites();
    }, []);

    const openSchema = useCallback((schema: SwaggerSchema) => {
        appStore.setCurrentSchema(schema);
        router.push('/swagger');
    }, [router]);

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                Избранные схемы
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Сохраненные Swagger схемы для быстрого доступа
            </Typography>

            {favoriteStore.favorites.length === 0 && (
                <Typography color="text.secondary">
                    Тут пока пусто. Перейдите в раздел Swagger, чтобы добавить схему в избранное.
                </Typography>
            )}

            <Grid container spacing={3}>
                {favoriteStore.favorites.map((fav) => (
                    <Grid item xs={12} sm={6} md={4} key={fav.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {fav.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    ID: {fav.id.slice(0, 8)}...
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" onClick={() => openSchema(fav.schema)}>
                                    Открыть
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => favoriteStore.removeFavorite(fav.id)}
                                >
                                    Удалить
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
});