export class UserSettings {

  public static getTheme(): string {
    return localStorage.getItem('theme');
  }

  public static setTheme(theme: string): void {
    localStorage.setItem('theme', theme);
  }
}

