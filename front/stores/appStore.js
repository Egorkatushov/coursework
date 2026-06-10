import { makeAutoObservable, runInAction } from "mobx";
import api from "../services/api";

class AppStore {
    currentSchema = null;
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    setCurrentSchema(schema) {
        this.currentSchema = schema;
        this.error = null;
    }

    clearCurrentSchema() {
        this.currentSchema = null;
        this.error = null;
    }

    setError(error) {
        this.error = error;
    }

    setLoading(loading) {
        this.isLoading = loading;
    }
}

export const appStore = new AppStore();