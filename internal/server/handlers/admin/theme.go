package admin

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/glimesh/broadcast-box/internal/server/helpers"
	"github.com/glimesh/broadcast-box/internal/server/theme"
)

// Save theme settings from admin portal
func ThemeSaveHandler(responseWriter http.ResponseWriter, request *http.Request) {
	if isValidMethod := verifyValidMethod("POST", responseWriter, request); !isValidMethod {
		return
	}

	sessionResult := verifyAdminSession(request)
	if !sessionResult.IsValid {
		helpers.LogHTTPError(responseWriter, sessionResult.ErrorMessage, http.StatusUnauthorized)
		return
	}

	var newTheme theme.ThemeSettings
	if err := json.NewDecoder(request.Body).Decode(&newTheme); err != nil {
		helpers.LogHTTPError(responseWriter, "Invalid theme payload", http.StatusBadRequest)
		return
	}

	if err := theme.SaveTheme(newTheme); err != nil {
		slog.Error("API.Admin.ThemeSaveHandler Error", "err", err)
		helpers.LogHTTPError(responseWriter, "Failed to save theme", http.StatusInternalServerError)
		return
	}

	responseWriter.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(responseWriter).Encode(newTheme)
}
