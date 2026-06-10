import { makeAutoObservable, runInAction } from "mobx";
import api from "../services/api";

class FavoriteStore {
  favorites = [];

  constructor() {
    makeAutoObservable(this);
  }

  async fetchFavorites() {
    const res = await api.get("/favorites");
    runInAction(() => {
      this.favorites = res.data;
    });
  }

  async addFavorite(name, schema_data) {
    await api.post("/favorites", { name, schema_data });
    this.fetchFavorites();
  }

  async removeFavorite(id) {
    await api.delete(`/favorites/${id}`);
    this.fetchFavorites();
  }
}

export const favoriteStore = new FavoriteStore();