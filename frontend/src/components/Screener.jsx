import React, { useEffect, useRef, memo } from 'react';

function Screener({ theme, market = "america", defaultScreen = "top_gainers" }) {
  const container = useRef();

  useEffect(() => {
    if (!container.current) return;

    // Clean up existing widget to prevent duplicates when props change
    container.current.innerHTML = "";

    // Create the script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;

    // Construct the config dynamically based on props
    const widgetConfig = {
      market: market,
      showToolbar: true,
      defaultColumn: "overview",
      defaultScreen: top_gainers,
      isTransparent: true,
      locale: "en",
      colorTheme: theme,
      width: "100%",
      height: "100%"
    };

    script.innerHTML = JSON.stringify(widgetConfig);

    // Append
    container.current.appendChild(script);

  }, [theme, market, defaultScreen]); // Re-run this effect if these props change

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/screener/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Stock Screener</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}

export default memo(Screener);