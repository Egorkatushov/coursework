import { makeAutoObservable } from "mobx";

class ThemeStore {
  darkMode = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
  }
}

export const themeStore = new ThemeStore();