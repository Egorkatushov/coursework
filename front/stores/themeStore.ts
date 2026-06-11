import { makeAutoObservable } from 'mobx'

class ThemeStore {
  darkMode: boolean = false

  constructor() {
    makeAutoObservable(this)
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode
  }

  setTheme(mode: boolean): void {
    this.darkMode = mode
  }
}

export const themeStore = new ThemeStore()