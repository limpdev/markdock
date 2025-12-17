// TradingViewWidget.jsx
	import React, { useEffect, useRef, memo } from 'react';

	function TradingViewWidget() {
	  const container = useRef();

	  useEffect(
		() => {
		  const script = document.createElement("script");
		  script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
		  script.type = "text/javascript";
		  script.async = true;
		  script.innerHTML = `
			{
			  "autosize": true,
			  "symbol": "NASDAQ:AAPL",
			  "interval": "D",
			  "timezone": "exchange",
			  "theme": "light",
			  "style": "0",
			  "locale": "en",
			  "allow_symbol_change": true,
			  "calendar": false,
			  "withdateranges": true,
			  "allow_symbol_change": true,
			  "save_image": false,
			  "details": true,
			  "hotlist": true,
			  "calendar": false,
			  "support_host": "https://www.tradingview.com"
			}`;
		  container.current.appendChild(script);
		},
		[]
	  );

	  return (
		<div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
		  <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
		  <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/" rel="noopener nofollow" target="_blank"><span className="blue-text">AAPL stock chart</span></a><span className="trademark"> by TradingView</span></div>
		</div>
	  );
	}

	export default memo(TradingViewWidget);
