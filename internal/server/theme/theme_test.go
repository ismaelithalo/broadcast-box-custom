package theme

import (
	"os"
	"testing"
)

func TestThemeDefaultsAndSave(t *testing.T) {
	tempDir, err := os.MkdirTemp("", "theme-test-*")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tempDir)

	oldFile := themeFile
	themeFile = tempDir + "/theme.json"
	defer func() { themeFile = oldFile }()

	// Initially without file, should return default theme
	def := GetTheme()
	if def.SiteName != "Broadcast Box" {
		t.Fatalf("expected SiteName 'Broadcast Box', got %s", def.SiteName)
	}
	if def.PrimaryColor != "#2563eb" {
		t.Fatalf("expected PrimaryColor '#2563eb', got %s", def.PrimaryColor)
	}

	// Save custom theme
	custom := def
	custom.SiteName = "My Custom Box"
	custom.PrimaryColor = "#ff0000"
	if err := SaveTheme(custom); err != nil {
		t.Fatalf("failed to save theme: %v", err)
	}

	loaded := GetTheme()
	if loaded.SiteName != "My Custom Box" {
		t.Fatalf("expected SiteName 'My Custom Box', got %s", loaded.SiteName)
	}
	if loaded.PrimaryColor != "#ff0000" {
		t.Fatalf("expected PrimaryColor '#ff0000', got %s", loaded.PrimaryColor)
	}

	// Reset to default
	if err := SaveTheme(DefaultTheme()); err != nil {
		t.Fatalf("failed to reset theme: %v", err)
	}

	restored := GetTheme()
	if restored.SiteName != "Broadcast Box" {
		t.Fatalf("expected restored SiteName 'Broadcast Box', got %s", restored.SiteName)
	}
}
