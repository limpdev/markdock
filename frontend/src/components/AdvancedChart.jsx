import React, { useEffect, useRef, memo } from 'react';

function AdvancedChart({ symbol, theme, interval = "D" }) {
  const container = useRef();

  useEffect(() => {
    if (!container.current) return;

    // 1. Clean up existing widget to prevent duplicates when props change
    container.current.innerHTML = "";

    // 2. Create the script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    // 3. Construct the config dynamically based on props
    // We use JSON.stringify to safely inject the props into the config object
    const widgetConfig = {
      autosize: true,
      symbol: symbol, // Dynamic Symbol
      interval: interval,
      timezone: "Etc/UTC",
      theme: theme,   // Dynamic Theme
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      hotlist: true,
      details: true,
      studies: [
        "STD;Bollinger_Bands",
        "STD;Historical_Volatility",
        "STD;VWMA"
      ]
    };

    script.innerHTML = JSON.stringify(widgetConfig);

    // 4. Append
    container.current.appendChild(script);

  }, [symbol, theme, interval]); // Re-run this effect if these props change

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
    </div>
  );
}

export default memo(AdvancedChart);