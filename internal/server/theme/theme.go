package theme

import (
	"encoding/json"
	"log/slog"
	"os"
	"path/filepath"
	"sync"
)

type ThemeSettings struct {
	SiteName              string `json:"siteName"`
	LogoURL               string `json:"logoUrl"`
	FaviconURL            string `json:"faviconUrl"`
	FontFamily            string `json:"fontFamily"`
	PrimaryColor          string `json:"primaryColor"`
	NavbarColor           string `json:"navbarColor"`
	BackgroundColor       string `json:"backgroundColor"`
	CardColor             string `json:"cardColor"`
	BackgroundMode        string `json:"backgroundMode"` // "solid" | "gradient" | "image"
	GradientPreset        string `json:"gradientPreset"` // "none" | "midnight" | "sunset" | "cyberpunk" | "ocean" | "emerald" | "obsidian" | "custom"
	CustomGradient        string `json:"customGradient"`
	BackgroundImageURL    string `json:"backgroundImageUrl"`
	BackgroundOpacity     int    `json:"backgroundOpacity"` // 0-100
	BackgroundBlur        int    `json:"backgroundBlur"`    // 0-20 (px)
}

var (
	themeLock sync.RWMutex
	themeFile = "data/theme.json"
)

func DefaultTheme() ThemeSettings {
	return ThemeSettings{
		SiteName:           "Broadcast Box",
		LogoURL:            "",
		FaviconURL:         "/favicon.ico",
		FontFamily:         "system-ui",
		PrimaryColor:       "#2563eb",
		NavbarColor:        "#1f2937",
		BackgroundColor:    "#0f172a",
		CardColor:          "#1e293b",
		BackgroundMode:     "solid",
		GradientPreset:     "none",
		CustomGradient:     "",
		BackgroundImageURL: "",
		BackgroundOpacity:  100,
		BackgroundBlur:     0,
	}
}

func GetTheme() ThemeSettings {
	themeLock.RLock()
	defer themeLock.RUnlock()

	data, err := os.ReadFile(themeFile)
	if err != nil {
		return DefaultTheme()
	}

	theme := DefaultTheme()
	if err := json.Unmarshal(data, &theme); err != nil {
		slog.Error("Theme: Failed to unmarshal theme settings, returning default", "err", err)
		return DefaultTheme()
	}

	return theme
}

func SaveTheme(theme ThemeSettings) error {
	themeLock.Lock()
	defer themeLock.Unlock()

	dir := filepath.Dir(themeFile)
	if err := os.MkdirAll(dir, 0755); err != nil {
		slog.Error("Theme: Failed to create theme directory", "err", err)
		return err
	}

	data, err := json.MarshalIndent(theme, "", "  ")
	if err != nil {
		slog.Error("Theme: Failed to marshal theme settings", "err", err)
		return err
	}

	if err := os.WriteFile(themeFile, data, 0644); err != nil {
		slog.Error("Theme: Failed to write theme file", "err", err)
		return err
	}

	slog.Info("Theme: Successfully updated theme settings")
	return nil
}
