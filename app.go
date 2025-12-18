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
)

// App struct
type App struct {
	ctx         context.Context
	newsCache   *NewsCache
	currentsAPI string
}

// Config struct for settings
type Config struct {
	Symbol string `json:"symbol"`
	Theme  string `json:"theme"`
}

// NewsCache to minimize API calls
type NewsCache struct {
	Data      []byte
	Timestamp time.Time
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		newsCache:   &NewsCache{},
		currentsAPI: "", // Set your Currents API key here or via environment variable
	}
}

// startup is called when the app starts
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// Try to load API key from environment variable
	if apiKey := os.Getenv("CURRENTS_API_KEY"); apiKey != "" {
		a.currentsAPI = apiKey
	}
}

// shutdown is called when the app is closing
func (a *App) shutdown(ctx context.Context) {
	// Cleanup tasks if needed
}

// LoadSettings loads the configuration from file
func (a *App) LoadSettings() Config {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return Config{Symbol: "NASDAQ:GOOGL", Theme: "dark"}
	}

	configPath := filepath.Join(homeDir, ".markdock", "config.json")
	data, err := os.ReadFile(configPath)
	if err != nil {
		return Config{Symbol: "NASDAQ:GOOGL", Theme: "dark"}
	}

	var config Config
	if err := json.Unmarshal(data, &config); err != nil {
		return Config{Symbol: "NASDAQ:GOOGL", Theme: "dark"}
	}

	return config
}

// SaveSettings saves the configuration to file
func (a *App) SaveSettings(symbol, theme string) string {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "Error: " + err.Error()
	}

	configDir := filepath.Join(homeDir, ".markdock")
	if err := os.MkdirAll(configDir, 0755); err != nil {
		return "Error: " + err.Error()
	}

	config := Config{Symbol: symbol, Theme: theme}
	data, err := json.MarshalIndent(config, "", "  ")
	if err != nil {
		return "Error: " + err.Error()
	}

	configPath := filepath.Join(configDir, "config.json")
	if err := os.WriteFile(configPath, data, 0644); err != nil {
		return "Error: " + err.Error()
	}

	return "Settings saved successfully"
}

// FetchNews fetches news from Currents API with caching (60 minute cache)
func (a *App) FetchNews() (string, error) {
	// Check if we have cached data that's less than 60 minutes old
	if a.newsCache.Data != nil && time.Since(a.newsCache.Timestamp) < 60*time.Minute {
		return string(a.newsCache.Data), nil
	}

	// Check if API key is set
	if a.currentsAPI == "" {
		return "", fmt.Errorf("no key")
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
