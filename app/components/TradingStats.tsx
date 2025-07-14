import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { useTranslation } from '~/i18n/TranslationContext';
import { ChevronDownIcon } from 'lucide-react';
import { useNavigate } from '@remix-run/react';

interface TradingStatsItemProps {
  label?: string;
  value: ReactNode;
  subvalue?: string;
  valueColor?: string;
}

const TradingStatsItem: React.FC<TradingStatsItemProps> = ({
  label,
  value,
  subvalue,
  valueColor = 'dc-text-white'
}) => {
  return (
    <div className="dc-w-[180px] dc-px-4 sm:dc-px-6 dc-h-full dc-flex dc-flex-col dc-justify-center dc-gap-4">
      {label ? (
        <>
          <span className="dc-whitespace-nowrap dc-text-[#898D99] dc-text-11 sm:dc-text-sm dc-truncate">{label}</span>
          <span className={`dc-whitespace-nowrap ${valueColor} dc-text-13 sm:dc-text-sm dc-truncate`}>{value}</span>
        </>
      ) : (
        <>
          <span className={`dc-whitespace-nowrap ${valueColor} dc-text-13 sm:dc-text-sm dc-truncate`}>{value}</span>
          <span className="dc-whitespace-nowrap dc-text-[#898D99] dc-text-11 sm:dc-text-sm dc-truncate">{subvalue}</span>
        </>
      )}
    </div>
  );
};

interface TradingStatsProps {
  symbol: string;
}

