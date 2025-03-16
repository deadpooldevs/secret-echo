
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "echo-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    console.log('Applying theme:', theme);
    
    // Remove previous theme classes
    root.classList.remove("light", "dark");
    console.log('Removed theme classes');

    // Apply theme class
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      
      console.log('System theme detected:', systemTheme);
      root.classList.add(systemTheme);
      applyThemeColors(systemTheme === "dark");
    } else {
      console.log('Adding theme class:', theme);
      root.classList.add(theme);
      applyThemeColors(theme === "dark");
    }
  }, [theme]);

  // Helper function to apply the greyish-blue theme colors
  function applyThemeColors(isDark: boolean) {
    const root = window.document.documentElement;
    
    if (isDark) {
      // Dark mode greyish-blue theme
      root.style.setProperty('--background', 'hsl(215, 15%, 12%)');
      root.style.setProperty('--foreground', 'hsl(210, 10%, 80%)');
      root.style.setProperty('--primary', 'hsl(210, 70%, 55%)');
      root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 98%)');
      root.style.setProperty('--card', 'hsl(215, 15%, 15%)');
      root.style.setProperty('--card-foreground', 'hsl(210, 10%, 80%)');
      root.style.setProperty('--secondary', 'hsl(215, 15%, 18%)');
      root.style.setProperty('--muted', 'hsl(215, 15%, 20%)');
      root.style.setProperty('--muted-foreground', 'hsl(215, 8%, 65%)');
      root.style.setProperty('--accent', 'hsl(215, 20%, 20%)');
      root.style.setProperty('--accent-foreground', 'hsl(210, 10%, 80%)');
      root.style.setProperty('--border', 'hsl(215, 15%, 25%)');
      root.style.setProperty('--input', 'hsl(215, 15%, 25%)');
      root.style.setProperty('--ring', 'hsl(210, 70%, 40%)');
    } else {
      // Light mode greyish-blue theme
      root.style.setProperty('--background', 'hsl(210, 20%, 98%)');
      root.style.setProperty('--foreground', 'hsl(215, 12%, 25%)');
      root.style.setProperty('--primary', 'hsl(210, 70%, 55%)');
      root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 98%)');
      root.style.setProperty('--card', 'hsl(0, 0%, 100%)');
      root.style.setProperty('--card-foreground', 'hsl(215, 12%, 25%)');
      root.style.setProperty('--secondary', 'hsl(210, 20%, 94%)');
      root.style.setProperty('--muted', 'hsl(210, 20%, 92%)');
      root.style.setProperty('--muted-foreground', 'hsl(215, 8%, 50%)');
      root.style.setProperty('--accent', 'hsl(210, 20%, 90%)');
      root.style.setProperty('--accent-foreground', 'hsl(215, 12%, 25%)');
      root.style.setProperty('--border', 'hsl(215, 8%, 90%)');
      root.style.setProperty('--input', 'hsl(215, 8%, 90%)');
      root.style.setProperty('--ring', 'hsl(210, 70%, 60%)');
    }
  }

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      console.log('Setting theme to:', theme);
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
