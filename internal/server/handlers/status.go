package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"os"

	"github.com/glimesh/broadcast-box/internal/environment"
	"github.com/glimesh/broadcast-box/internal/server/authorization"
	"github.com/glimesh/broadcast-box/internal/server/helpers"
	"github.com/glimesh/broadcast-box/internal/webrtc/sessions/manager"
)

func statusHandler(responseWriter http.ResponseWriter, request *http.Request) {
	streamKey := request.URL.Query().Get("key")

	if streamKey == "" {
		sessionStatusesHandler(responseWriter, request)
	} else {
		streamStatusHandler(responseWriter, request)
	}

	responseWriter.Header().Add("Content-Type", "application/json")
}

func streamStatusHandler(responseWriter http.ResponseWriter, request *http.Request) {
	streamKey := request.URL.Query().Get("key")

	session, ok := manager.SessionsManager.GetSessionByID(streamKey)

	if ok {
		statusResult := session.GetStreamStatus()
		responseWriter.Header().Add("Content-Type", "application/json")
		if err := json.NewEncoder(responseWriter).Encode(statusResult); err != nil {
			helpers.LogHTTPError(
				responseWriter,
				"Internal Server Error",
				http.StatusInternalServerError)
			slog.Error("API.Status Error", "err", err)
		}
		return
	}

	// Session is not live, check if profile exists
	if profile, err := authorization.GetProfileByStreamKey(streamKey); err == nil && profile != nil {
		offlineStatus := map[string]interface{}{
			"streamKey":       streamKey,
			"motd":            profile.MOTD,
			"backgroundImage": profile.BackgroundImage,
			"viewers":         0,
			"isOnline":        false,
		}
		responseWriter.Header().Add("Content-Type", "application/json")
		_ = json.NewEncoder(responseWriter).Encode(offlineStatus)
		return
	}

	slog.Info("Could not find active stream or profile", "streamKey", streamKey)
	helpers.LogHTTPError(
		responseWriter,
		"No active stream found",
		http.StatusNotFound)
}

func sessionStatusesHandler(responseWriter http.ResponseWriter, request *http.Request) {
	if request.Method == "DELETE" {
		return
	}

	if isDisabled := os.Getenv(environment.DisableStatus); isDisabled != "" {
		helpers.LogHTTPError(
			responseWriter,
			"Status Service Unavailable",
			http.StatusServiceUnavailable)

		return
	}

	if err := json.NewEncoder(responseWriter).Encode(manager.SessionsManager.GetSessionStates(false)); err != nil {
		helpers.LogHTTPError(
			responseWriter,
			"Internal Server Error",
			http.StatusInternalServerError)

		slog.Error("Internal Server Error", "err", err)
	}

	responseWriter.Header().Add("Content-Type", "application/json")
}
