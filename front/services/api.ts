import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { AddFavoriteRequest, AddFavoriteResponse, FavoritesResponse, FavoriteItem, SwaggerSchema } from '../types';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async getFavorites(): Promise<FavoriteItem[]> {
        const response: AxiosResponse<FavoritesResponse> = await this.client.get('/favorites');
        return response.data;
    }

    async addFavorite(name: string, schemaData: SwaggerSchema): Promise<FavoriteItem> {
        const request: AddFavoriteRequest = { name, schema_data: schemaData };
        const response: AxiosResponse<AddFavoriteResponse> = await this.client.post('/favorites', request);
        return response.data;
    }

    async deleteFavorite(id: string): Promise<{ status: string }> {
        const response: AxiosResponse<{ status: string }> = await this.client.delete(`/favorites/${id}`);
        return response.data;
    }
}

export const apiClient = new ApiClient();