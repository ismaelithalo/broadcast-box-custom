package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/glimesh/broadcast-box/internal/server/helpers"
	"github.com/google/uuid"
)

const (
	UploadDir     = "uploads"
	MaxUploadSize = 15 << 20 // 15 MB
)

type UploadResponse struct {
	URL      string `json:"url"`
	FileName string `json:"fileName"`
}

func EnsureUploadDir() string {
	_ = os.MkdirAll(UploadDir, 0755)
	return UploadDir
}

var safeFilenameRegexp = regexp.MustCompile(`[^a-zA-Z0-9._-]`)

func UploadHandler(responseWriter http.ResponseWriter, request *http.Request) {
	if request.Method != http.MethodPost {
		helpers.LogHTTPError(responseWriter, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	request.Body = http.MaxBytesReader(responseWriter, request.Body, MaxUploadSize)
	if err := request.ParseMultipartForm(MaxUploadSize); err != nil {
		helpers.LogHTTPError(responseWriter, "File too large (max 15MB)", http.StatusBadRequest)
		return
	}

	file, fileHeader, err := request.FormFile("file")
	if err != nil {
		helpers.LogHTTPError(responseWriter, "Failed to read uploaded file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	validExts := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
		".webp": true,
		".svg":  true,
		".ico":  true,
	}

	if !validExts[ext] {
		helpers.LogHTTPError(responseWriter, "Invalid file type. Allowed: jpg, png, gif, webp, svg, ico", http.StatusBadRequest)
		return
	}

	EnsureUploadDir()

	cleanName := safeFilenameRegexp.ReplaceAllString(filepath.Base(fileHeader.Filename), "_")
	uniqueFilename := fmt.Sprintf("%s_%s", uuid.New().String()[:8], cleanName)
	destinationPath := filepath.Join(UploadDir, uniqueFilename)

	destFile, err := os.Create(destinationPath)
	if err != nil {
		slog.Error("Upload: Failed to create file", "err", err)
		helpers.LogHTTPError(responseWriter, "Failed to save file", http.StatusInternalServerError)
		return
	}
	defer destFile.Close()

	if _, err := io.Copy(destFile, file); err != nil {
		slog.Error("Upload: Failed to copy file content", "err", err)
		helpers.LogHTTPError(responseWriter, "Failed to write file content", http.StatusInternalServerError)
		return
	}

	fileURL := "/uploads/" + uniqueFilename
	slog.Info("Upload: Successfully saved uploaded file", "url", fileURL)

	responseWriter.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(responseWriter).Encode(UploadResponse{
		URL:      fileURL,
		FileName: uniqueFilename,
	})
}
