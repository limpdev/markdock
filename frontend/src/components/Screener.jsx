import React, { useEffect, useRef, memo } from 'react';

function Screener({ theme }) {
  const container = useRef();

  useEffect(() => {
    if (!container.current) return;

    // Clean up existing widget to prevent duplicates
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;

    const widgetConfig = {
      width: "100%",
      height: "100%",
      defaultColumn: "overview",
      defaultScreen: "general",
      market: "america",
      showToolbar: true,
      colorTheme: theme,
      locale: "en",
      isTransparent: false
    };

    script.innerHTML = JSON.stringify(widgetConfig);
    container.current.appendChild(script);
  }, [theme]); // Re-render when theme changes

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
    </div>
  );
}

export default memo(Screener);