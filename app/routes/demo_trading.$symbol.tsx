import { useParams } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isAuthenticated } from "~/api/auth";
import { postUseItem } from "~/api/item";
import { postOrders, putOrders } from "~/api/order";
import { getUserAssets, putUserAssets } from "~/api/user_assets";
import { getUserItems } from "~/api/user_items";
import { getAllUserOrders, UserOrder } from "~/api/user_orders";
import { getAllUserPnls } from "~/api/user_pnls";
import { getUserPositions } from "~/api/user_positions";
import Alert from "~/components/Alert";
import { useSocket } from "~/contexts/SocketContext";
import { useMockInvestmentConfig } from "~/hooks/useMockInvestmentConfig";
import Desktop from "~/pages/demo_trading/Desktop";
import Ipad from "~/pages/demo_trading/Ipad";
import Mobile from "~/pages/demo_trading/Mobile";
import useCommonStore from "~/store/commonStore";
import useModalStore from "~/store/modalStore";
import useOrderStore from "~/store/orderStore";
import usePnlStore from "~/store/pnlStore";
import usePositionStore, { Position } from "~/store/positionStore";
import { UserAssets, useUserAssetsStore } from "~/store/userAssetsStore";
import { useUserItemsStore } from "~/store/userItemsStore";
import useUserStore from "~/store/userStore";
import { updateUserLevel } from "~/utils/levelCalculator";

interface OrderBookEntry {
  price: string;
  qty: string;
  total: string;
}

interface OrderBookRawEntry {
  price: number;
  qty: number;
  total: number;
}

// Add new interface for processed order book entries
interface ProcessedOrderBookEntry extends OrderBookEntry {
  rawTotal: number;
  percentRatio: number;
}

// Add state for recent trades
interface RecentTrade {
  price: string;
  qty: string;
  time: string;
  type: 'buy' | 'sell';
}

// Add a new interface for tracking all symbol prices
interface SymbolPrice {
  symbol: string;
  price: number;
}

