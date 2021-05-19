export class UserSettings {

  public static getTheme(): string {
    return localStorage.getItem('theme');
  }

  public static setTheme(theme: string): void {
    localStorage.setItem('theme', theme);
  }

  public static setColor(color: string): void {
    localStorage.setItem('color', color);
  }

  public static getColor(): string {
    return localStorage.getItem('color');
  }
}

