package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/glimesh/broadcast-box/internal/server/theme"
)

// Public endpoint to get current theme configuration
func ThemeHandler(responseWriter http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodGet {
		responseWriter.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	responseWriter.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(responseWriter).Encode(theme.GetTheme())
}