const TradingStats: React.FC<TradingStatsProps> = ({
  symbol
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  // Available symbols
  const availableSymbols = [
    { symbol: 'BTCUSDT', name: 'Bitcoin', path: '/demo_trading/BTCUSDT' },
    { symbol: 'ETHUSDT', name: 'Ethereum', path: '/demo_trading/ETHUSDT' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside both the trigger and the dropdown container
      const isOutsideTrigger = dropdownRef.current && !dropdownRef.current.contains(target);
      const isOutsideContainer = dropdownContainerRef.current && !dropdownContainerRef.current.contains(target);

      if (isOutsideTrigger && isOutsideContainer) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Ticker data state
  const [tickerData, setTickerData] = useState({
    lastPrice: "0",
    indexPrice: "0",
    price24hPcnt: "0",
    highPrice24h: "0",
    lowPrice24h: "0",
    turnover24h: "0",
    volume24h: "0",
    openInterest: "0",
    fundingRate: "0",
    nextFundingTime: 0
  });

  // Format countdown timer for funding rate
  const [fundingCountdown, setFundingCountdown] = useState("00:00:00");

  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);
  // Store current symbol for unsubscribing
  const currentSymbolRef = useRef<string>(symbol);
  // Flag to track intentional closure
  const intentionalCloseRef = useRef<boolean>(false);

  // Format numbers with commas for display
  const formatNumber = (val: string | number, decimals = 2) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return "0";

    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // Update funding countdown timer
  useEffect(() => {
    const updateFundingCountdown = () => {
      if (tickerData.nextFundingTime > 0) {
        const now = Date.now();
        const diff = tickerData.nextFundingTime - now;

        if (diff > 0) {
          let sec = Math.floor(diff / 1000);
          const h = Math.floor(sec / 3600);
          sec %= 3600;
          const m = Math.floor(sec / 60);
          const s = sec % 60;

          const padZero = (n: number) => n < 10 ? `0${n}` : `${n}`;
          const countdownStr = `${padZero(h)}:${padZero(m)}:${padZero(s)}`;
          setFundingCountdown(countdownStr);
        } else {
          setFundingCountdown("00:00:00");
        }
      }
    };

    const intervalId = setInterval(updateFundingCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [tickerData.nextFundingTime]);

  // Reset ticker data when symbol changes
  useEffect(() => {
    // Reset data when symbol changes
    setTickerData({
      lastPrice: "0",
      indexPrice: "0",
      price24hPcnt: "0",
      highPrice24h: "0",
      lowPrice24h: "0",
      turnover24h: "0",
      volume24h: "0",
      openInterest: "0",
      fundingRate: "0",
      nextFundingTime: 0
    });

    // Clean up the previous connection
    const cleanupPreviousConnection = () => {
      if (wsRef.current) {
        try {
          // Set intentional close flag
          intentionalCloseRef.current = true;

          if (wsRef.current.readyState === WebSocket.OPEN) {
            // Unsubscribe before closing
            wsRef.current.send(JSON.stringify({
              op: "unsubscribe",
              args: [`tickers.${currentSymbolRef.current}`]
            }));
          }

          wsRef.current.close();
          wsRef.current = null;
        } catch (error) {
          console.error('Error closing WebSocket:', error);
        }
      }
    };

    cleanupPreviousConnection();

    // Connect to WebSocket with new symbol
    const connectWebSocket = () => {
      // Update current symbol reference
      currentSymbolRef.current = symbol;

      const ws = new WebSocket('wss://stream.bybit.com/v5/public/linear');

      ws.onopen = () => {
        // console.log(`WebSocket connected for ticker data: ${symbol}`);
        // Subscribe to ticker topic for the current symbol
        ws.send(JSON.stringify({
          op: "subscribe",
          args: [`tickers.${symbol}`]
        }));
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);

          // Check if it's ticker data and matches current symbol reference
          if (parsed.topic &&
            parsed.topic === `tickers.${currentSymbolRef.current}` &&
            parsed.data) {
            const data = parsed.data;

            // Update ticker data state
            setTickerData(prev => ({
              lastPrice: data.lastPrice !== undefined ? data.lastPrice : prev.lastPrice,
              indexPrice: data.indexPrice !== undefined ? data.indexPrice : prev.indexPrice,
              price24hPcnt: data.price24hPcnt !== undefined ? data.price24hPcnt : prev.price24hPcnt,
              highPrice24h: data.highPrice24h !== undefined ? data.highPrice24h : prev.highPrice24h,
              lowPrice24h: data.lowPrice24h !== undefined ? data.lowPrice24h : prev.lowPrice24h,
              turnover24h: data.turnover24h !== undefined ? data.turnover24h : prev.turnover24h,
              volume24h: data.volume24h !== undefined ? data.volume24h : prev.volume24h,
              openInterest: data.openInterest !== undefined ? data.openInterest : prev.openInterest,
              fundingRate: data.fundingRate !== undefined ? data.fundingRate : prev.fundingRate,
              nextFundingTime: data.nextFundingTime !== undefined ? parseInt(data.nextFundingTime, 10) : prev.nextFundingTime
            }));
          }
        } catch (error) {
          console.error('Error processing ticker data:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        // Only attempt to reconnect if not intentionally closed
        if (!intentionalCloseRef.current) {
          // console.log('WebSocket disconnected. Reconnecting...');
          setTimeout(connectWebSocket, 5000);
        } else {
          // Reset the flag for future connections
          intentionalCloseRef.current = false;
        }
      };

      wsRef.current = ws;
    };

    // Small delay to ensure previous connection is fully closed
    setTimeout(connectWebSocket, 100);

    // Cleanup function for component unmount
    return () => {
      intentionalCloseRef.current = true;
      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            op: "unsubscribe",
            args: [`tickers.${currentSymbolRef.current}`]
          }));
        }
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [symbol]);

  // Calculate price change color
  const priceChangeColor = parseFloat(tickerData.price24hPcnt) >= 0 ? "dc-text-[#3FB185]" : "dc-text-[#FF2B64]";

  // Format price change percentage
  const formattedPriceChange = () => {
    const pct = parseFloat(tickerData.price24hPcnt) * 100;
    return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
  };

  // Format funding rate
  const formattedFundingRate = () => {
    const rate = parseFloat(tickerData.fundingRate) * 100;
    return `${rate.toFixed(5)}%`;
  };

  // Handle symbol selection
  const handleSymbolSelect = (selectedSymbol: string, path: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    console.log('Navigating to:', path); // Debug log
    setIsDropdownOpen(false);

    // Try multiple navigation methods
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigate failed, trying window.location:', error);
      window.location.href = path;
    }
  };

  // Get current symbol display name
  const getCurrentSymbolName = () => {
    const current = availableSymbols.find(item => item.symbol === symbol);
    return current ? current.name : symbol === 'BTCUSDT' ? 'Bitcoin' : 'Ethereum';
  };

  return (
    <div className="dc-relative" ref={dropdownContainerRef}>
      <div className="no-scrollbar dc-h-52 dc-flex dc-items-center dc-w-full dc-overflow-x-auto">
        <div className="dc-gap-12 dc-h-52 dc-px-16 dc-flex dc-items-center dc-justify-between dc-w-full dc-overflow-x-auto dc-text-sm dc-bg-gradient-to-br dc-from-[#131416]/80 dc-to-[#0A0A0B]/80">
          <div className="dc-w-[180px] dc-px-4 sm:dc-px-6 dc-h-full dc-flex dc-flex-col dc-justify-center dc-gap-4 dc-relative hover:dc-bg-white hover:dc-bg-opacity-5 dc-border-opacity-20 dc-border dc-border-[#C7AD88] dc-rounded-lg " ref={dropdownRef}>
            <div
              className="dc-flex dc-items-center dc-justify-between dc-p-2 dc--m-2 dc-transition-colors dc-rounded-md dc-cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="dc-flex dc-flex-col dc-gap-1">
                <span className="dc-whitespace-nowrap sm:dc-text-sm dc-text-13 dc-text-white dc-truncate">{symbol?.replace("USDT", "")}/USDT</span>
                <span className="whitespace-nowrap sm:text-sm text-11 text-[#898D99] truncate">{getCurrentSymbolName()}</span>
              </div>
              <ChevronDownIcon
                className={`dc-w-18 dc-h-18 dc-text-[#FDB41D] dc-transition-transform dc-duration-200 ${isDropdownOpen ? 'dc-rotate-180' : ''}`}
              />
            </div>
          </div>
          <span className='dc-border-opacity-6 dc-max-h-40 dc-w-1 dc-h-full dc-border dc-border-white'></span>
          <TradingStatsItem
            value={formatNumber(tickerData.lastPrice, 2)}
            subvalue={formatNumber(tickerData.lastPrice, 2)}
            valueColor="dc-text-[#3FB185]"
          />
          <TradingStatsItem
            label={t('trading.indexPrice')}
            value={formatNumber(tickerData.indexPrice, 2)}
          />
          <TradingStatsItem
            label={t('trading.24hChange')}
            value={formattedPriceChange()}
            valueColor={priceChangeColor}
          />
          <TradingStatsItem
            label={t('trading.24hHigh')}
            value={formatNumber(tickerData.highPrice24h, 2)}
          />
          <TradingStatsItem
            label={t('trading.24hLow')}
            value={formatNumber(tickerData.lowPrice24h, 2)}
          />
          <TradingStatsItem
            label={t('trading.24hTurnover')}
            value={formatNumber(tickerData.turnover24h, 2)}
          />
          <TradingStatsItem
            label={t('trading.24hVolume').replace('CoinName', symbol.replace('USDT', ''))}
            value={formatNumber(tickerData.volume24h, 2)}
          />
          <TradingStatsItem
            label={t('trading.openInterest').replace('()', `(${symbol.replace('USDT', '')})`)}
            value={formatNumber(tickerData.openInterest, 2)}
          />
          <TradingStatsItem
            label={t('trading.fundingRate')}
            value={
              <>
                <span className="dc-text-[#E1E1E1]">{formattedFundingRate()}</span> / {fundingCountdown}
              </>
            }
          />
        </div>
      </div>

      {/* Dropdown positioned outside the overflow container */}
      {isDropdownOpen && (
        <div className="symbol-dropdown dc-absolute dc-top-[72px] dc-left-[16px] dc-mt-2 dc-w-[180px] dc-bg-[#1F2126] dc-border dc-border-[#2A2D34] dc-rounded-md dc-shadow-lg dc-z-50 dc-overflow-hidden">
          {availableSymbols.map((item) => (
            <div
              key={item.symbol}
              className={`dc-px-4 dc-py-3 hover:dc-bg-[#2A2D34] dc-cursor-pointer dc-transition-colors ${item.symbol === symbol ? 'dc-bg-[#2A2D34] dc-text-[#C7AD88]' : 'dc-text-white'
                }`}
              onClick={(event) => handleSymbolSelect(item.symbol, item.path, event)}
            >
              <div className="dc-flex dc-flex-col dc-gap-1">
                <span className="dc-text-sm dc-font-medium">{item.symbol?.replace("USDT", "")}/USDT</span>
                <span className="dc-text-xs dc-text-[#898D99]">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TradingStats; 