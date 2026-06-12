import { makeAutoObservable } from 'mobx'
import { SwaggerSchema } from '../types'

class AppStore {
    currentSchema: SwaggerSchema | null = null

    constructor() {
        makeAutoObservable(this)
    }

    setCurrentSchema(schema: SwaggerSchema | null): void {
        this.currentSchema = schema
    }

    clearCurrentSchema(): void {
        this.currentSchema = null
    }
}

export const appStore = new AppStore()