
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
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      
      // Apply the greyish-blue theme
      root.style.setProperty('--background', systemTheme === 'dark' ? 'hsl(222, 14%, 12%)' : 'hsl(210, 20%, 98%)');
      root.style.setProperty('--foreground', systemTheme === 'dark' ? 'hsl(210, 10%, 80%)' : 'hsl(222, 14%, 20%)');
      root.style.setProperty('--primary', 'hsl(210, 70%, 55%)');
      root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 98%)');
      root.style.setProperty('--card', systemTheme === 'dark' ? 'hsl(222, 14%, 15%)' : 'hsl(0, 0%, 100%)');
      root.style.setProperty('--card-foreground', systemTheme === 'dark' ? 'hsl(210, 10%, 80%)' : 'hsl(222, 14%, 20%)');
      root.style.setProperty('--secondary', systemTheme === 'dark' ? 'hsl(222, 14%, 18%)' : 'hsl(210, 20%, 94%)');
      return;
    }

    root.classList.add(theme);
    
    // Apply the greyish-blue theme
    if (theme === 'dark') {
      root.style.setProperty('--background', 'hsl(222, 14%, 12%)');
      root.style.setProperty('--foreground', 'hsl(210, 10%, 80%)');
      root.style.setProperty('--primary', 'hsl(210, 70%, 55%)');
      root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 98%)');
      root.style.setProperty('--card', 'hsl(222, 14%, 15%)');
      root.style.setProperty('--card-foreground', 'hsl(210, 10%, 80%)');
      root.style.setProperty('--secondary', 'hsl(222, 14%, 18%)');
    } else {
      root.style.setProperty('--background', 'hsl(210, 20%, 98%)');
      root.style.setProperty('--foreground', 'hsl(222, 14%, 20%)');
      root.style.setProperty('--primary', 'hsl(210, 70%, 55%)');
      root.style.setProperty('--primary-foreground', 'hsl(0, 0%, 98%)');
      root.style.setProperty('--card', 'hsl(0, 0%, 100%)');
      root.style.setProperty('--card-foreground', 'hsl(222, 14%, 20%)');
      root.style.setProperty('--secondary', 'hsl(210, 20%, 94%)');
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
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
