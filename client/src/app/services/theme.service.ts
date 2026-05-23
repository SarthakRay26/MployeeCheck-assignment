import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'evp_theme';
  public theme = signal<Theme>(this.getStoredTheme());

  constructor() {
    effect(() => {
      const currentTheme = this.theme();
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(`${currentTheme}-theme`);
      localStorage.setItem(this.STORAGE_KEY, currentTheme);
    });
  }

  toggle(): void {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  get isDark(): boolean {
    return this.theme() === 'dark';
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme;
    if (stored) return stored;
    // Respect OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
