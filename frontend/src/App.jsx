import React, { useState, useEffect } from 'react'
import './App.css'
import AdvancedChart from './components/AdvancedChart'
import Screener from './components/Screener'
import TitleBar from './components/Titlebar'

import { LoadSettings, SaveSettings } from '../wailsjs/go/main/App'

function App () {
  const [symbol, setSymbol] = useState('NASDAQ:GOOGL')
  const [theme, setTheme] = useState('dark')
  const [tempSymbol, setTempSymbol] = useState('NASDAQ:GOOGL')
  const [isLoaded, setIsLoaded] = useState(false)
  const [view, setView] = useState('chart') // "chart" or "screener"

  useEffect(() => {
    LoadSettings().then(config => {
      setSymbol(config.symbol)
      setTempSymbol(config.symbol)
      setTheme(config.theme)
      setIsLoaded(true)
    })
  }, [])

  const handleApply = () => {
    setSymbol(tempSymbol)
    SaveSettings(tempSymbol, theme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    SaveSettings(symbol, newTheme)
  }

  const toggleView = () => {
    setView(view === 'chart' ? 'screener' : 'chart')
  }

  if (!isLoaded) return <div className='loading'></div>

  return (
    <div id='app' className={theme === 'dark' ? 'app-dark' : 'app-light'}>
      {/* 1. Custom Title Bar */}
      <TitleBar theme={theme} />

      {/* 2. Control Bar */}
      <div className='control-bar'>
        <div className='input-group'>
          <label></label>
          <input
            type='text'
            value={tempSymbol}
            onChange={e => setTempSymbol(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleApply()}
            disabled={view === 'screener'}
          />
          <button onClick={handleApply} disabled={view === 'screener'}>
             
          </button>
        </div>

        <div className='actions'>
          <button className='view-btn' onClick={toggleView}>
            {view === 'chart' ? 'Screener' : 'Chart'}
          </button>
          <button className='theme-btn' onClick={toggleTheme}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className='chart-container'>
        {view === 'chart' ? (
          <AdvancedChart symbol={symbol} theme={theme} />
        ) : (
          <Screener theme={theme} />
        )}
      </div>
    </div>
  )
}

export default App
