import React from 'react';
import { WindowMinimise, Quit } from '../../wailsjs/runtime/runtime';
import './comps.css';

const TitleBar = ({ theme }) => {
    return (
        <div className={`titlebar ${theme === 'dark' ? 'titlebar-dark' : 'titlebar-light'}`}>
            {/* Draggable Area - Title/Logo */}
            <div className="titlebar-drag-region">
                <div className="app-icon">
                </div>
                <span className="app-title"></span>
            </div>

            {/* Window Controls (Non-Draggable) */}
            <div className="window-controls">
                <button className="control-btn minimize-btn" onClick={WindowMinimise}>
                    <svg width="8" height="1" viewBox="0 0 10 1">
                        <path d="M0 0h10v1H0z" fill="currentColor" />
                    </svg>
                </button>
                
                <button className="control-btn close-btn" onClick={Quit}>
                    <svg width="8" height="8" viewBox="0 0 10 10">
                        <path d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4-4-4z" fill="currentColor" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TitleBar;