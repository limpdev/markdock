package main

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime" // <--- ADD THIS
)

// App struct
type App struct {
	ctx context.Context
}

// Config struct to hold user preferences
type Config struct {
	Symbol string `json:"symbol"`
	Theme  string `json:"theme"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) shutdown(ctx context.Context) {
	a.SaveSettings("NASDAQ:AAPL", "dark")
	log.Println("Going to sleep...")
	runtime.Quit(a.ctx)
}

// SaveSettings writes the user configuration to a local file
func (a *App) SaveSettings(symbol string, theme string) string {
	config := Config{Symbol: symbol, Theme: theme}
	data, _ := json.MarshalIndent(config, "", "  ")
	_ = os.WriteFile("dockConfig.json", data, 0644)
	return "Settings Saved"
}

// LoadSettings reads the configuration from a local file
func (a *App) LoadSettings(symbol string) Config {
	data, err := os.ReadFile("dockConfig.json")
	if err != nil {
		// Default values if file doesn't exist
		return Config{Symbol: "GOOGL", Theme: "dark"}
	}
	var config Config
	json.Unmarshal(data, &config)
	return config
}
