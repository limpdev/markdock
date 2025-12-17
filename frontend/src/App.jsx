import React, { useState, useEffect } from 'react';
import './App.css';
import AdvancedChart from './components/AdvancedChart';
import TitleBar from './components/Titlebar'; // <--- Import

import { LoadSettings, SaveSettings } from "../wailsjs/go/main/App";

function App() {
    const [symbol, setSymbol] = useState("NASDAQ:AAPL");
    const [theme, setTheme] = useState("dark");
    const [tempSymbol, setTempSymbol] = useState("NASDAQ:AAPL");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        LoadSettings().then((config) => {
            setSymbol(config.symbol);
            setTempSymbol(config.symbol);
            setTheme(config.theme);
            setIsLoaded(true);
        });
    }, []);

    const handleApply = () => {
        setSymbol(tempSymbol);
        SaveSettings(tempSymbol, theme);
    };

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        SaveSettings(symbol, newTheme);
    };

    if (!isLoaded) return <div className="loading"></div>;

    return (
        <div id="app" className={theme === "dark" ? "app-dark" : "app-light"}>
            
            {/* 1. Add The Custom Title Bar */}
            <TitleBar theme={theme} />

            {/* 2. Control Bar */}
            <div className="control-bar">
                <div className="input-group">
                    <label></label>
                    <input 
                        type="text" 
                        value={tempSymbol}
                        onChange={(e) => setTempSymbol(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                    />
                    <button onClick={handleApply}></button>
                </div>
                
                <div className="actions">
                    <button className="theme-btn" onClick={toggleTheme}>
                        {theme === "dark" ? "Light" : "Dark"}
                    </button>
                </div>
            </div>

            {/* 3. Chart Area */}
            <div className="chart-container">
                <AdvancedChart symbol={symbol} theme={theme} />
            </div>
        </div>
    );
}

export default App;