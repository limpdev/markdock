package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx         context.Context
	newsCache   *NewsCache
	currentsAPI string
}

// Config struct for settings
type Config struct {
	Symbol         string `json:"symbol"`
	Theme          string `json:"theme"`
	CurrentsAPIKey string `json:"currents_api_key"`
}

// NewsCache to minimize API calls
type NewsCache struct {
	Data      []byte
	Timestamp time.Time
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		newsCache: &NewsCache{},
		// Default key (optional: remove this if you want to force loading from file/env)
		currentsAPI: "x4rhcGb-T76ATAlZOT-uNnE2m7R51wWFO5NtnBgcb8-bTm-6",
	}
}

// startup is called when the app starts
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// 1. Try Environment Variable (Good for Dev)
	if apiKey := os.Getenv("CURRENTS_API_KEY"); apiKey != "" {
		a.currentsAPI = apiKey
		return
	}

	// 2. Try Loading from Config File (Good for Prod)
	// We reuse LoadSettings here to ensure consistent logic
	config := a.LoadSettings()
	if config.CurrentsAPIKey != "" {
		a.currentsAPI = config.CurrentsAPIKey
		return
	}

	// 3. Fallback: API Key is missing
	// Request the user to input their API key via the frontend
	runtime.EventsEmit(a.ctx, "request-api-key")
}

// getConfigPath returns the platform-specific path to the config file
// macOS: ~/Library/Application Support/MarkDock/config.json
// Windows: %APPDATA%\MarkDock\config.json
func getConfigPath() (string, error) {
	configDir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}

	appDir := filepath.Join(configDir, "MarkDock")

	// Ensure the directory exists
	if err := os.MkdirAll(appDir, 0755); err != nil {
		return "", err
	}

	return filepath.Join(appDir, "config.json"), nil
}

// shutdown is called when the app is closing
func (a *App) shutdown(ctx context.Context) {
	// Cleanup tasks if needed
}

// LoadSettings loads the configuration from file
func (a *App) LoadSettings() Config {
	// Default config
	defaultConfig := Config{Symbol: "NASDAQ:GOOGL", Theme: "dark"}

	configPath, err := getConfigPath()
	if err != nil {
		return defaultConfig
	}

	data, err := os.ReadFile(configPath)
	if err != nil {
		return defaultConfig
	}

	var config Config
	if err := json.Unmarshal(data, &config); err != nil {
		return defaultConfig
	}

	return config
}

// SaveSettings saves the configuration to file
func (a *App) SaveSettings(symbol, theme string) string {
	// 1. Load existing config first to preserve the API Key
	// if we blindly create a new Config{}, we will wipe the Key.
	config := a.LoadSettings()

	// 2. Update fields
	config.Symbol = symbol
	config.Theme = theme

	// 3. Get path
	configPath, err := getConfigPath()
	if err != nil {
		return "Error getting config path: " + err.Error()
	}

	// 4. Marshal and Write
	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return "Error encoding config: " + err.Error()
	}

	if err := os.WriteFile(configPath, data, 0644); err != nil {
		return "Error writing file: " + err.Error()
	}

	return "Settings saved successfully"
}

// SaveAPIKey is a helper you might want to call from the Frontend
// if the user enters their key in the settings modal
func (a *App) SaveAPIKey(apiKey string) string {
	config := a.LoadSettings()
	config.CurrentsAPIKey = apiKey

	// Update the running app instance immediately
	a.currentsAPI = apiKey

	configPath, err := getConfigPath()
	if err != nil {
		return "Error: " + err.Error()
	}

	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return "Error: " + err.Error()
	}

	if err := os.WriteFile(configPath, data, 0644); err != nil {
		return "Error: " + err.Error()
	}

	return "API Key saved successfully"
}

// FetchNews fetches news from Currents API with caching (60 minute cache)
func (a *App) FetchNews() (string, error) {
	// Check if we have cached data that's less than 60 minutes old
	if a.newsCache.Data != nil && time.Since(a.newsCache.Timestamp) < 60*time.Minute {
		return string(a.newsCache.Data), nil
	}

	// Check if API key is set
	if a.currentsAPI == "" {
		return "", fmt.Errorf("API key is missing. Please check settings.")
	}

	// Make API request
	url := fmt.Sprintf("https://api.currentsapi.services/v1/latest-news?apiKey=%s&language=en&category=business", a.currentsAPI)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		return "", fmt.Errorf("failed to fetch news: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API returned status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	// Update cache
	a.newsCache.Data = body
	a.newsCache.Timestamp = time.Now()

	return string(body), nil
}

// GetCachedNewsAge returns how old the cached news is in minutes
func (a *App) GetCachedNewsAge() int {
	if a.newsCache.Data == nil {
		return -1
	}
	return int(time.Since(a.newsCache.Timestamp).Minutes())
}
