
export class UserSettings {

    public static theme = 'light';


    public static getTheme(): string {
        return localStorage.getItem('theme');
    }
    public static setTheme(theme: string): void {
        localStorage.setItem('theme', theme);
    }
}

