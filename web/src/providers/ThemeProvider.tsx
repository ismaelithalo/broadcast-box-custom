import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { getAdminAuthorizationHeader } from "../components/admin/adminAuth";

export interface ThemeSettings {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  fontFamily: string;
  primaryColor: string;
  navbarColor: string;
  backgroundColor: string;
  cardColor: string;
  backgroundMode: "solid" | "gradient" | "image";
  gradientPreset: string;
  customGradient: string;
  backgroundImageUrl: string;
  backgroundOpacity: number;
  backgroundBlur: number;
  defaultLocale: string;
}

export const GRADIENT_PRESETS: Record<string, { name: string; css: string; preview: string }> = {
  none: {
    name: "Nenhum (Cor Sólida)",
    css: "",
    preview: "bg-slate-900",
  },
  midnight: {
    name: "Midnight Aurora",
    css: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)",
    preview: "from-slate-900 via-indigo-950 to-purple-950",
  },
  sunset: {
    name: "Sunset Glow",
    css: "linear-gradient(135deg, #180d2b 0%, #4c1d4a 50%, #831843 100%)",
    preview: "from-purple-950 via-pink-950 to-rose-900",
  },
  cyberpunk: {
    name: "Cyberpunk Neon",
    css: "linear-gradient(135deg, #09090b 0%, #18092e 50%, #032a30 100%)",
    preview: "from-zinc-950 via-purple-950 to-cyan-950",
  },
  ocean: {
    name: "Ocean Deep",
    css: "linear-gradient(135deg, #031b29 0%, #06394e 50%, #0f172a 100%)",
    preview: "from-cyan-950 via-sky-950 to-slate-900",
  },
  emerald: {
    name: "Emerald Forest",
    css: "linear-gradient(135deg, #022013 0%, #064e3b 50%, #091a13 100%)",
    preview: "from-emerald-950 via-teal-900 to-zinc-950",
  },
  obsidian: {
    name: "Obsidian Minimal",
    css: "linear-gradient(180deg, #121214 0%, #1a1a1e 100%)",
    preview: "from-neutral-900 to-neutral-950",
  },
};

export const FONT_PRESETS: Record<string, { name: string; value: string }> = {
  "system-ui": {
    name: "Sistema (Padrão)",
    value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  "inter": {
    name: "Inter (Moderno)",
    value: '"Inter", system-ui, -apple-system, sans-serif',
  },
  "poppins": {
    name: "Poppins (Arredondado)",
    value: '"Poppins", "Segoe UI", system-ui, sans-serif',
  },
  "roboto": {
    name: "Roboto (Limpo)",
    value: '"Roboto", "Helvetica Neue", Arial, sans-serif',
  },
  "monospace": {
    name: "Monospace (Tech / Código)",
    value: '"JetBrains Mono", "Fira Code", Menlo, monospace',
  },
};

export const DEFAULT_THEME: ThemeSettings = {
  siteName: "Broadcast Box",
  logoUrl: "",
  faviconUrl: "/favicon.ico",
  fontFamily: "system-ui",
  primaryColor: "#2563eb",
  navbarColor: "#1f2937",
  backgroundColor: "#0f172a",
  cardColor: "#1e293b",
  backgroundMode: "solid",
  gradientPreset: "none",
  customGradient: "",
  backgroundImageUrl: "",
  backgroundOpacity: 100,
  backgroundBlur: 0,
  defaultLocale: "pt-BR",
};

interface ThemeContextProps {
  theme: ThemeSettings;
  saveTheme: (newTheme: ThemeSettings) => Promise<boolean>;
  refreshTheme: () => Promise<void>;
  getBackgroundStyle: () => React.CSSProperties;
  channelBackground: string | null;
  setChannelBackground: (bg: string | null) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: DEFAULT_THEME,
  saveTheme: async () => false,
  refreshTheme: async () => {},
  getBackgroundStyle: () => ({}),
  channelBackground: null,
  setChannelBackground: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [channelBackground, setChannelBackground] = useState<string | null>(null);

  const applyThemeToDOM = useCallback((t: ThemeSettings) => {
    const root = document.documentElement;

    // Injetar variáveis CSS globais
    root.style.setProperty("--color-primary", t.primaryColor);
    root.style.setProperty("--color-navbar", t.navbarColor);
    root.style.setProperty("--color-bg-base", t.backgroundColor);
    root.style.setProperty("--color-card", t.cardColor);

    const fontValue = FONT_PRESETS[t.fontFamily]?.value || t.fontFamily;
    root.style.setProperty("--font-family-base", fontValue);
    document.body.style.fontFamily = fontValue;

    // Atualizar favicon se fornecido
    if (t.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "shortcut icon";
        document.head.appendChild(link);
      }
      link.href = t.faviconUrl;
    }
  }, []);

  const refreshTheme = useCallback(async () => {
    try {
      const response = await fetch("/api/theme");
      if (response.ok) {
        const data: ThemeSettings = await response.json();
        setTheme(data);
        applyThemeToDOM(data);
      }
    } catch {
      // Se falhar, usa padrão
      applyThemeToDOM(DEFAULT_THEME);
    }
  }, [applyThemeToDOM]);

  useEffect(() => {
    void refreshTheme();
  }, [refreshTheme]);

  const saveTheme = useCallback(
    async (newTheme: ThemeSettings): Promise<boolean> => {
      try {
        const response = await fetch("/api/admin/theme", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: getAdminAuthorizationHeader(),
          },
          body: JSON.stringify(newTheme),
        });

        if (response.ok) {
          const updated: ThemeSettings = await response.json();
          setTheme(updated);
          applyThemeToDOM(updated);
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [applyThemeToDOM]
  );

  const getBackgroundStyle = useCallback((): React.CSSProperties => {
    if (channelBackground) {
      return {
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(${channelBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundColor: theme.backgroundColor,
        minHeight: "100vh",
      };
    }

    const style: React.CSSProperties = {
      backgroundColor: theme.backgroundColor,
      minHeight: "100vh",
    };

    if (theme.backgroundMode === "gradient") {
      if (theme.gradientPreset === "custom" && theme.customGradient) {
        style.backgroundImage = theme.customGradient;
      } else if (GRADIENT_PRESETS[theme.gradientPreset]?.css) {
        style.backgroundImage = GRADIENT_PRESETS[theme.gradientPreset].css;
      }
    } else if (theme.backgroundMode === "image" && theme.backgroundImageUrl) {
      style.backgroundImage = `url(${theme.backgroundImageUrl})`;
      style.backgroundSize = "cover";
      style.backgroundPosition = "center";
      style.backgroundAttachment = "fixed";
    }

    return style;
  }, [channelBackground, theme]);

  const value = useMemo(
    () => ({
      theme,
      saveTheme,
      refreshTheme,
      getBackgroundStyle,
      channelBackground,
      setChannelBackground,
    }),
    [theme, saveTheme, refreshTheme, getBackgroundStyle, channelBackground, setChannelBackground]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