// Add debounce utility function
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Add throttle utility function
const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return (...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export default function SymbolTradingPage() {
  const { user, isHydrated } = useUserStore((state) => state);
  const { userAssets, setUserAssets } = useUserAssetsStore();
  const { orders, setOrders } = useOrderStore();
  const { positions, setPositions } = usePositionStore();
  const { pnls, setPnls } = usePnlStore();
  const { userItems, setUserItems } = useUserItemsStore();
  const { isSoundMute, setIsSoundMute } = useCommonStore();
  const { setIsOpenSignInModal } = useModalStore();
  const { config: mockConfig } = useMockInvestmentConfig();
  const socket = useSocket();
  const params = useParams();
  const symbol = params.symbol || "BTCUSDT"; // Default to BTCUSDT if no symbol is provided

  const [orderType, setOrderType] = useState<"LIMIT" | "MARKET">("LIMIT");
  const [currentPrice, setCurrentPrice] = useState(2467.74);
  const [avgPrice, setAvgPrice] = useState(2467.74);
  const [orderPrice, setOrderPrice] = useState(0);
  const [qty, setQty] = useState(1);
  const [qtyInput, setQtyInput] = useState("1");
  const [calculatedPercentage, setCalculatedPercentage] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [buySize, setBuySize] = useState(0);
  const [sellSize, setSellSize] = useState(0);
  const [direction, setDirection] = useState("Long");
  const [activeOrderTab, setActiveOrderTab] = useState("Position");
  const [cancelOrder, setCancelOrder] = useState<UserOrder | null>(null);

  // Pagination states
  const [orderHistoryPage, setOrderHistoryPage] = useState(1);
  const [pnlPage, setPnlPage] = useState(1);
  const orderHistoryItemsPerPage = 5;
  const [orderHistoryTotal, setOrderHistoryTotal] = useState(0);
  const [pnlTotal, setPnlTotal] = useState(0);
  const pnlItemsPerPage = 5;

  // Reset pagination when tab changes - we'll handle this differently

  // Add state for dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("0.01");
  // Add state for active display tab (Order Book or Recent Trades)
  const [activeDisplayTab, setActiveDisplayTab] = useState("Order Book");
  const [orderbookMode, setOrderbookMode] = useState(1);
  // Add state for price interval
  // const [priceInterval, setPriceInterval] = useState<0.1 | 1>(0.1);
  const priceIntervalRef = useRef<0.1 | 1>(0.1);
  const orderBookDepthRef = useRef(11);

  // Modal
  const [isSelectMarginModalOpen, setIsSelectMarginModalOpen] = useState(false);
  const [isSelectLeverageModalOpen, setIsSelectLeverageModalOpen] = useState(false);
  const [isBuySellModalOpen, setIsBuySellModalOpen] = useState(false);
  const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);
  const [isCancelAllOrderModalOpen, setIsCancelAllOrderModalOpen] = useState(false);
  const [isLimitCloseModalOpen, setIsLimitCloseModalOpen] = useState(false);
  const [isMarketCloseModalOpen, setIsMarketCloseModalOpen] = useState(false);
  const [isCloseAllModalOpen, setIsCloseAllModalOpen] = useState(false);
  const [selectedPositionQuantity, setSelectedPositionQuantity] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [isPriceBid, setIsPriceBid] = useState(true);

  // Add state for USDT Recharge modal
  const [isUseModalOpen, setIsUseModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{id: number, name: string, quantity: number, itemId: number}>({
    id: 0,
    name: "",
    quantity: 0,
    itemId: 0
  });
  const [isUseLoading, setIsUseLoading] = useState(false);


  // Initialize with 11 empty orders (changed from 12)
  const defaultOrders = Array(orderBookDepthRef.current).fill({ price: "0", qty: "0", total: "0", percentRatio: 0, rawTotal: 0 });
  const [askOrders, setAskOrders] = useState<ProcessedOrderBookEntry[]>(defaultOrders);
  const [bidOrders, setBidOrders] = useState<ProcessedOrderBookEntry[]>(defaultOrders);
  const ordersRef = useRef<UserOrder[]>(orders);
  const wsRef = useRef<WebSocket | null>(null);
  const processedOrderIds = useRef<Set<number>>(new Set());
  
  // Add storage for raw orderbook data
  const rawBids = useRef<{[key: string]: string}>({});
  const rawAsks = useRef<{[key: string]: string}>({});

  // Add these variables at the top of the component to store total volume for both sides
  const [asksTotalVolume, setAsksTotalVolume] = useState(0);
  const [bidsTotalVolume, setBidsTotalVolume] = useState(0);
  // Add state for smoothed percentages
  const [smoothedAsks, setSmoothedAsks] = useState<ProcessedOrderBookEntry[]>(defaultOrders);
  const [smoothedBids, setSmoothedBids] = useState<ProcessedOrderBookEntry[]>(defaultOrders);
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);

  // Add refs for performance optimization
  const orderbookUpdateTimeRef = useRef<number>(0);
  const orderbookCacheRef = useRef<{
    asks: ProcessedOrderBookEntry[];
    bids: ProcessedOrderBookEntry[];
    lastUpdate: number;
  }>({
    asks: defaultOrders,
    bids: defaultOrders,
    lastUpdate: 0
  });

  const soundRef = useRef<HTMLAudioElement | null>(null);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Track prices of all symbols
  const [allSymbolPrices, setAllSymbolPrices] = useState<SymbolPrice[]>([
    { symbol: "BTCUSDT", price: 0 },
    { symbol: "ETHUSDT", price: 0 },
    { symbol: "XRPUSDT", price: 0 }
  ]);
  
  // Position summaries by symbol
  const [positionsBySymbol, setPositionsBySymbol] = useState<{
    [key: string]: {
      totalQuantity: number;
      avgEntryPrice: number;
      totalValue: number;
      unrealizedPnl: number;
    }
  }>({});

  // Add these variables near the top of the component, with other refs
  const lastLiquidationCheckRef = useRef<number>(0);
  const liquidationInProgressRef = useRef<boolean>(false);
  const LIQUIDATION_CHECK_COOLDOWN = 100; // 100ms cooldown between checks

  // Add function to calculate qty based on percentage
  const calculateQtyByPercentage = (percentage: number) => {
    const price = Number(orderPrice);
    if (price === 0) return;
    
    // Get actual balance and leverage from userAssets
    const balance = userAssets?.usdt_balance || 0;
    const leverage = userAssets?.leverage || 1; // Default to 1x if not available
    
    // Calculate amount with leverage applied
    const amount = (balance * percentage * leverage) / 100;
    const calculatedQty = amount / price;
    
    // Format to 3 decimal places
    const formattedQty = calculatedQty.toFixed(3);
    setQty(Number(formattedQty));
    setQtyInput(formattedQty);
    setCalculatedPercentage(percentage);
  };

  // Load Order History with pagination
  const loadOrderHistory = useCallback(async (page: number = 1) => {
    if (user.user_id !== -1) {
      try {
        const offset = (page - 1) * orderHistoryItemsPerPage;
        const ordersResponse = await getAllUserOrders(user.user_id, offset, orderHistoryItemsPerPage);
        setOrders(ordersResponse.data);
        setOrderHistoryTotal(ordersResponse.total);
      } catch (error) {
        console.error('Failed to load order history:', error);
      }
    }
  }, [user.user_id, orderHistoryItemsPerPage]);

  // Load P&L with pagination
  const loadPnlHistory = useCallback(async (page: number = 1) => {
    if (user.user_id !== -1) {
      try {
        const offset = (page - 1) * pnlItemsPerPage;
        const pnlsResponse = await getAllUserPnls(user.user_id, offset, pnlItemsPerPage);
        setPnls(pnlsResponse.data);
        setPnlTotal(pnlsResponse.total);
      } catch (error) {
        console.error('Failed to load P&L history:', error);
      }
    }
  }, [user.user_id, pnlItemsPerPage]);


  const loadData = useCallback(async () => {
    if (user.user_id !== -1) {
      try {
        const [assets, positions, items, ordersResponse, pnlsResponse] = await Promise.all([
          getUserAssets(user.user_id),
          getUserPositions(user.user_id),
          getUserItems(user.user_id),
          getAllUserOrders(user.user_id, (orderHistoryPage - 1) * orderHistoryItemsPerPage, orderHistoryItemsPerPage),
          getAllUserPnls(user.user_id, (pnlPage - 1) * pnlItemsPerPage, pnlItemsPerPage)
        ]);

        
        setUserAssets(assets);
        setPositions(positions);
        setUserItems(items.data);
        setOrders(ordersResponse.data);
        setOrderHistoryTotal(ordersResponse.total);
        setPnls(pnlsResponse.data);
        setPnlTotal(pnlsResponse.total);
        
        // Check and update user level (backend will handle BUGS balance check)
        if (assets) {
          await updateUserLevel(user.user_id);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
  }, [user.user_id, orderHistoryPage, orderHistoryItemsPerPage, pnlPage, pnlItemsPerPage, setUserAssets, setPositions, setUserItems, setOrders, setPnls]);
  
  // Handle pagination changes
  const handleOrderHistoryPageChange = useCallback((page: number) => {
    setOrderHistoryPage(page);
    loadOrderHistory(page);
  }, [loadOrderHistory]);

  const handlePnlPageChange = useCallback((page: number) => {
    setPnlPage(page);
    loadPnlHistory(page);
  }, [loadPnlHistory]);

  useEffect(() => {
    setOrderPrice(0);
    if (user.user_id !== -1) {
      loadData();
    }
  }, [user, symbol]); // Re-load data when symbol changes

  // Load pagination data separately after user is available
  useEffect(() => {
    if (user.user_id !== -1) {
      const loadInitialPaginationData = async () => {
        try {
          const [ordersResponse, pnlsResponse] = await Promise.all([
            getAllUserOrders(user.user_id, 0, orderHistoryItemsPerPage),
            getAllUserPnls(user.user_id, 0, pnlItemsPerPage)
          ]);
          setOrders(ordersResponse.data);
          setOrderHistoryTotal(ordersResponse.total);
          setPnls(pnlsResponse.data);
          setPnlTotal(pnlsResponse.total);
        } catch (error) {
          console.error('Failed to load initial pagination data:', error);
        }
      };
      loadInitialPaginationData();
    }
  }, [user.user_id, orderHistoryItemsPerPage, pnlItemsPerPage, setOrders, setPnls]);

  // Update ref when orders prop changes
  useEffect(() => {
      ordersRef.current = orders;
  }, [orders]);

  // Handle tab changes and reset pagination
  useEffect(() => {
    if (user.user_id !== -1) {
      if (activeOrderTab === "Order History") {
        setOrderHistoryPage(1);
        loadOrderHistory(1);
      } else if (activeOrderTab === "PnL") {
        setPnlPage(1);
        loadPnlHistory(1);
      }
    }
  }, [activeOrderTab, user.user_id, loadOrderHistory, loadPnlHistory]);

  // Helper function to apply updates to orderbook data
  const applyUpdate = (bookSide: {[key: string]: string}, price: string, size: string) => {
    const p = parseFloat(price);
    const s = parseFloat(size);
    if (isNaN(p) || isNaN(s)) return;
    
    if (s === 0) {
        // Remove the price level if size is zero
        delete bookSide[price];
    } else {
        // Insert or update the price level
        bookSide[price] = size;
    }
  };

  useEffect(() => {
    const connectWebSocket = () => {
        // Close any existing connection first
        if (wsRef.current) {
            console.log(`Closing previous WebSocket connection for ${symbol}`);
            // Enhanced cleanup for existing connection
            const existingWs = wsRef.current;
            existingWs.onopen = null;
            existingWs.onmessage = null;
            existingWs.onerror = null;
            existingWs.onclose = null;
            
            if (existingWs.readyState === WebSocket.OPEN || existingWs.readyState === WebSocket.CONNECTING) {
                existingWs.close(1000, `Switching to ${symbol}`);
            }
            wsRef.current = null;
        }
        
        console.log(`Creating new WebSocket connection for symbol: ${symbol}`);
        const ws = new WebSocket('wss://stream.bybit.com/v5/public/linear');
        
        ws.onopen = () => {
            console.log(`WebSocket Connected for ${symbol}`);
            // Subscribe to orderbook data and public trades for the current symbol
            // Also subscribe to tickers for all symbols we want to track
            ws.send(JSON.stringify({
                "op": "subscribe",
                "args": [
                    `orderbook.200.${symbol}`,
                    `publicTrade.${symbol}`,
                    "tickers.BTCUSDT",
                    "tickers.ETHUSDT",
                    "tickers.XRPUSDT"
                ]
            }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // --- IMPORTANT: Remove or Comment out data_updated handling here --- <<<<==== REMOVAL
                /*
                if (data.action === "data_updated" && data.user_id) {
                     // Check if the update is for the currently logged-in user
                     if (data.user_id === user.user_id) {
                         console.log("Received data_updated notification, reloading data...");
                         loadData(); // Reload user-specific data
                         playSound(); // Optional: play sound on update
                     }
                     return; // Stop further processing for this message type
                }
                */
                // --- End of removal/comment out ---

                // Handle ticker data for all symbols
                if (data.topic?.startsWith('tickers.')) {
                    // console.log(data);
                    const tickerSymbol = data.topic.split('.')[1];
                    if (data.data && data.data.lastPrice) {
                        const lastPrice = parseFloat(data.data.lastPrice);
                        
                        // Update the price for this symbol
                        setAllSymbolPrices(prevPrices => 
                            prevPrices.map(price => 
                                price.symbol === tickerSymbol 
                                    ? { ...price, price: lastPrice } 
                                    : price
                            )
                        );
                        
                        // If this is the current symbol, also update currentPrice
                        if (tickerSymbol === symbol) {
                            setCurrentPrice(lastPrice);
                            // checkTargetPrices(lastPrice);
                            // checkLiquidationConditions();
                        }
                    }
                }

                // Handle orderbook data
                if (data.topic?.startsWith('orderbook.')) {
                    const orderbook = data.data;
                    if (!orderbook) return;
                    
                    const msgType = data.type; // 'snapshot' or 'delta'
                    
                    // Handle the message based on type
                    if (msgType === 'snapshot') {
                        // Reset the orderbook data for a snapshot
                        rawBids.current = {};
                        rawAsks.current = {};
                        
                        // Process bids
                        const b = orderbook.b || [];
                        b.forEach((bid: [string, string]) => {
                            applyUpdate(rawBids.current, bid[0], bid[1]);
                        });
                        
                        // Process asks
                        const a = orderbook.a || [];
                        a.forEach((ask: [string, string]) => {
                            applyUpdate(rawAsks.current, ask[0], ask[1]);
                        });
                    } else if (msgType === 'delta') {
                        // Process bid updates
                        const b = orderbook.b || [];
                        b.forEach((bid: [string, string]) => {
                            applyUpdate(rawBids.current, bid[0], bid[1]);
                        });
                        
                        // Process ask updates
                        const a = orderbook.a || [];
                        a.forEach((ask: [string, string]) => {
                            applyUpdate(rawAsks.current, ask[0], ask[1]);
                        });
                    }
                    
                    // Use the optimized orderbook update function
                    updateOrderbook();
                    
                    // Get the current market price (mid price between best bid and ask)
                    let bestAsk = 0;
                    let bestBid = 0;
                    
                    // Find best ask (lowest ask price)
                    const sortedAsks = Object.keys(rawAsks.current)
                        .map(price => parseFloat(price))
                        .sort((a, b) => a - b);
                    
                    // Find best bid (highest bid price)
                    const sortedBids = Object.keys(rawBids.current)
                        .map(price => parseFloat(price))
                        .sort((a, b) => b - a);
                    
                    if (sortedAsks.length > 0) bestAsk = sortedAsks[0];
                    if (sortedBids.length > 0) bestBid = sortedBids[0];
                    
                    const midPrice = (bestAsk && bestBid) ? (bestAsk + bestBid) / 2 : 0;

                    // Update current price and average price
                    if (midPrice > 0) {
                        const formattedMidPrice = (Math.ceil(midPrice * 10) / 10).toFixed(2);
                        setCurrentPrice(Number(formattedMidPrice));
                        // Also update orderPrice when the currentPrice is first received
                        setOrderPrice(prev => prev === 0 ? Number(formattedMidPrice) : prev);
                        // checkTargetPrices(midPrice);
                        
                        // Set price type based on the last trade direction
                        // If current price is closer to bid, it's likely a sell (ask)
                        setIsPriceBid(Math.abs(bestBid - midPrice) < Math.abs(bestAsk - midPrice));

                        const orderPrice = (document.getElementById('order_price_input') as HTMLInputElement)?.value;
                        const qty = (document.getElementById('qty_input') as HTMLInputElement)?.value;
                        
                        if (qty) {
                            const qtyNum = parseFloat(qty);
                            const orderPriceNum = parseFloat(orderPrice);
                            const currentPriceNum = midPrice;
                            
                            if (isNaN(qtyNum) || isNaN(orderPriceNum) || isNaN(currentPriceNum)) {
                                setSellPrice(0);
                                setBuyPrice(0);
                                setSellSize(0);
                                setBuySize(0);
                            } else if (orderPriceNum > currentPriceNum) {
                                setSellPrice(Number(orderPriceNum.toFixed(2)));
                                setBuyPrice(Number(currentPriceNum.toFixed(2)));
                                setSellSize(Number((qtyNum * orderPriceNum).toFixed(2)));
                                setBuySize(Number((qtyNum * currentPriceNum).toFixed(2)));
                            } else if (orderPriceNum < currentPriceNum) {
                                setBuyPrice(Number(orderPriceNum.toFixed(2)));
                                setSellPrice(Number(currentPriceNum.toFixed(2)));
                                setBuySize(Number((qtyNum * orderPriceNum).toFixed(2)));
                                setSellSize(Number((qtyNum * currentPriceNum).toFixed(2)));
                            }

                            if (!orderPrice) {
                                setSellPrice(Number(currentPriceNum.toFixed(2)));
                                setBuyPrice(Number(currentPriceNum.toFixed(2)));
                                setBuySize(Number((qtyNum * currentPriceNum).toFixed(2)));
                                setSellSize(Number((qtyNum * currentPriceNum).toFixed(2)));
                            }
                        }

                        // Calculate VWAP for average price with memoization
                        const vwapKey = `${Object.keys(rawAsks.current).length}-${Object.keys(rawBids.current).length}`;
                        const cachedVwap = orderbookCacheRef.current.lastUpdate;
                        
                        if (cachedVwap !== Date.now()) {
                            let totalValue = 0;
                            let totalQty = 0;

                            // Include both ask and bid orders in VWAP calculation
                            Object.entries(rawAsks.current).forEach(([price, qty]) => {
                                const p = parseFloat(price);
                                const q = parseFloat(qty);
                                totalValue += p * q;
                                totalQty += q;
                            });

                            Object.entries(rawBids.current).forEach(([price, qty]) => {
                                const p = parseFloat(price);
                                const q = parseFloat(qty);
                                totalValue += p * q;
                                totalQty += q;
                            });

                            const vwap = totalQty > 0 ? (totalValue / totalQty).toFixed(2) : formattedMidPrice;
                            setAvgPrice(Number(vwap));
                            orderbookCacheRef.current.lastUpdate = Date.now();
                        }
                    }
                }
                
                // Handle trade data
                if (data.topic?.startsWith('publicTrade.')) {
                    const tradeData = data.data;
                    if (!tradeData || !Array.isArray(tradeData)) return;
                    
                    // Process the trade data based on the actual structure from Bybit
                    // Structure example: {T: timestamp, s: symbol, S: side, v: volume, p: price, i: id, ...}
                    const newTrades = tradeData.map((trade: any) => {
                        try {
                            // Format timestamp to HH:MM:SS
                            const timestamp = new Date(trade.T || Date.now());
                            const timeString = timestamp.toLocaleTimeString('en-US', { 
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            });
                            
                            // Get trade type (buy/sell) from 'S' property
                            const tradeType: 'buy' | 'sell' = 
                                (trade.S && trade.S.toLowerCase() === 'buy') ? 'buy' : 'sell';
                            
                            return {
                                // Use 'p' for price
                                price: parseFloat(trade.p || '0').toFixed(2),
                                // Use 'v' for quantity
                                qty: parseFloat(trade.v || '0').toFixed(3),
                                time: timeString,
                                type: tradeType
                            };
                        } catch (error) {
                            console.error('Error processing individual trade:', error, trade);
                            // Return a default trade object if there's an error
                            return {
                                price: '0.00',
                                qty: '0.000',
                                time: new Date().toLocaleTimeString('en-US', { 
                                    hour12: false,
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit'
                                }),
                                type: 'buy' as 'buy' | 'sell'
                            };
                        }
                    });
                    
                    // Filter out any invalid trades
                    const validTrades = newTrades.filter(trade => 
                        parseFloat(trade.price) > 0 && parseFloat(trade.qty) > 0
                    );
                    
                    if (validTrades.length > 0) {
                        // Update state with new trades
                        setRecentTrades(prevTrades => {
                            // Add new trades at the beginning
                            const updatedTrades = [...validTrades, ...prevTrades];
                            // Limit to 30 trades
                            return updatedTrades.slice(0, 30);
                        });
                    }
                }
            } catch (error) {
                console.error('Error processing WebSocket data:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            // Enhanced error handling
            if (wsRef.current === ws) {
                wsRef.current = null;
            }
        };

        ws.onclose = (event) => {
            console.log(`WebSocket disconnected for ${symbol}. Code: ${event.code}, Reason: ${event.reason}`);
            
            // Only reconnect if this is still the current connection and not a clean shutdown
            if (wsRef.current === ws && event.code !== 1000) {
                console.log("Attempting to reconnect...");
                setTimeout(connectWebSocket, 5000);
            } else {
                console.log("WebSocket connection closed cleanly, not reconnecting");
            }
        };

        wsRef.current = ws;
    };

    // Initialize Bybit connection (조건 없이 항상 연결)
    connectWebSocket();

    // Enhanced cleanup function for Bybit WebSocket
    return () => {
        console.log(`Cleaning up WebSocket connection for ${symbol}`);
        if (wsRef.current) {
            const ws = wsRef.current;
            
            // Clear all event handlers to prevent any callbacks
            ws.onopen = null;
            ws.onmessage = null;
            ws.onerror = null;
            ws.onclose = null; // Important to prevent reconnect attempts after unmount
            
            // Close connection with clean code
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close(1000, "Component cleanup");
            }
            
            wsRef.current = null;
        }
        
        // Clear symbol-specific data
        rawBids.current = {};
        rawAsks.current = {};
    };
  }, [symbol]); // Bybit 연결은 심볼 변경 시에만 재설정

  // Reset recent trades when symbol changes
  useEffect(() => {
    setRecentTrades([]);
  }, [symbol]);
  
  // Reset orderbook data when symbol changes
  useEffect(() => {
    // Clear existing orderbook data when symbol changes
    rawBids.current = {};
    rawAsks.current = {};
    setAskOrders(defaultOrders);
    setBidOrders(defaultOrders);
    setSmoothedAsks(defaultOrders);
    setSmoothedBids(defaultOrders);
  }, [symbol]);

  // Replace the useEffect that calculates percentRatio
  const calculatePercentages = useMemo(() => {
    // Calculate the total volume for both sides
    const totalVolume = asksTotalVolume + bidsTotalVolume;
    
    if (totalVolume <= 0) return { newAsks: askOrders, newBids: bidOrders };
    
    // Calculate the percentage ratio for asks side (what percentage of total volume)
    const asksVolumePercentage = (asksTotalVolume / totalVolume) * 100;
    
    // Calculate the percentage ratio for bids side
    const bidsVolumePercentage = (bidsTotalVolume / totalVolume) * 100;
    
    // Calculate new percentRatio values for asks and bids
    const newAsks = askOrders.map(ask => ({
        ...ask,
        percentRatio: ask.rawTotal > 0 
            ? (ask.rawTotal / asksTotalVolume) * asksVolumePercentage 
            : 0
    }));
    
    const newBids = bidOrders.map(bid => ({
        ...bid,
        percentRatio: bid.rawTotal > 0 
            ? (bid.rawTotal / bidsTotalVolume) * bidsVolumePercentage 
            : 0
    }));
    
    return { newAsks, newBids, asksVolumePercentage, bidsVolumePercentage };
  }, [askOrders, bidOrders, asksTotalVolume, bidsTotalVolume]);

  // Throttled function to update smoothed values
  const updateSmoothedValues = useCallback(throttle(() => {
    const { newAsks, newBids, asksVolumePercentage, bidsVolumePercentage } = calculatePercentages;
    
    // Smooth the transitions
    setSmoothedAsks(prevSmoothed => {
        if (prevSmoothed.length === 0) return newAsks;
        
        return newAsks.map((ask, index) => {
            const prevAsk = index < prevSmoothed.length ? prevSmoothed[index] : { percentRatio: 0 };
            const smoothingFactor = 0.3; // Adjust this value to control smoothness (0-1)
            
            return {
                ...ask,
                percentRatio: prevAsk.percentRatio + (ask.percentRatio - prevAsk.percentRatio) * smoothingFactor
            };
        });
    });
    
    setSmoothedBids(prevSmoothed => {
        if (prevSmoothed.length === 0) return newBids;
        
        return newBids.map((bid, index) => {
            const prevBid = index < prevSmoothed.length ? prevSmoothed[index] : { percentRatio: 0 };
            const smoothingFactor = 0.3; // Adjust this value to control smoothness (0-1)
            
            return {
                ...bid,
                percentRatio: prevBid.percentRatio + (bid.percentRatio - prevBid.percentRatio) * smoothingFactor
            };
        });
    });
    
    // Also update the buy/sell percentage indicators
    const askPercentElement = document.querySelector('.buy-sell-indicator .ask-percent');
    const bidPercentElement = document.querySelector('.buy-sell-indicator .bid-percent');
    
    if (askPercentElement && asksVolumePercentage !== undefined) {
        askPercentElement.textContent = `${Math.round(asksVolumePercentage)}%`;
    }
    
    if (bidPercentElement && bidsVolumePercentage !== undefined) {
        bidPercentElement.textContent = `${Math.round(bidsVolumePercentage)}%`;
    }
  }, 50), [calculatePercentages]); // Throttle to max 10 updates per second

  useEffect(() => {
    updateSmoothedValues();
  }, [updateSmoothedValues]);

  useEffect(() => {
    soundRef.current = new Audio('/Coin.mp3');
    soundRef.current.volume = 0.5;
    
    // 사용자 상호작용 시 오디오 활성화
    const enableAudio = () => {
      if (soundRef.current) {
        // 볼륨 0으로 설정하고 재생 후 즉시 중지하여 오디오 활성화
        soundRef.current.volume = 0;
        soundRef.current.play()
          .then(() => {
            soundRef.current?.pause();
            soundRef.current?.load();
            soundRef.current!.volume = 0.5; // 원래 볼륨으로 복원
            console.log('Audio enabled successfully');
          })
          .catch(e => console.log('Could not enable audio:', e));
      }
    };
    
    // 페이지 내 사용자 상호작용 이벤트 리스너
    window.addEventListener('click', enableAudio, { once: true });
    window.addEventListener('touchstart', enableAudio, { once: true });
    window.addEventListener('keydown', enableAudio, { once: true });
    
    return () => {
      soundRef.current = null;
      // 이벤트 리스너 제거
      window.removeEventListener('click', enableAudio);
      window.removeEventListener('touchstart', enableAudio);
      window.removeEventListener('keydown', enableAudio);
    };
  }, []);

  const playSound = useCallback(() => {
    if (soundRef.current && !isSoundMute) {
      // 현재 재생 중인 경우 중지하고 처음부터 다시 재생
      try {
        soundRef.current.currentTime = 0;
        const playPromise = soundRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Sound play failed:', error);
            // 사용자가 페이지와 상호작용하지 않아 자동 재생이 차단된 경우
            // 조용히 실패하도록 처리
          });
        }
      } catch (e) {
        console.log('Error playing sound:', e);
      }
    }
  }, [isSoundMute]);

  // 목표가 도달했는지 확인
  const checkTargetPrices = async (currentPrice: number) => {
    const orderTargets = ordersRef.current.filter(order => order.status === "PENDING");
    // console.log('orderTargets',orderTargets);
    // console.log('currentPrice',currentPrice);
    for (const target of orderTargets) {
        // Skip if we've already processed this order
        if (processedOrderIds.current.has(Number(target.order_id))) continue;
        
        if (
          (target.direction === 'LONG' && currentPrice <= Number(target.order_price)) ||
          (target.direction === 'SHORT' && currentPrice >= Number(target.order_price))
        ) {
          try {
            console.log('target',target);
            // Mark this order as processed before making the API call
            processedOrderIds.current.add(Number(target.order_id));
            
            // 주문 실행 API 호출
            const res = await putOrders({...target, status: "FILLED", entry_price: currentPrice});

            loadData();
            playSound();
            
          } catch (error) {
            console.error('주문 실행 실패:', error);
            // If the request fails, remove from processed set to allow retry
            processedOrderIds.current.delete(Number(target.order_id));
          }
        }
    }
  }

  const handleClickOrderPiceOnOrderBook = (price: string) => {
    setOrderPrice(Number(price));
  }

  const handleClickDropdown0point1 = () => {
    setDropdownValue("0.1");
    setIsDropdownOpen(false);
    priceIntervalRef.current = 0.1;
  }

  const handleClickDropdown1 = () => {
    setDropdownValue("1");
    setIsDropdownOpen(false);
    priceIntervalRef.current = 1;
  }

  const handleClickQuoteDisplay = (mode: 1 | 2 | 3 | 4, depth: number) => {
      setOrderbookMode(mode);
      orderBookDepthRef.current = depth;
  }

  const handleClickMarginModal = () => {
    // Check if there are any open positions
    if (positions.length > 0) {
      setAlertMessage("마진 모드를 변경할 수 없습니다. 모든 포지션을 종료한 후 다시 시도해주세요.");
      setIsAlertOpen(true);
      return;
    }
    setIsSelectMarginModalOpen(true);
  };

  const handleClickLeverageModal = () => {
      setIsSelectLeverageModalOpen(true);
  };

  const handleClickBuySellModal = (direction: 'Long' | 'Short') => {
      // 로그인 여부 확인
      if (!isAuthenticated()) {
          // setAlertMessage("로그인이 필요한 기능입니다.");
          setAlertMessage("DEX 모의투자 오픈 예정");
          setIsAlertOpen(true);
          
          // 알림이 닫히면 로그인 모달 표시
          setTimeout(() => {
              // setIsOpenSignInModal(true);
          }, 2000);
          
          return;
      }
      
      setDirection(direction);
      setIsBuySellModalOpen(true);
  };

  const handleClickCancelOrderModal = (order: UserOrder) => {
      setCancelOrder(order);
      setIsCancelOrderModalOpen(true);
  };

  const handleClickCancelAllOrderModal = () => {
      setIsCancelAllOrderModalOpen(true);
  };

  const handleClickCloseAllModal = () => {
      setIsCloseAllModalOpen(true);
  };

  const handleConfirmMarginModal = async (mode: 'cross' | 'isolated') => {
    if (user.user_id !== -1) {
      await putUserAssets(user.user_id, {
        ...userAssets as UserAssets,
        margin_mode: mode
      })
      .then((res) => {
        setUserAssets(res);
        setIsSelectMarginModalOpen(false);
      })
      .catch((err) => {
        alert('마진 모드 변경 실패, 증거금을 확인해주세요.');
        setIsSelectMarginModalOpen(false);
      });
    } else {
      setUserAssets({...userAssets as UserAssets, margin_mode: mode});
      setIsSelectMarginModalOpen(false);
    }
  };

  const handleConfirmLeverageModal = async (leverage: number) => {
      await putUserAssets(user.user_id, {
          ...userAssets as UserAssets,
          leverage: leverage
      })
      .then((res) => {
          setUserAssets(res);
          loadData();
          setIsSelectLeverageModalOpen(false);
          // checkLiquidationConditions();
      })
      .catch((err) => {
          alert('레버리지 변경 실패, 증거금을 확인해주세요.');
      });
  };

  const handleConfirmBuySellModal = async () => {
      // 로그인 여부 한번 더 확인
      if (!isAuthenticated()) {
          // setAlertMessage("로그인이 필요한 기능입니다.");
          setAlertMessage("DEX 모의투자 오픈 예정");
          setIsAlertOpen(true);
          
          // 알림이 닫히면 로그인 모달 표시
          setTimeout(() => {
              // setIsOpenSignInModal(true);
          }, 2000);
          
          setIsBuySellModalOpen(false);
          return;
      }
      
      // 다른 심볼에 포지션이 있는지 확인
      const otherPositions = positions.filter(position => position.symbol !== symbol);
      const hasPositionOnDifferentSymbol = otherPositions.length > 0;
      
      // 이미 다른 심볼에 포지션이 있는 경우
      if (hasPositionOnDifferentSymbol) {
          setAlertMessage(`다른 (${otherPositions[0].symbol}) 포지션이 있습니다. 다른 포지션을 청산하고 주문을 개설할 수 있습니다.`);
          setIsAlertOpen(true);
          setIsBuySellModalOpen(false);
          return;
      }
      
      let isHighOrder = false;
      if (direction === "Long" && (Number(orderPrice) > Number(currentPrice))) isHighOrder = true;
      if (direction === "Short" && (Number(orderPrice) < Number(currentPrice))) isHighOrder = true;

      if (orderType === "LIMIT") {
          console.log('orderPrice',orderPrice);
          console.log('currentPrice',currentPrice);
          console.log('isHighOrder',isHighOrder);
          const response = await postOrders({
              user_id: user.user_id,
              symbol: symbol,
              order_type: orderType,
              direction: direction === "Long" ? "Long" : "Short",
              quantity: qty,
              order_price: Number(orderPrice),
              entry_price: isHighOrder ? currentPrice : Number(orderPrice),
              status: isHighOrder ? "FILLED" : "PENDING"   
          });
          
          if (!response.success) {
            setAlertMessage(`증거금이 부족합니다.`);
            setIsAlertOpen(true);
            setIsBuySellModalOpen(false);
            return;
          }
      } else if (orderType === "MARKET") {
          const response = await postOrders({
              user_id: user.user_id,
              symbol: symbol,
              order_type: orderType,
              direction: direction === "Long" ? "Long" : "Short",
              quantity: qty,
              order_price: currentPrice,
              entry_price: currentPrice,
              status: "FILLED"
          });
          if (!response.success) {
            setAlertMessage(`증거금이 부족합니다.`);
            setIsAlertOpen(true);
            setIsBuySellModalOpen(false);
            return;
          }
      }
      
      loadData();
      playSound();
  };

  const handleConfirmCancelOrderModal = async () => {
      if (cancelOrder) {
          await putOrders({...cancelOrder, status: "CANCELLED"});
          setIsCancelOrderModalOpen(false);
          setCancelOrder(null);
          loadData();
      }
  };

  const handleConfirmCancelAllOrderModal = async () => {
    const cancelPromises = orders
      .filter(order => order.status === "PENDING")
      .map(order => putOrders({...order, status: "CANCELLED"}));
    
    await Promise.all(cancelPromises)
      .then(() => {
        setIsCancelAllOrderModalOpen(false);
        loadData();
        playSound();
      })
      .catch((err) => {
        console.error("Error canceling all orders:", err);
      });

  };

  const handleConfirmCloseAllModal = async () => {
    try {
        // Close all positions with market orders
        const closePromises = positions.map(async (position) => {
            // Determine the opposite direction for closing the position
            const closeDirection = position.direction === "LONG" ? "Short" : "Long";
            
            return await postOrders({
                user_id: position.user_id,
                symbol: position.symbol,
                order_type: "Market",
                direction: closeDirection,
                quantity: position.quantity,
                order_price: allSymbolPrices.find(p => p.symbol === position.symbol)?.price,
                entry_price: allSymbolPrices.find(p => p.symbol === position.symbol)?.price,
                status: "FILLED"
            });
        });
        
        await Promise.all(closePromises);
        console.log("All positions closed with market orders");
        
        // Close the modal and reload data
        setIsCloseAllModalOpen(false);
        loadData();
        playSound();
    } catch (error) {
        console.error("Error closing all positions:", error);
        setIsCloseAllModalOpen(false);
    }
  };

  // Add this function to calculate available margin
  const calculateAvailableMargin = () => {
    if (!userAssets) return "0.00";
    
    // Current USDT balance
    const usdtBalance = userAssets.usdt_balance;
    
    // Current leverage
    const currentLeverage = userAssets.leverage;
    
    if (currentLeverage <= 0) return "0.00";
    
    // Total value of current positions
    const positionTotalPurchaseAmount = positions.reduce((sum, position) => {
        return sum + (Number(position.entry_price) * Number(position.quantity));
    }, 0);
    
    // Calculate margin needed for pending orders
    const pendingOrdersMargin = orders
        .filter(order => order.status === "PENDING")
        .reduce((sum, order) => {
            const orderPrice = Number(order.order_price);
            const orderQuantity = Number(order.quantity);
            return sum + ((orderPrice * orderQuantity) / currentLeverage);
        }, 0);
    
    // Available margin calculation
    const availableMargin = usdtBalance - (positionTotalPurchaseAmount / currentLeverage) - pendingOrdersMargin;
    
    return availableMargin.toFixed(2);
  };

  const handleClickLimitCloseModal = (position: Position) => {
      setSelectedPositionQuantity(Number(position.quantity));
      setSelectedPosition(position);
      setIsLimitCloseModalOpen(true);
  };

  const handleConfirmLimitClose = async (orderPrice: number, closeQuantity: number) => {
    if (!selectedPosition) return;
    
    // Determine the opposite direction for closing the position
    const closeDirection = selectedPosition.direction === "LONG" ? "Short" : "Long";

    let isHighOrder = false;
    if (closeDirection === "Long" && (Number(orderPrice) > Number(allSymbolPrices.find(p => p.symbol === symbol)?.price))) isHighOrder = true;
    if (closeDirection === "Short" && (Number(orderPrice) < Number(allSymbolPrices.find(p => p.symbol === symbol)?.price))) isHighOrder = true;
    
    try {
        // Place the limit close order
        const response = await postOrders({
            user_id: Number(selectedPosition.user_id),
            symbol: selectedPosition.symbol,
            order_type: "Limit",
            direction: closeDirection, 
            quantity: closeQuantity,
            order_price: orderPrice,
            entry_price: isHighOrder ? allSymbolPrices.find(p => p.symbol === selectedPosition.symbol)?.price : orderPrice,
            status: isHighOrder ? "FILLED" : "PENDING"
        });

        if (!response.success) {
          setAlertMessage(`증거금이 부족합니다.`);
          setIsAlertOpen(true);
          setIsLimitCloseModalOpen(false);
          return;
        }
        
        // Close the modal and reload data
        loadData();
        playSound();
    } catch (error) {
        console.error("Error placing limit close order:", error);
    }
  };

  const handleClickMarketCloseModal = (position: Position) => {
      setSelectedPositionQuantity(Number(position.quantity));
      setSelectedPosition(position);
      setIsMarketCloseModalOpen(true);
  };

  const handleConfirmMarketClose = async (closeQuantity: number) => {
    if (!selectedPosition) return;
    
    // Determine the opposite direction for closing the position
    const closeDirection = selectedPosition.direction === "LONG" ? "Short" : "Long";

    let isHighOrder = false;
    if (closeDirection === "Long" && (Number(currentPrice) > Number(allSymbolPrices.find(p => p.symbol === selectedPosition.symbol)?.price))) isHighOrder = true;
    if (closeDirection === "Short" && (Number(currentPrice) < Number(allSymbolPrices.find(p => p.symbol === selectedPosition.symbol)?.price))) isHighOrder = true;
    
    try {
        // Place the market close order
        const response = await postOrders({
            user_id: Number(selectedPosition.user_id),
            symbol: selectedPosition.symbol,
            order_type: "Market",
            direction: closeDirection, 
            quantity: closeQuantity,
            order_price: allSymbolPrices.find(p => p.symbol === selectedPosition.symbol)?.price,
            entry_price: allSymbolPrices.find(p => p.symbol === selectedPosition.symbol)?.price,
            status: "FILLED"
        });

        if (!response.success) {
          setAlertMessage(`증거금이 부족합니다.`);
          setIsAlertOpen(true);
          setIsMarketCloseModalOpen(false);
          return;
        }
        
        // Close the modal and reload data
        loadData();
        playSound();
    } catch (error) {
        console.error("Error placing market close order:", error);
    }
  };

  // Function to handle the recharge button click
  const handleRechargeClick = () => {
    const initialUsdt = mockConfig?.initial_usdt || 100000;
    
    // Check if user is logged in
    if (!isAuthenticated()) {
      // setAlertMessage("로그인이 필요한 기능입니다.");
      setAlertMessage("DEX 모의투자 오픈 예정");
      setIsAlertOpen(true);
      
      // Show login modal after alert
      setTimeout(() => {
        // setIsOpenSignInModal(true);
      }, 2000);
      
      return;
    }

    // Check if user already has sufficient balance
    if (userAssets && userAssets.usdt_balance >= initialUsdt) {
      setAlertMessage(`USDT 잔액이 이미 충분합니다. 잔액이 ${initialUsdt.toLocaleString()} USDT 미만일 때 재충전할 수 있습니다.`);
      setIsAlertOpen(true);
      return;
    }

    // Check if user has open positions
    if (positions.length > 0) {
      setAlertMessage("포지션을 보유하고 있는 상태에서는 재충전할 수 없습니다. 모든 포지션을 닫은 후 다시 시도해주세요.");
      setIsAlertOpen(true);
      return;
    }

    const freeRecharge = userAssets?.free_recharge;

    // Check if user has free recharge available
    if (freeRecharge && freeRecharge > 0) {
      // Use free recharge without consuming an item
      handleUseFreeRecharge();
      return;
    }

    // Find a USDT Recharge item
    const rechargeItem = userItems.find(item => 
      item.item?.name === "USDT Recharge" && 
      item.quantity > 0
    );

    
    if (rechargeItem) {
      setSelectedItem({
        id: rechargeItem.id,
        name: rechargeItem.item?.name || "",
        quantity: rechargeItem.quantity,
        itemId: rechargeItem.item_id
      });
      setIsUseModalOpen(true);
    } else {
      setAlertMessage("USDT 재충전 아이템이 없습니다. 아이템 구매가 필요합니다.");
      setIsAlertOpen(true);
    }
  };

  // Function to handle using free recharge
  const handleUseFreeRecharge = async () => {
    const initialUsdt = mockConfig?.initial_usdt || 100000;
    
    try {
      // Reset USDT balance and decrement free_recharge
      const updatedUserAssets = {
        ...userAssets as UserAssets,
        usdt_balance: initialUsdt,
        free_recharge: (userAssets?.free_recharge || 0) - 1
      };
      
      // Update on the server
      await putUserAssets(user.user_id, updatedUserAssets);
      
      // Update user's level (backend will handle BUGS balance check)
      await updateUserLevel(user.user_id);
      
      // Update in local state
      setUserAssets(updatedUserAssets);
      
      // Reload data to refresh other info
      loadData();
      
      setAlertMessage(`무료 재충전을 사용하여 USDT 잔액이 ${initialUsdt.toLocaleString()}으로 초기화되었습니다.`);
      setIsAlertOpen(true);
      
    } catch (error) {
      console.error("Failed to use free recharge:", error);
      setAlertMessage("재충전에 실패했습니다. 다시 시도해주세요.");
      setIsAlertOpen(true);
    }
  };

  // Function to handle using the USDT Recharge item
  const handleUseItem = async (itemId: number, quantity: number) => {
    const initialUsdt = mockConfig?.initial_usdt || 100000;
    
    try {
      // Double check if user already has sufficient balance
      if (userAssets && userAssets.usdt_balance >= initialUsdt) {
        setAlertMessage(`USDT 잔액이 이미 충분합니다. 잔액이 ${initialUsdt.toLocaleString()} USDT 미만일 때 재충전할 수 있습니다.`);
        setIsAlertOpen(true);
        setIsUseModalOpen(false);
        return;
      }

      // Double check if user has open positions
      if (positions.length > 0) {
        setAlertMessage("포지션을 보유하고 있는 상태에서는 재충전할 수 없습니다. 모든 포지션을 닫은 후 다시 시도해주세요.");
        setIsAlertOpen(true);
        setIsUseModalOpen(false);
        return;
      }

      setIsUseLoading(true);
      
      // Call API to use the item
      await postUseItem({
        user_item_id: selectedItem.id,
        quantity: 1,
        duration_days: 1
      });
      
      // Reset USDT balance
      const updatedUserAssets = {
        ...userAssets as UserAssets,
        usdt_balance: initialUsdt
      };
      
      // Update on the server
      await putUserAssets(user.user_id, updatedUserAssets);
      
      // Update user's level (backend will handle BUGS balance check)
      await updateUserLevel(user.user_id);
      
      // Update in local state
      setUserAssets(updatedUserAssets);
      
      // Reload data to refresh items and other info
      loadData();
      
      setIsUseModalOpen(false);
      setAlertMessage(`USDT 재충전 아이템을 사용하여 USDT 잔액이 ${initialUsdt.toLocaleString()}으로 초기화되었습니다.`);
      setIsAlertOpen(true);
      
    } catch (error) {
      console.error("Failed to use item:", error);
      setAlertMessage("아이템 사용에 실패했습니다. 다시 시도해주세요.");
      setIsAlertOpen(true);
    } finally {
      setIsUseLoading(false);
    }
  };

  // Calculate positions by symbol
  const positionsBySymbolMemoized = useMemo(() => {
    const symbolMap: {[key: string]: {
      totalQuantity: number;
      avgEntryPrice: number;
      totalValue: number;
      unrealizedPnl: number;
    }} = {};
    
    positions.forEach(position => {
      if (!symbolMap[position.symbol]) {
        symbolMap[position.symbol] = {
          totalQuantity: 0,
          avgEntryPrice: 0,
          totalValue: 0,
          unrealizedPnl: 0
        };
      }
      
      const qty = Number(position.quantity);
      const entryPrice = Number(position.entry_price);
      const currentSymbolPrice = allSymbolPrices.find(p => p.symbol === position.symbol)?.price || 0;
      
      // Get the current data for this symbol
      const currentData = symbolMap[position.symbol];
      
      // Calculate value-weighted average entry price
      const currentValue = currentData.totalQuantity * currentData.avgEntryPrice;
      const newValue = qty * entryPrice;
      
      // Update the running totals
      const totalQuantity = currentData.totalQuantity + qty;
      const avgEntryPrice = totalQuantity > 0 ? (currentValue + newValue) / totalQuantity : 0;
      
      // Calculate unrealized PnL
      let positionPnl = 0;
      if (position.direction === "LONG") {
        positionPnl = qty * currentSymbolPrice - qty * entryPrice;
      } else {
        positionPnl = qty * entryPrice - qty * currentSymbolPrice;
      }
      
      symbolMap[position.symbol] = {
        totalQuantity,
        avgEntryPrice,
        totalValue: totalQuantity * avgEntryPrice,
        unrealizedPnl: currentData.unrealizedPnl + positionPnl
      };
    });
    
    return symbolMap;
  }, [positions, allSymbolPrices]);

  useEffect(() => {
    setPositionsBySymbol(positionsBySymbolMemoized);
  }, [positionsBySymbolMemoized]);

  // Function to check if positions should be liquidated
  const checkLiquidationConditions = useCallback(async () => {
    if (!userAssets || positions.length === 0) return;
    
    const liquidationThreshold = mockConfig?.liquidation_threshold_ratio || 0.6;
    
    // Throttle checks to prevent repeated liquidations
    const now = Date.now();
    if (
      liquidationInProgressRef.current || 
      now - lastLiquidationCheckRef.current < LIQUIDATION_CHECK_COOLDOWN
    ) {
      return;
    }

    // Early return if any price is 0 (data not ready)
    if (allSymbolPrices.some(price => price.price === 0)) {
      return;
    }
    
    try {
      // Set flags to prevent concurrent checks
      lastLiquidationCheckRef.current = now;
      liquidationInProgressRef.current = true;
      
      // Cross margin mode: liquidate all positions if total PnL loss exceeds threshold% of usdt_balance
      if (userAssets?.margin_mode === "cross") {
        console.log("cross margin mode");
        // Calculate total unrealized PnL across all positions
        const totalUnrealizedPnl = positions.reduce((total, position) => {
          const symbolPrice = allSymbolPrices.find(price => price.symbol === position.symbol)?.price || 0;
          let positionPnl = 0;
          
          if (position.direction === "LONG") {
            positionPnl = Number(position.quantity) * symbolPrice - Number(position.quantity) * Number(position.entry_price);
          } else { // SHORT
            positionPnl = Number(position.quantity) * Number(position.entry_price) - Number(position.quantity) * symbolPrice;
          }
          
          return total + positionPnl;
        }, 0);
        
        // If total PnL is negative and loss exceeds threshold% of balance
        if (totalUnrealizedPnl < 0 && Math.abs(totalUnrealizedPnl) > (userAssets.usdt_balance * liquidationThreshold)) {
          console.log(`Cross margin liquidation triggered: Total loss exceeds ${(liquidationThreshold * 100).toFixed(0)}% of balance`);
          
          // Close all positions with market orders
          const closePromises = positions.map(async (position) => {
            // Determine the opposite direction for closing
            const symbolPrice = allSymbolPrices.find(p => p.symbol === position.symbol)?.price;
            
            const closeDirection = position.direction === "LONG" ? "Short" : "Long";
            
            console.log("positionQuantity", position.quantity);

            return await postOrders({
              user_id: position.user_id,
              symbol: position.symbol,
              order_type: "Market",
              direction: closeDirection,
              quantity: position.quantity,
              order_price: symbolPrice,
              entry_price: symbolPrice,
              status: "FILLED"
            });
          });
          
          await Promise.all(closePromises);
          
          // Show alert message
          setAlertMessage(`Cross margin liquidation: All positions have been liquidated due to losses exceeding ${(liquidationThreshold * 100).toFixed(0)}% of your balance.`);
          setIsAlertOpen(true);
          
          // Reload data
          loadData();
          playSound();
        }
      } 
      // Isolated margin mode: check each position individually
      else if (userAssets?.margin_mode === "isolated") {
        console.log("isolated margin mode");
        // Create a Set to track positions that have been processed to avoid duplicates
        const processedPositionIds = new Set<string>();
        const liquidationPercentage = -(liquidationThreshold * 100);
        
        const liquidationPromises = positions.map(async (position) => {
          const symbolPrice = allSymbolPrices.find(price => price.symbol === position.symbol)?.price || 0;
          
          // Skip if already processed
          const positionKey = `${position.user_id}-${position.symbol}-${position.entry_price}-${position.quantity}`;
          if (processedPositionIds.has(positionKey)) {
            return false;
          }
          processedPositionIds.add(positionKey);

          // Calculate PnL percentage
          let pnlPercentage = 0;
          if (position.direction === "LONG") {
            pnlPercentage = ((symbolPrice - Number(position.entry_price)) / Number(position.entry_price)) * 100 * Number(userAssets.leverage);
          } else { // SHORT
            pnlPercentage = ((Number(position.entry_price) - symbolPrice) / Number(position.entry_price)) * 100 * Number(userAssets.leverage);
          }
          
          // If PnL percentage is below -threshold%, liquidate this position
          if (pnlPercentage <= liquidationPercentage) {
            console.log(`Isolated margin liquidation triggered for ${position.symbol}: PnL ${pnlPercentage.toFixed(2)}%`);
            
            // Determine the opposite direction for closing
            const closeDirection = position.direction === "LONG" ? "Short" : "Long";
            
            console.log("positionQuantity", position.quantity);
            
            // Close position with market order
            await postOrders({
              user_id: position.user_id,
              symbol: position.symbol,
              order_type: "Market",
              direction: closeDirection,
              quantity: position.quantity,
              order_price: symbolPrice,
              entry_price: symbolPrice,
              status: "FILLED"
            });
            
            return true; // Position was liquidated
          }
          
          return false; // Position was not liquidated
        });
        
        const results = await Promise.all(liquidationPromises);
        const liquidatedCount = results.filter(result => result).length;
        
        if (liquidatedCount > 0) {
          // Show alert message
          setAlertMessage(`Isolated margin liquidation: ${liquidatedCount} position(s) have been liquidated due to PnL reaching ${liquidationPercentage.toFixed(0)}%.`);
          setIsAlertOpen(true);
          
          // Reload data
          loadData();
          playSound();
        }
      }
    } catch (error) {
      console.error("Error during liquidation check:", error);
    } finally {
      // Reset the flag to allow future checks
      setTimeout(() => {
        liquidationInProgressRef.current = false;
      }, 1000); // Add a small delay to ensure we don't immediately recheck
    }
  }, [userAssets, positions, allSymbolPrices, mockConfig, setAlertMessage, setIsAlertOpen, loadData, playSound]);

  // Also check liquidation conditions when positions or prices change
  useEffect(() => {
    if (userAssets && positions.length > 0 && allSymbolPrices.length > 0) {
      // checkLiquidationConditions();
    }
  }, [positions, allSymbolPrices, userAssets]);

  // Enhanced Backend WebSocket cleanup
  useEffect(() => {
    // Define the handler for the custom data_updated event
    const handleDataUpdated = (event: CustomEvent) => {
      const data = event.detail;
      
      // Check if the update is for the currently logged-in user
      if (data.user_id === user.user_id) {
        console.log("Received data_updated notification from custom event:", data);
        loadData(); // Reload user-specific data
        playSound(); // Play sound on update
      }
    };
    
    // Add event listener for the custom event
    window.addEventListener('socket_data_updated', handleDataUpdated as EventListener);
    
    // Enhanced cleanup function
    return () => {
      console.log("Cleaning up backend WebSocket event listeners");
      window.removeEventListener('socket_data_updated', handleDataUpdated as EventListener);
      
      // Clear processed orders tracking
      processedOrderIds.current.clear();
      
      // Reset liquidation tracking
      lastLiquidationCheckRef.current = 0;
      liquidationInProgressRef.current = false;
    };
  }, [user.user_id, loadData, playSound]);

  // Clear the processed orders set when orders are reloaded
  useEffect(() => {
    processedOrderIds.current.clear();
  }, [orders]);

  // Memoize orderbook processing function
  const processOrderbook = useCallback((
    rawData: {[key: string]: string}, 
    isAsk: boolean, 
    priceInterval: number, 
    depth: number
  ): ProcessedOrderBookEntry[] => {
    // Convert to array and sort
    const sorted = Object.entries(rawData)
      .map(([price, size]) => [parseFloat(price), parseFloat(size)])
      .filter(([_, qty]) => qty > 0) // Filter out zero quantities early
      .sort((a, b) => isAsk ? a[0] - b[0] : b[0] - a[0]);
    
    // Apply price interval aggregation efficiently
    const aggregated = new Map<number, number>();
    
    for (const [price, qty] of sorted) {
      const roundedPrice = isAsk 
        ? Math.ceil(price / priceInterval) * priceInterval
        : Math.floor(price / priceInterval) * priceInterval;
      
      aggregated.set(roundedPrice, (aggregated.get(roundedPrice) || 0) + qty);
    }
    
    // Convert to array, sort and limit
    const processedEntries = Array.from(aggregated.entries())
      .sort((a, b) => isAsk ? a[0] - b[0] : b[0] - a[0])
      .slice(0, depth);
    
    // Calculate totals
    let accumulatedTotal = 0;
    const result = processedEntries.map(([price, qty]) => {
      accumulatedTotal += qty;
      return {
        price: price.toFixed(2).toLocaleString(),
        qty: qty.toFixed(4),
        total: accumulatedTotal.toFixed(4),
        rawTotal: accumulatedTotal,
        percentRatio: 0
      };
    });
    
    // For asks, reverse the array
    if (isAsk) result.reverse();
    
    // Fill with empty entries if needed
    if (result.length < depth && result.length > 0) {
      const lastPrice = parseFloat(result[result.length - 1].price.replace(/,/g, ''));
      
      for (let i = result.length; i < depth; i++) {
        const newPrice = isAsk 
          ? lastPrice + ((i - result.length + 1) * priceInterval)
          : lastPrice - ((i - result.length + 1) * priceInterval);
        
        const entry = {
          price: newPrice.toFixed(2).toLocaleString(),
          qty: "0",
          total: accumulatedTotal.toFixed(4),
          rawTotal: accumulatedTotal,
          percentRatio: 0
        };
        
        if (isAsk) {
          result.unshift(entry);
        } else {
          result.push(entry);
        }
      }
    }
    
    return result;
  }, []);

  // Throttled orderbook update function
  const updateOrderbook = useCallback(throttle(() => {
    const interval = priceIntervalRef.current;
    const depth = orderBookDepthRef.current;
    
    // Process asks
    const processedAsks = processOrderbook(rawAsks.current, true, interval, depth);
    setAskOrders(processedAsks);
    
    // Process bids  
    const processedBids = processOrderbook(rawBids.current, false, interval, depth);
    setBidOrders(processedBids);
    
    // Update volume totals
    if (processedAsks.length > 0) {
      const asksVolume = Math.max(...processedAsks.map(ask => ask.rawTotal));
      setAsksTotalVolume(asksVolume);
    }
    
    if (processedBids.length > 0) {
      const bidsVolume = Math.max(...processedBids.map(bid => bid.rawTotal));
      setBidsTotalVolume(bidsVolume);
    }
  }, 50), [processOrderbook]); // Throttle to max 20 updates per second

  // Add comprehensive cleanup function
  const cleanupResources = useCallback(() => {
    console.log("Starting resource cleanup...");
    
    // 1. WebSocket cleanup
    if (wsRef.current) {
      console.log("Cleaning up WebSocket connection");
      const ws = wsRef.current;
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null; // Prevent reconnection attempts
      
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(1000, "Component cleanup"); // Clean close with code
      }
      wsRef.current = null;
    }
    
    // 2. Audio cleanup
    if (soundRef.current) {
      console.log("Cleaning up audio resources");
      try {
        soundRef.current.pause();
        soundRef.current.currentTime = 0;
        soundRef.current.src = "";
        soundRef.current.load();
      } catch (error) {
        console.warn("Error cleaning up audio:", error);
      }
      soundRef.current = null;
    }
    
    // 3. Clear all refs
    rawBids.current = {};
    rawAsks.current = {};
    ordersRef.current = [];
    processedOrderIds.current.clear();
    lastLiquidationCheckRef.current = 0;
    liquidationInProgressRef.current = false;
    
    // 4. Clear orderbook cache
    orderbookCacheRef.current = {
      asks: Array(orderBookDepthRef.current).fill({ price: "0", qty: "0", total: "0", percentRatio: 0, rawTotal: 0 }),
      bids: Array(orderBookDepthRef.current).fill({ price: "0", qty: "0", total: "0", percentRatio: 0, rawTotal: 0 }),
      lastUpdate: 0
    };
    
    // 5. Reset orderbook update time
    orderbookUpdateTimeRef.current = 0;
    
    console.log("Resource cleanup completed");
  }, []);

  // Add window cleanup function for page unload
  const handleBeforeUnload = useCallback(() => {
    cleanupResources();
  }, [cleanupResources]);

  // Add visibility change handler for tab switching
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      console.log("Tab hidden, preserving connections");
      // Don't cleanup on tab switch, just log
    } else {
      console.log("Tab visible again");
      // Could reconnect if needed
    }
  }, []);

  // Add error boundary cleanup
  const handleWindowError = useCallback((event: ErrorEvent) => {
    console.error("Window error detected:", event.error);
    // Only cleanup on critical errors
    if (event.error?.name === "WebSocketError" || event.error?.message?.includes("WebSocket")) {
      console.log("WebSocket error detected, cleaning up connection");
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }
  }, []);

  // Enhanced cleanup for component unmount
  useEffect(() => {
    // Add global event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('error', handleWindowError);
    
    // Cleanup function
    return () => {
      console.log("Component unmounting, performing comprehensive cleanup");
      
      // Remove global event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('error', handleWindowError);
      
      // Perform complete resource cleanup
      cleanupResources();
    };
  }, [handleBeforeUnload, handleVisibilityChange, handleWindowError, cleanupResources]);

  // 기본 로딩 UI - 서버 사이드 렌더링에서 사용
  const fallbackUI = (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Loading trading interface...</h1>
    </div>
  );

  const commonProps = {
    userAssets,
    handleRechargeClick,
    userItems,
    mockConfig,

    // 주문
    orderType,
    setOrderType,
    direction,
    currentPrice,
    avgPrice,
    selectedPositionQuantity,

    // Order Book(호가)
    askOrders,
    bidOrders,
    smoothedAsks,
    smoothedBids,
    isPriceBid,
    recentTrades,
    bidsTotalVolume,
    asksTotalVolume,
    dropdownValue,
    setDropdownValue,
    isDropdownOpen,
    setIsDropdownOpen,
    buyPrice,
    sellPrice,
    buySize,
    sellSize,

    // 설정
    activeTab: symbol,
    activeDisplayTab,
    setActiveDisplayTab,
    orderbookMode,
    isSoundMute,
    setIsSoundMute,

    // 심볼 및 포지션 데이터
    symbol,
    allSymbolPrices,
    positionsBySymbol,

    // Modal
    isSelectMarginModalOpen,
    setIsSelectMarginModalOpen,
    handleConfirmMarginModal,
    isSelectLeverageModalOpen,
    setIsSelectLeverageModalOpen,
    handleConfirmLeverageModal,
    isBuySellModalOpen,
    setIsBuySellModalOpen,
    handleConfirmBuySellModal,
    isCancelOrderModalOpen,
    setIsCancelOrderModalOpen,
    handleConfirmCancelOrderModal,
    isCancelAllOrderModalOpen,
    setIsCancelAllOrderModalOpen,
    handleConfirmCancelAllOrderModal,
    isLimitCloseModalOpen,
    setIsLimitCloseModalOpen,
    handleConfirmLimitClose,
    isMarketCloseModalOpen,
    setIsMarketCloseModalOpen,
    handleConfirmMarketClose,
    isCloseAllModalOpen,
    setIsCloseAllModalOpen,
    handleConfirmCloseAllModal,

    // 클릭
    handleClickOrderPiceOnOrderBook,
    handleClickDropdown0point1,
    handleClickDropdown1,
    handleClickQuoteDisplay,
    handleClickMarginModal,
    handleClickLeverageModal,
    handleClickBuySellModal,
    handleClickCancelOrderModal,
    handleClickCancelAllOrderModal,
    handleClickCloseAllModal,
    handleClickLimitCloseModal,
    handleClickMarketCloseModal,
    
    // 하단
    activeOrderTab,
    setActiveOrderTab,
    positions,
    orders,
    pnls,

    // Pagination
    orderHistoryPage,
    setOrderHistoryPage: handleOrderHistoryPageChange,
    orderHistoryTotalPages: Math.ceil(orderHistoryTotal / orderHistoryItemsPerPage),
    orderHistoryItemsPerPage,
    pnlPage,
    setPnlPage: handlePnlPageChange,
    pnlTotalPages: Math.ceil(pnlTotal / pnlItemsPerPage),
    pnlItemsPerPage,

    orderPrice,
    setOrderPrice,
    qty,
    setQty,
    qtyInput,
    setQtyInput,
    calculatedPercentage,
    setCalculatedPercentage,
    calculateQtyByPercentage,
    calculateAvailableMargin
  }

  if (!isHydrated) {
    return fallbackUI;
  }

  return (
    <>
      <Desktop {...commonProps} />
      <Ipad {...commonProps} />
      <Mobile {...commonProps} />

      {/* Modals */}
      <Alert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        message={alertMessage}
      />

    </>
  );
}