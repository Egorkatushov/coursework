import { makeAutoObservable, runInAction } from 'mobx'
import { apiClient } from '@/services/api'
import { FavoriteItem, SwaggerSchema } from '@/types'

class FavoriteStore {
  favorites: FavoriteItem[] = []
  isLoading: boolean = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetchFavorites(): Promise<void> {
    this.isLoading = true
    this.error = null

    try {
      const data = await apiClient.getFavorites()
      runInAction(() => {
        this.favorites = data
        this.isLoading = false
      })
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Ошибка загрузки'
        this.isLoading = false
      })
    }
  }

  async addFavorite(name: string, schema: SwaggerSchema): Promise<void> {
    this.isLoading = true

    try {
      await apiClient.addFavorite(name, schema)
      await this.fetchFavorites()
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Ошибка сохранения'
        this.isLoading = false
      })
    }
  }

  async removeFavorite(id: string): Promise<void> {
    try {
      await apiClient.deleteFavorite(id)
      await this.fetchFavorites()
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Ошибка удаления'
      })
    }
  }
}

export const favoriteStore = new FavoriteStore()