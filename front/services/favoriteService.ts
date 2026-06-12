import { apiClient } from './api';
import type { FavoriteItem, SwaggerSchema } from '../types';

export class FavoriteService {
    static async getFavorites(): Promise<FavoriteItem[]> {
        return apiClient.getFavorites();
    }

    static async addFavorite(name: string, schema: SwaggerSchema): Promise<FavoriteItem> {
        return apiClient.addFavorite(name, schema);
    }

    static async deleteFavorite(id: string): Promise<{ status: string }> {
        return apiClient.deleteFavorite(id);
    }
}