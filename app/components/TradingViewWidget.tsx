// Preload TradingView script in <head> if not already present
function preloadTradingViewScript() {
  if (typeof document === 'undefined') return;
  if (document.querySelector('link[rel="preload"][href="/tradingview/charting_library/tv.js"]')) return;
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = '/tradingview/charting_library/tv.js';
  document.head.appendChild(link);
}
preloadTradingViewScript();
const [loading, setLoading] = React.useState(true);
import React, { useEffect, useRef } from 'react';

// --- Improved Script Loader ---
type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';
let scriptStatus: ScriptStatus = 'idle';
const pendingCallbacks: Array<() => void> = [];

const processCallbacks = (status: ScriptStatus) => {
  scriptStatus = status;
  const callbacks = [...pendingCallbacks];
  pendingCallbacks.length = 0; // Clear queue before executing
  callbacks.forEach(cb => {
    try {
      cb();
    } catch (e) {
      console.error("Error executing TradingView initialization callback", e);
    }
  });
};

const loadTradingViewScript = () => {
  if (scriptStatus === 'loading' || scriptStatus === 'ready') {
    return;
  }

  scriptStatus = 'loading';
  const script = document.createElement('script');
  script.id = 'tradingview-tv-script';
  script.src = '/tradingview/charting_library/tv.js';
  script.async = true;
  script.onload = () => processCallbacks('ready');
  script.onerror = () => {
    processCallbacks('error');
    console.error("Failed to load TradingView script.");
  };
  document.head.appendChild(script);
};
// --- End of Improved Script Loader ---

export default function TradingViewWidget({ symbol }: { symbol: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  const initializeWidget = (containerId: string) => {
    if (!containerRef.current || !window.TradingView || !symbol) {
      console.warn("Cannot initialize widget yet. Conditions not met:", { hasContainer: !!containerRef.current, hasWindowTradingView: !!window.TradingView, hasSymbol: !!symbol });
      return;
    }

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    const formattedSymbol = `BYBIT:${symbol}`;

    try {
      const tvWidget = new window.TradingView.widget({
        autosize: true,
        symbol: formattedSymbol,
        interval: "1",
        timezone: "Asia/Seoul",
        theme: "dark",
        style: "1",
        locale: "ko",
        toolbar_bg: "#131722",
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: containerId,
        hide_side_toolbar: false,
        custom_css_url: "https://example.com/css/tradingview-round.css",
        corner_radius: 20,
        charts_storage_url: 'https://saveload.tradingview.com',
        client_id: 'tradingview.com',
        studies: [],
        disabled_features: [
          "header_indicators", "header_chart_type", "header_settings",
          "header_fundamentals", "header_statistics", "header_markets",
          "header_news", "use_library_charts", "chart_property_page_style",
          "chart_property_page_scales", "chart_property_page_background",
          "chart_property_page_timezone_sessions", "property_pages",
          "volume_force_overlay"
        ],
        enabled_features: ["use_localstorage_for_settings"],
        time_frames: [
          { text: "5y", resolution: "W" }, { text: "1y", resolution: "W" },
          { text: "6분", resolution: "6" }, { text: "3분", resolution: "3" },
          { text: "1분", resolution: "1" }, { text: "5분", resolution: "5" },
        ],
        overrides: {
          "mainSeriesProperties.candleStyle.upColor": "#26A69A",
          "mainSeriesProperties.candleStyle.downColor": "#EF5350",
          "mainSeriesProperties.candleStyle.wickUpColor": "#26A69A",
          "mainSeriesProperties.candleStyle.wickDownColor": "#EF5350",
          "paneProperties.background": "#131722",
          "paneProperties.vertGridProperties.color": "#363c4e",
          "paneProperties.horzGridProperties.color": "#363c4e",
          "scalesProperties.textColor": "#AAA",
          "paneProperties.borderRadius": 20,
          "paneProperties.borderColor": "#1F2126",
        },
      });
      widgetRef.current = tvWidget;
    } catch (error) {
      console.error("Failed to initialize TradingView widget:", error);
      widgetRef.current = null;
    }
  };

  useEffect(() => {
    preloadTradingViewScript();
    setLoading(true);
    if (!symbol) {
      setLoading(false);
      return;
    }

    const createWidget = () => {
      if (!containerRef.current) {
        setLoading(false);
        return;
      }

      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        try {
          widgetRef.current.remove();
        } catch (error) {
          console.error("Error removing previous widget:", error);
        }
        widgetRef.current = null;
      }

      let containerId = containerRef.current.id;
      if (!containerId) {
        containerId = `tradingview_widget_container_${Math.random().toString(36).substring(7)}`;
        containerRef.current.id = containerId;
      }

      initializeWidget(containerId);
      setLoading(false);
    };

    if (scriptStatus === 'ready') {
      createWidget();
    } else {
      pendingCallbacks.push(createWidget);
      loadTradingViewScript();
    }

    return () => {
      const index = pendingCallbacks.indexOf(createWidget);
      if (index > -1) {
        pendingCallbacks.splice(index, 1);
      }

      if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
        try {
          widgetRef.current.remove();
        } catch (error) {
          console.error("Error removing widget during cleanup:", error);
        }
        widgetRef.current = null;
      }
    };
  }, [symbol]);

  return (
    <div
      className="tradingview-widget-container dc-min-h-300 dc-w-full dc-h-full"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '20px',
        border: '1px solid #1F2126',
        position: 'relative'
      }}
    >
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#131722',
          zIndex: 2,
          borderRadius: '20px'
        }}>
          <span style={{ color: '#fff', fontSize: 18 }}>Loading chart...</span>
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '20px'
        }}
      />
    </div>
  );
}

declare global {
  interface Window {
    TradingView: {
      widget: any;
    };
  }
} 