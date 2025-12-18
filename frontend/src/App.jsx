import React, { useState, useEffect } from 'react'
import './App.css'
import AdvancedChart from './components/AdvancedChart'
import Screener from './components/Screener'
import News from './components/News'
import TitleBar from './components/Titlebar'
import { SolidSearch } from './components/svg/Query'
import { GalaChart } from './components/svg/Chart'

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

  const cycleView = () => {
    const views = ['chart', 'screener', 'news']
    const currentIndex = views.indexOf(view)
    const nextIndex = (currentIndex + 1) % views.length
    setView(views[nextIndex])
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
            disabled={view === 'searchSym'}
          />
          <button onClick={handleApply} disabled={view === 'searchSym'}>
            <SolidSearch />
          </button>
        </div>

        <div className='actions'>
          <button className='view-btn' onClick={cycleView}>
            <GalaChart />
          </button>
          <button className='theme-btn' onClick={toggleTheme}>
            {theme === 'dark' ? '' : ''}
          </button>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className='chart-container'>
        {view === 'chart' && <AdvancedChart symbol={symbol} theme={theme} />}
        {view === 'screener' && <Screener theme={theme} />}
        {view === 'news' && <News symbol={symbol} theme={theme} />}
      </div>
    </div>
  )
}

export default App
