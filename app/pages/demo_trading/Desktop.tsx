import { Link } from "@remix-run/react";
import { ChevronDown, ChevronDownIcon, RefreshCw } from "lucide-react";
import { UserOrder } from "~/api/user_orders";
import { UserPnl } from "~/api/user_pnls";
import Footer from "~/components/Footer";
import Pagination from "~/components/Pagination";
import TradingStats from "~/components/TradingStats";
import TradingViewWidget from "~/components/TradingViewWidget";
import { Position } from "~/store/positionStore";
import { UserAssets } from "~/store/userAssetsStore";
import { cn } from "~/utils";
import { useTranslation } from "~/i18n/TranslationContext";
import { MockInvestmentConfig } from "~/api/mock_investment_config";

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

interface SymbolPrice {
    symbol: string;
    price: number;
}

interface DesktopProps {
    userAssets: UserAssets | null;
    handleRechargeClick: () => void;
    userItems: Array<{ id: number, item?: { name: string }, quantity: number, item_id: number }>;
    mockConfig: MockInvestmentConfig | null;

    // 주문
    orderType: 'LIMIT' | 'MARKET';
    setOrderType: (orderType: 'LIMIT' | 'MARKET') => void;
    direction: string;
    currentPrice: number;
    avgPrice: number;
    selectedPositionQuantity: number;

    // Order Book(호가)
    askOrders: OrderBookEntry[];
    bidOrders: OrderBookEntry[];
    smoothedAsks: ProcessedOrderBookEntry[];
    smoothedBids: ProcessedOrderBookEntry[];
    isPriceBid: boolean;
    recentTrades: RecentTrade[];
    bidsTotalVolume: number;
    asksTotalVolume: number;
    dropdownValue: string;
    setDropdownValue: (value: string) => void;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (isOpen: boolean) => void;
    buyPrice: number;
    sellPrice: number;
    buySize: number;
    sellSize: number;

    // 설정
    activeTab: string;
    activeDisplayTab: string;
    setActiveDisplayTab: (tab: string) => void;
    orderbookMode: number;
    isSoundMute: boolean;
    setIsSoundMute: (isMute: boolean) => void;

    // 심볼 및 포지션 데이터
    symbol: string;
    allSymbolPrices: SymbolPrice[];
    positionsBySymbol: {
        [key: string]: {
            totalQuantity: number;
            avgEntryPrice: number;
            totalValue: number;
            unrealizedPnl: number;
        }
    };

    // Modal
    isSelectMarginModalOpen: boolean;
    setIsSelectMarginModalOpen: (isOpen: boolean) => void;
    handleConfirmMarginModal: (mode: 'cross' | 'isolated') => void;
    isSelectLeverageModalOpen: boolean;
    setIsSelectLeverageModalOpen: (isOpen: boolean) => void;
    handleConfirmLeverageModal: (leverage: number) => void;
    isBuySellModalOpen: boolean;
    setIsBuySellModalOpen: (isOpen: boolean) => void;
    handleConfirmBuySellModal: () => void;
    isCancelOrderModalOpen: boolean;
    setIsCancelOrderModalOpen: (isOpen: boolean) => void;
    handleConfirmCancelOrderModal: () => void;
    isCancelAllOrderModalOpen: boolean;
    setIsCancelAllOrderModalOpen: (isOpen: boolean) => void;
    handleConfirmCancelAllOrderModal: () => void;
    isLimitCloseModalOpen: boolean;
    setIsLimitCloseModalOpen: (isOpen: boolean) => void;
    handleConfirmLimitClose: (closePrice: number, closeQuantity: number) => void;
    isMarketCloseModalOpen: boolean;
    setIsMarketCloseModalOpen: (isOpen: boolean) => void;
    handleConfirmMarketClose: (closeQuantity: number) => void;
    isCloseAllModalOpen: boolean;
    setIsCloseAllModalOpen: (isOpen: boolean) => void;
    handleConfirmCloseAllModal: () => void;

    // 클릭
    handleClickOrderPiceOnOrderBook: (price: string) => void;
    handleClickDropdown0point1: () => void;
    handleClickDropdown1: () => void;
    handleClickQuoteDisplay: (mode: 1 | 2 | 3 | 4, depth: number) => void;
    handleClickMarginModal: () => void;
    handleClickLeverageModal: () => void;
    handleClickBuySellModal: (direction: 'Long' | 'Short') => void;
    handleClickCancelOrderModal: (order: UserOrder) => void;
    handleClickCancelAllOrderModal: () => void;
    handleClickCloseAllModal: () => void;
    handleClickLimitCloseModal: (position: Position) => void;
    handleClickMarketCloseModal: (position: Position) => void;

    // 하단
    activeOrderTab: string;
    setActiveOrderTab: (tab: string) => void;
    positions: Position[];
    orders: UserOrder[];
    pnls: UserPnl[];

    // Pagination for Order History
    orderHistoryPage: number;
    setOrderHistoryPage: (page: number) => void;
    orderHistoryTotalPages: number;
    orderHistoryItemsPerPage: number;

    // Pagination for P&L
    pnlPage: number;
    setPnlPage: (page: number) => void;
    pnlTotalPages: number;
    pnlItemsPerPage: number;

    orderPrice: number;
    setOrderPrice: (price: number) => void;
    qty: number;
    setQty: (qty: number) => void;
    calculatedPercentage: number;
    setCalculatedPercentage: (percentage: number) => void;
    calculateQtyByPercentage: (percentage: number) => void;
    calculateAvailableMargin: () => string;
    qtyInput: string;
    setQtyInput: (value: string) => void;
}

export default function Desktop({
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
    activeTab,
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
    setOrderHistoryPage,
    orderHistoryTotalPages,
    orderHistoryItemsPerPage,
    pnlPage,
    setPnlPage,
    pnlTotalPages,
    pnlItemsPerPage,

    orderPrice,
    setOrderPrice,
    qty,
    setQty,
    calculatedPercentage,
    setCalculatedPercentage,
    calculateQtyByPercentage,
    calculateAvailableMargin,
    qtyInput,
    setQtyInput

}: DesktopProps) {
    if (!userAssets) return null;
    const { t } = useTranslation();

    return (
        <div className="xl:dc-block dc-bg-black/20 dc-hidden dc-w-full dc-min-h-screen dc-px-16 dc-py-10 dc-rounded-[20px] dc-border dc-border-[#1F2126]">
            <TradingStats symbol={activeTab} />

            <hr className="dc-border-none dc-border-[#1F2126] dc-my-4" />

            {/* Trading Interface */}
            <div className="dc-flex dc-w-full dc-gap-12">
                {/* Left Column - Chart */}
                <div className="dc-w-[calc(100%-500px)] dc-h-680">
                    <div className="dc-h-[calc(100%-40px)]">
                        <TradingViewWidget symbol={activeTab} />
                    </div>
                    <p className="dc-text-10 dc-text-[#A4A8AB] dc-mt-2">
                        {t('trading.chartDisclaimer')}
                    </p>
                </div>

                {/* Right Column - Order Book & Trading Form */}
                <div className="dc-w-490 dc-h-680 dc-flex dc-gap-12">
                    {/* Order Book */}
                    <div className="dc-min-w-245 dc-w-245 dc-h-680 dc-bg-gradient-to-br dc-from-[#131416]/80 dc-to-[#0A0A0B]/80 dc-border dc-border-[#1F2126] dc-rounded-[20px] dc-p-8">
                        <div className="dc-flex dc-justify-between dc-h-40 dc-p-6 dc-gap-6 dc-bg-gradient-to-br dc-from-[#131416]/80 dc-to-[#0A0A0B]/80 dc-rounded-[12px] dc-border dc-border-[#1F2126] dc-mb-16">
                            <button
                                className={`dc-text-12 dc-w-1/2 dc-h-28 dc-flex dc-items-center dc-justify-center ${activeDisplayTab === "Order Book" ? "dc-text-white dc-bg-gradient-to-br dc-from-[#1C1E21] dc-to-[#111316]" : "dc-text-[#898D99]"} dc-outline-none dc-rounded-[8px]`}
                                onClick={() => setActiveDisplayTab("Order Book")}
                            >
                                {t('trading.orderBook')}
                            </button>
                            <button
                                className={`dc-text-12 dc-w-1/2 dc-h-28 dc-flex dc-items-center dc-justify-center ${activeDisplayTab === "Recent Trades" ? "dc-text-white dc-bg-gradient-to-br dc-from-[#1C1E21] dc-to-[#111316]" : "dc-text-[#898D99]"} dc-outline-none dc-rounded-[8px]`}
                                onClick={() => setActiveDisplayTab("Recent Trades")}
                            >
                                {t('trading.recentTrades')}
                            </button>
                        </div>

                        {activeDisplayTab === "Order Book" && (
                            <>
                                {orderbookMode === 1 && (
                                    <div className="dc-flex dc-flex-col dc-w-full dc-h-[calc(100%-60px)] dc-overflow-hidden dc-bg-[#100e0e]">
                                        {/* Order Book Header */}
                                        <div className="dc-px-8 dc-text-10 dc-h-36 dc-bg-[#0F0F0F] dc-flex dc-items-center dc-justify-between dc-mb-8 dc-text-[#A4A8AB]">
                                            <span>{t('trading.price')}(USDT)</span>
                                            <span>{t('trading.qty')}({symbol.replace('USDT', '')})</span>
                                            <span>{t('trading.total')}({symbol.replace('USDT', '')})</span>
                                        </div>

                                        {/* Ask Orders (Sell) */}
                                        <div className="dc-flex dc-flex-col dc-w-full dc-gap-4 dc-px-8 dc-mb-4">
                                            {askOrders.map((order, index) => (
                                                <div key={`ask-${index}`} className="dc-text-12 dc-relative dc-flex dc-items-center dc-justify-between dc-h-20">
                                                    <div className="dc-bg-[#3FB185] dc-bg-opacity-16 dc-absolute dc-top-0 dc-right-0 dc-h-full" style={{ width: `${smoothedAsks[index]?.percentRatio || 0}%`, zIndex: 0, transition: 'width 0.2s ease-out' }}></div>
                                                    <span className="dc-w-1/3 dc-text-[#3FB185] hover:dc-bg-[#333333] dc-cursor-pointer dc-z-10" onClick={() => handleClickOrderPiceOnOrderBook(order.price)}>{Number(order.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                    <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.qty).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>
                                                    <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Price Indicator */}
                                        <div className="dc-text-14 dc-h-36 dc-flex dc-items-center dc-justify-center dc-w-full dc-gap-8 dc-mb-4">
                                            {isPriceBid && <span className="dc-text-[#3FB185]">↑ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                                            {!isPriceBid && <span className="dc-text-[#FF2B64]">↓ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>}
                                            <span className="dc-flex dc-items-center">
                                                <span className="dc-mr-8 dc-text-white">⚑</span>
                                                <span>{Number(avgPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </span>
                                        </div>

                                        {/* Bid Orders (Buy) */}
                                        <div className="dc-flex dc-flex-col dc-w-full dc-gap-4 dc-px-8 dc-mb-4">
                                            {bidOrders.map((order, index) => (
                                                <div key={`bid-${index}`} className="dc-text-12 dc-relative dc-flex dc-items-center dc-justify-between dc-h-20">
                                                    <div className="dc-bg-[#FF2B64] dc-bg-opacity-16 dc-absolute dc-top-0 dc-right-0 dc-h-full" style={{ width: `${smoothedBids[index]?.percentRatio || 0}%`, zIndex: 0, transition: 'width 0.2s ease-out' }}></div>
                                                    <span className="dc-w-1/3 dc-text-[#FF2B64] hover:dc-bg-[#333333] dc-cursor-pointer dc-z-10" onClick={() => handleClickOrderPiceOnOrderBook(order.price)}>{Number(order.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                    <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.qty).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>
                                                    <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Buy/Sell Percentage Indicator */}
                                        <div className="dc-h-36 buy-sell-indicator dc-flex dc-flex-col dc-w-full dc-px-8">
                                            <div className="dc-flex dc-items-center dc-justify-between dc-mb-6">
                                                <div className="dc-flex dc-items-center dc-mr-4">
                                                    <div className="dc-w-20 dc-h-20 dc-rounded-sm dc-bg-[#FF2B64] dc-mr-4"></div>
                                                    <span className="dc-text-12 bid-percent">{Math.round((bidsTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%</span>
                                                </div>
                                                <div className="dc-flex dc-items-center dc-ml-4">
                                                    <span className="dc-text-12 ask-percent">{Math.round((asksTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%</span>
                                                    <div className="dc-w-20 dc-h-20 dc-rounded-sm dc-bg-[#3FB185] dc-ml-4"></div>
                                                </div>
                                            </div>
                                            <div className="dc-flex dc-items-center">
                                                <div className="dc-h-1 dc-bg-[#FF2B64] dc-rounded-l-full" style={{
                                                    width: `${Math.round((bidsTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%`
                                                }}></div>
                                                <div className="dc-h-1 dc-bg-[#3FB185] dc-rounded-r-full" style={{
                                                    width: `${Math.round((asksTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%`
                                                }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {orderbookMode === 2 && (
                                    <div className="dc-flex dc-flex-col dc-w-full dc-h-[calc(100%-60px)]">
                                        {/* Price Indicator */}
                                        <div className="dc-text-14 dc-h-36 dc-flex dc-items-center dc-justify-center dc-w-full dc-gap-8 dc-mb-4">
                                            {isPriceBid && <span className="dc-text-[#3FB185]">↑ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>}
                                            {!isPriceBid && <span className="dc-text-[#FF2B64]">↓ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>}
                                            <span className="dc-flex dc-items-center">
                                                <span className="dc-mr-8 dc-text-white">⚑</span>
                                                <span>{Number(avgPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                            </span>
                                        </div>

                                        {/* Order Book Header */}
                                        <div className="dc-px-8 dc-text-12 dc-h-36 dc-bg-[#0F0F0F] dc-flex dc-items-center dc-justify-between dc-mb-8 dc-text-white">
                                            <span>{t('trading.qty')}</span>
                                            <span>{t('trading.price')}</span>
                                            <span>{t('trading.price')}</span>
                                            <span>{t('trading.qty')}</span>
                                        </div>

                                        {/* Ask Orders (Sell) && Bid Orders (Buy) */}
                                        <div className="dc-flex dc-flex-col dc-w-full dc-gap-8 dc-px-8 dc-mb-4">
                                            {Array.from({ length: Math.max(askOrders.length, bidOrders.length) }).map((_, index) => (
                                                <div key={`row-${index}`} className="dc-text-12 dc-min-h-20 dc-flex dc-items-center">
                                                    {/* Bid Side */}
                                                    <div className="dc-relative dc-flex dc-items-center dc-w-1/2">
                                                        {index < bidOrders.length && (
                                                            <>
                                                                <div className="dc-bg-[#FF2B64] dc-bg-opacity-16 dc-absolute dc-top-0 dc-right-0 dc-h-full" style={{ width: `${smoothedBids[index]?.percentRatio || 0}%`, zIndex: 0, transition: 'width 0.2s ease-out' }}></div>
                                                                <span className="dc-z-10 dc-w-1/2 dc-text-left">{Number(bidOrders[index].qty).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                                <span className="dc-w-1/2 dc-text-center dc-text-[#FF2B64] hover:dc-bg-[#333333] dc-cursor-pointer dc-z-10" onClick={() => handleClickOrderPiceOnOrderBook(bidOrders[index].price)}>{Number(bidOrders[index].price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    {/* Ask Side */}
                                                    <div className="dc-relative dc-flex dc-items-center dc-w-1/2">
                                                        {index < askOrders.length && (
                                                            <>
                                                                <div className="dc-bg-[#3FB185] dc-bg-opacity-16 dc-absolute dc-top-0 dc-left-0 dc-h-full" style={{ width: `${smoothedAsks[askOrders.length - 1 - index]?.percentRatio || 0}%`, zIndex: 0, transition: 'width 0.2s ease-out' }}></div>
                                                                <span className="dc-w-1/2 dc-text-center dc-text-[#3FB185] hover:dc-bg-[#333333] dc-cursor-pointer dc-z-10" onClick={() => handleClickOrderPiceOnOrderBook(askOrders[askOrders.length - 1 - index].price)}>{Number(askOrders[askOrders.length - 1 - index].price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                                <span className="dc-z-10 dc-w-1/2 dc-text-left">{Number(askOrders[askOrders.length - 1 - index].qty).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Buy/Sell Percentage Indicator */}
                                        <div className="dc-h-36 buy-sell-indicator dc-flex dc-flex-col dc-w-full dc-px-8">
                                            <div className="dc-flex dc-items-center dc-justify-between dc-mb-6">
                                                <div className="dc-flex dc-items-center dc-mr-4">
                                                    <div className="dc-w-20 dc-h-20 dc-rounded-sm dc-bg-[#FF2B64] dc-mr-4"></div>
                                                    <span className="dc-text-12 bid-percent">{Math.round((bidsTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%</span>
                                                </div>
                                                <div className="dc-flex dc-items-center dc-ml-4">
                                                    <span className="dc-text-12 ask-percent">{Math.round((asksTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%</span>
                                                    <div className="dc-w-20 dc-h-20 dc-rounded-sm dc-bg-[#3FB185] dc-ml-4"></div>
                                                </div>
                                            </div>
                                            <div className="dc-flex dc-items-center">
                                                <div className="dc-h-8 dc-bg-[#FF2B64] dc-rounded-l-full" style={{
                                                    width: `${Math.round((bidsTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%`
                                                }}></div>
                                                <div className="dc-h-8 dc-bg-[#3FB185] dc-rounded-r-full" style={{
                                                    width: `${Math.round((asksTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%`
                                                }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {orderbookMode === 3 && (
                                    <div className="dc-flex dc-flex-col dc-w-full dc-h-[calc(100%-60px)]">
                                        {/* Price Indicator */}
                                        <div className="dc-text-14 dc-h-36 dc-flex dc-items-center dc-justify-center dc-w-full dc-gap-8 dc-mb-4">
                                            {isPriceBid && <span className="dc-text-[#3FB185]">↑ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>}
                                            {!isPriceBid && <span className="dc-text-[#FF2B64]">↓ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>}
                                            <span className="dc-flex dc-items-center">
                                                <span className="dc-mr-8 dc-text-white">⚑</span>
                                                <span>{Number(avgPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                            </span>
                                        </div>

                                        {/* Order Book Header */}
                                        <div className="dc-px-8 dc-text-12 dc-h-36 dc-bg-[#0F0F0F] dc-flex dc-items-center dc-justify-between dc-mb-8 dc-text-white">
                                            <span>Price(USDT)</span>
                                            <span>Qty({symbol.replace('USDT', '')})</span>
                                            <span>Total({symbol.replace('USDT', '')})</span>
                                        </div>

                                        {/* Bid Orders (Buy) */}
                                        <div className="dc-flex dc-flex-col dc-w-full dc-gap-8 dc-px-8 dc-mb-4">
                                            {bidOrders.map((order, index) => (
                                                <div key={`bid-${index}`} className="dc-text-12 dc-relative dc-flex dc-items-center dc-justify-between dc-h-20">
                                                    <div className="dc-bg-[#FF2B64] dc-bg-opacity-16 dc-absolute dc-top-0 dc-right-0 dc-h-full" style={{ width: `${smoothedBids[index]?.percentRatio || 0}%`, zIndex: 0, transition: 'width 0.2s ease-out' }}></div>
                                                    <span className="dc-w-1/3 dc-text-[#FF2B64] hover:dc-bg-[#333333] dc-cursor-pointer dc-z-10" onClick={() => handleClickOrderPiceOnOrderBook(order.price)}>{Number(order.price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                    <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.qty).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                    <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Buy/Sell Percentage Indicator */}
                                        <div className="dc-h-36 buy-sell-indicator dc-flex dc-flex-col dc-w-full dc-px-8">
                                            <div className="dc-flex dc-items-center dc-justify-between dc-mb-6">
                                                <div className="dc-flex dc-items-center dc-mr-4">
                                                    <div className="dc-w-20 dc-h-20 dc-rounded-sm dc-bg-[#FF2B64] dc-mr-4"></div>
                                                    <span className="dc-text-12 bid-percent">{Math.round((bidsTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%</span>
                                                </div>
                                                <div className="dc-flex dc-items-center dc-ml-4">
                                                    <span className="dc-text-12 ask-percent">{Math.round((asksTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%</span>
                                                    <div className="dc-w-20 dc-h-20 dc-rounded-sm dc-bg-[#3FB185] dc-ml-4"></div>
                                                </div>
                                            </div>
                                            <div className="dc-flex dc-items-center">
                                                <div className="dc-h-8 dc-bg-[#FF2B64] dc-rounded-l-full" style={{
                                                    width: `${Math.round((bidsTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%`
                                                }}></div>
                                                <div className="dc-h-8 dc-bg-[#3FB185] dc-rounded-r-full" style={{
                                                    width: `${Math.round((asksTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%`
                                                }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {orderbookMode === 4 && (
                                    <div className="dc-flex dc-flex-col dc-w-full dc-h-[calc(100%-60px)]">
                                        {/* Price Indicator */}
                                        <div className="dc-text-14 dc-h-36 dc-flex dc-items-center dc-justify-center dc-w-full dc-gap-8 dc-mb-4">
                                            {isPriceBid && <span className="dc-text-[#3FB185]">↑ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>}
                                            {!isPriceBid && <span className="dc-text-[#FF2B64]">↓ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>}
                                            <span className="dc-flex dc-items-center">
                                                <span className="dc-mr-8 dc-text-white">⚑</span>
                                                <span>{Number(avgPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                            </span>
                                        </div>

                                        {/* Order Book Header */}
                                        <div className="dc-px-8 dc-text-12 dc-h-36 dc-bg-[#0F0F0F] dc-flex dc-items-center dc-justify-between dc-mb-8 dc-text-white">
                                            <span>Price(USDT)</span>
                                            <span>Qty({symbol.replace('USDT', '')})</span>
                                            <span>Total({symbol.replace('USDT', '')})</span>
                                        </div>

                                        {/* Ask Orders (Sell) */}
                                        <div className="dc-flex dc-flex-col dc-w-full dc-gap-8 dc-px-8 dc-mb-4">
                                            {askOrders.map((order, index) => (
                                                <div key={`ask-${index}`} className="dc-text-12 dc-relative dc-flex dc-items-center dc-justify-between dc-h-20">
                                                    <div className="dc-bg-[#3FB185] dc-bg-opacity-16 dc-absolute dc-top-0 dc-right-0 dc-h-full" style={{ width: `${smoothedAsks[index]?.percentRatio || 0}%`, zIndex: 0, transition: 'width 0.2s ease-out' }}></div>
                                                    <span className="dc-w-1/3 dc-text-[#3FB185] hover:dc-bg-[#333333] dc-cursor-pointer dc-z-10" onClick={() => handleClickOrderPiceOnOrderBook(order.price)}>{Number(order.price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                    <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.qty).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                    <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Buy/Sell Percentage Indicator */}
                                        <div className="dc-h-36 buy-sell-indicator dc-flex dc-flex-col dc-w-full dc-px-8">
                                            <div className="dc-flex dc-items-center dc-justify-between dc-mb-6">
                                                <div className="dc-flex dc-items-center dc-mr-4">
                                                    <div className="dc-w-20 dc-h-20 dc-rounded-sm dc-bg-[#FF2B64] dc-mr-4"></div>
                                                    <span className="dc-text-12 bid-percent">{Math.round((bidsTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%</span>
                                                </div>
                                                <div className="dc-flex dc-items-center dc-ml-4">
                                                    <span className="dc-text-12 ask-percent">{Math.round((asksTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%</span>
                                                    <div className="dc-w-20 dc-h-20 dc-rounded-sm dc-bg-[#3FB185] dc-ml-4"></div>
                                                </div>
                                            </div>
                                            <div className="dc-flex dc-items-center">
                                                <div className="dc-h-8 dc-bg-[#FF2B64] dc-rounded-l-full" style={{
                                                    width: `${Math.round((bidsTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%`
                                                }}></div>
                                                <div className="dc-h-8 dc-bg-[#3FB185] dc-rounded-r-full" style={{
                                                    width: `${Math.round((asksTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%`
                                                }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {activeDisplayTab === "Recent Trades" && (
                            <div className="dc-flex dc-flex-col dc-w-full dc-h-[calc(100%-100px)]">
                                {/* Recent Trades Header */}
                                <div className="dc-px-8 dc-text-12 dc-h-36 dc-bg-[#0F0F0F] dc-flex dc-items-center dc-justify-between dc-mb-8 dc-text-white">
                                    <span>Price(USDT)</span>
                                    <span>Qty({symbol.replace('USDT', '')})</span>
                                    <span>Time</span>
                                </div>

                                {/* Recent Trades List */}
                                <div className="dc-flex dc-flex-col dc-w-full dc-h-[calc(100%-36px)] dc-px-8 dc-overflow-auto">
                                    {recentTrades.length > 0 ? (
                                        recentTrades.map((trade, index) => {
                                            // 다음 거래와 가격이 다를 때만 화살표 표시
                                            const nextTrade = index < recentTrades.length - 1 ? recentTrades[index + 1] : null;
                                            const isPriceDifferent = !nextTrade || parseFloat(trade.price) !== parseFloat(nextTrade.price);

                                            return (
                                                <div key={`trade-${index}`} className="dc-text-12 dc-min-h-24 dc-flex dc-items-center dc-justify-between">
                                                    <span className={`dc-w-1/3 ${trade.type === 'buy' ? 'dc-text-[#3FB185]' : 'dc-text-[#FF2B64]'}`}>
                                                        {Number(parseFloat(trade.price)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        {isPriceDifferent && (trade.type === 'buy' ? '↑' : '↓')}
                                                    </span>
                                                    <span className="dc-w-1/3 dc-text-right">{Number(trade.qty).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>
                                                    <span className="dc-w-1/3 dc-text-right dc-text-gray-500">{trade.time}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        // Fallback to show when no trades are loaded yet
                                        <div className="dc-text-12 dc-flex dc-items-center dc-justify-center dc-h-32">
                                            <span className="dc-text-gray-500">Loading trades data...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Quote Display */}
                        {/* <div className="dc-flex dc-items-center dc-justify-between dc-w-full dc-h-56">
                            <div className="dc-flex">
                                <img 
                                    src={orderbookMode === 1 ? "/images/quote_display1_active.svg" : "/images/quote_display1.svg"} 
                                    alt="quote_display1" 
                                    className="dc-w-24 dc-h-24 dc-cursor-pointer" 
                                    onClick={() => handleClickQuoteDisplay(1, 11)} 
                                />
                                <img 
                                    src={orderbookMode === 2 ? "/images/quote_display2_active.svg" : "/images/quote_display2.svg"} 
                                    alt="quote_display2" 
                                    className="dc-w-24 dc-h-24 dc-cursor-pointer" 
                                    onClick={() => handleClickQuoteDisplay(2, 19)} 
                                />
                                <img 
                                    src={orderbookMode === 3 ? "/images/quote_display3_active.svg" : "/images/quote_display3.svg"} 
                                    alt="quote_display3" 
                                    className="dc-w-24 dc-h-24 dc-cursor-pointer" 
                                    onClick={() => handleClickQuoteDisplay(3, 19)} 
                                />
                                <img 
                                    src={orderbookMode === 4 ? "/images/quote_display4_active.svg" : "/images/quote_display4.svg"} 
                                    alt="quote_display4" 
                                    className="dc-w-24 dc-h-24 dc-cursor-pointer" 
                                    onClick={() => handleClickQuoteDisplay(4, 19)} 
                                />
                            </div>
                            <div className="dc-flex">
                                <div className="dc-relative">
                                    <div 
                                        className="dc-px-12 dc-w-120 dc-h-34 dc-flex dc-items-center dc-justify-between dc-bg-[#0F0F0F] dc-rounded-sm dc-cursor-pointer"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span className="dc-text-14 dc-mr-8">{dropdownValue}</span>
                                        <ChevronDown className="dc-w-16 dc-h-16" />
                                    </div>
                                    
                                    {isDropdownOpen && (
                                        <div className="dc-absolute dc-top-full dc-left-0 dc-mt-1 dc-w-120 dc-bg-[#1F1F1F] dc-rounded-sm dc-shadow-lg dc-z-50">
                                            <div 
                                                className="dc-px-12 dc-py-8 hover:dc-bg-[#2F2F2F] dc-cursor-pointer"
                                                onClick={handleClickDropdown0point1}
                                            >
                                                <span className="dc-text-14">0.1</span>
                                            </div>
                                            <div 
                                                className="dc-px-12 dc-py-8 hover:dc-bg-[#2F2F2F] dc-cursor-pointer"
                                                onClick={handleClickDropdown1}
                                            >
                                                <span className="dc-text-14">1</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div> */}
                    </div>

                    {/* Trading Form */}
                    <div className="dc-w-245 dc-h-680 dc-bg-gradient-to-br dc-from-[#131416]/80 dc-to-[#0A0A0B]/80 dc-border dc-border-[#1F2126] dc-rounded-[20px] dc-p-8">
                        {/* Order Type Tabs */}
                        <div className="dc-p-6 dc-flex dc-items-center dc-justify-between dc-w-full dc-bg-gradient-to-br dc-from-[#131416]/80 dc-to-[#0A0A0B]/80 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px] dc-h-40 dc-gap-6 dc-mb-12">
                            <button
                                className={`dc-flex-1 dc-h-28 dc-flex dc-items-center dc-justify-center dc-text-10 dc-rounded-[8px] ${orderType === "LIMIT" ? "dc-text-white dc-bg-gradient-to-br dc-from-[#1C1E21]/80 dc-to-[#111316]/80" : "dc-text-[#898D99]"}`}
                                onClick={() => setOrderType("LIMIT")}
                            >
                                {t('trading.limit')}
                            </button>
                            <button
                                className={`dc-flex-1 dc-h-28 dc-flex dc-items-center dc-justify-center dc-text-10 dc-rounded-[8px] ${orderType === "MARKET" ? "dc-text-white dc-bg-gradient-to-br dc-from-[#1C1E21]/80 dc-to-[#111316]/80" : "dc-text-[#898D99]"}`}
                                onClick={() => setOrderType("MARKET")}
                            >
                                {t('trading.market')}
                            </button>
                        </div>

                        {/* Position Type */}
                        <div className="dc-h-36 dc-text-11 dc-flex dc-justify-between dc-w-full dc-gap-8 dc-mb-16">
                            <div
                                className="dc-bg-opacity-2 dc-border-opacity-6 flex-grow basis-0 dc-flex dc-items-center dc-justify-between dc-h-full dc-px-12 dc-py-8 dc-bg-white dc-border dc-border-white dc-rounded-[8px] dc-cursor-pointer"
                                onClick={handleClickMarginModal}
                            >
                                <span className="dc-text-11 dc-mr-8">{userAssets?.margin_mode?.charAt(0).toUpperCase() + userAssets?.margin_mode?.slice(1)}</span>
                                <ChevronDownIcon className="dc-w-16 dc-h-16" color="#FDB41D" />
                            </div>
                            <div
                                className="dc-bg-opacity-2 dc-border-opacity-6 flex-grow basis-0 dc-flex dc-items-center dc-justify-between dc-h-full dc-px-12 dc-py-8 dc-bg-white dc-border dc-border-white dc-rounded-[8px] dc-cursor-pointer"
                                onClick={handleClickLeverageModal}
                            >
                                <span className="dc-text-11 dc-mr-8">{userAssets.leverage}x</span>
                                <ChevronDownIcon className="dc-w-16 dc-h-16" color="#FDB41D" />
                            </div>
                        </div>

                        {/* Price Input */}
                        <div className="dc-mb-16">
                            <div className={`dc-h-36 dc-flex dc-items-center dc-justify-between dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px] dc-px-12`}>
                                {orderType === "MARKET" ? (
                                    <div className="dc-text-11 dc-w-full dc-text-[#777777]">{t('trading.currentPriceAtPurchase')}</div>
                                ) : (
                                    <input
                                        type="text"
                                        value={orderPrice}
                                        id="order_price_input"
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/,/g, '');
                                            // Only allow numbers and up to 1 decimal place
                                            if (/^(\d+)?(\.\d{0,1})?$/.test(value) || value === '') {
                                                const numValue = Number(value);
                                                if (numValue > 0) {
                                                    setOrderPrice(numValue);
                                                }
                                            }
                                        }}
                                        className={`dc-text-11 dc-w-full dc-text-white dc-bg-transparent dc-border-none dc-outline-none`}
                                    />
                                )}
                                <div className={`dc-flex dc-items-center ${orderType === "MARKET" ? "dc-opacity-50" : ""}`}>
                                    <div
                                        className={`dc-flex dc-items-center dc-justify-center dc-w-20 dc-h-20 dc-text-11 dc-text-[#FDB41D] dc-underline`}
                                        onClick={() => {
                                            if (orderType !== "MARKET") {
                                                setOrderPrice(currentPrice);
                                            }
                                        }}
                                    >
                                        Last
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quantity Input */}
                        <div className="dc-mb-16">
                            <div className="dc-h-36 dc-flex dc-items-center dc-justify-between dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px] dc-px-12">
                                <input
                                    type="text"
                                    value={qtyInput}
                                    id="qty_input"
                                    className="dc-text-11 dc-w-full dc-text-white dc-bg-transparent dc-border-none dc-outline-none"
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        // Allow empty input or just decimal point
                                        if (value === '' || value === '.') {
                                            setQtyInput(value);
                                            return;
                                        }

                                        // Allow only valid decimal numbers with up to 3 decimal places
                                        if (/^\d*\.?\d{0,3}$/.test(value)) {
                                            setQtyInput(value);
                                            setQty(Number(value) || 0);
                                            setCalculatedPercentage(0);
                                        }
                                    }}
                                />
                                <span className="dc-text-10 dc-text-[#898D99]">{symbol.replace('USDT', '')}</span>
                            </div>
                        </div>

                        {/* Percentage Buttons */}
                        <div className="dc-h-28 dc-flex dc-w-full dc-items-center dc-bg-gradient-to-br dc-from-[#131416]/80 dc-to-[#0A0A0B]/80 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px] dc-mb-16">
                            <button
                                className={`dc-text-10 dc-flex dc-items-center dc-justify-center dc-w-1/5 dc-h-20 ${calculatedPercentage === 10 ? "dc-text-white dc-font-bold dc-bg-[#FDB41D] dc-rounded-[8px]" : "dc-text-[#898D99]"}`}
                                onClick={() => calculateQtyByPercentage(10)}
                            >
                                10%
                            </button>
                            <button
                                className={`dc-w-1/5 dc-h-20 dc-flex dc-items-center dc-justify-center dc-text-10 ${calculatedPercentage === 25 ? "dc-text-white dc-font-bold dc-bg-[#FDB41D] dc-rounded-[8px]" : "dc-text-[#898D99]"}`}
                                onClick={() => calculateQtyByPercentage(25)}
                            >
                                25%
                            </button>
                            <button
                                className={`dc-text-10 dc-flex dc-items-center dc-justify-center dc-w-1/5 dc-h-20 ${calculatedPercentage === 50 ? "dc-text-white dc-font-bold dc-bg-[#FDB41D] dc-rounded-[8px]" : "dc-text-[#898D99]"}`}
                                onClick={() => calculateQtyByPercentage(50)}
                            >
                                50%
                            </button>
                            <button
                                className={`dc-text-10 dc-flex dc-items-center dc-justify-center dc-w-1/5 dc-h-20 ${calculatedPercentage === 75 ? "dc-text-white dc-font-bold dc-bg-[#FDB41D] dc-rounded-[8px]" : "dc-text-[#898D99]"}`}
                                onClick={() => calculateQtyByPercentage(75)}
                            >
                                75%
                            </button>
                            <button
                                className={`dc-text-10 dc-flex dc-items-center dc-justify-center dc-w-1/5 dc-h-20 ${calculatedPercentage === 100 ? "dc-text-white dc-font-bold dc-bg-[#FDB41D] dc-rounded-[8px]" : "dc-text-[#898D99]"}`}
                                onClick={() => calculateQtyByPercentage(100)}
                            >
                                100%
                            </button>
                        </div>

                        <div className="dc-w-full dc-h-104 dc-flex dc-flex-col dc-items-center dc-justify-center dc-mb-16 dc-px-16 dc-py-10 dc-gap-6 dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px]">
                            {/* Buy/Sell Prices */}
                            <div className="dc-flex dc-items-center dc-justify-between dc-w-full">
                                <span className="dc-text-11 dc-text-[#898D99]">{t('trading.buyPrice')}</span>
                                <span className="dc-text-11 dc-text-[#3FB185]">{Number(buyPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                            </div>
                            <div className="dc-flex dc-items-center dc-justify-between dc-w-full">
                                <span className="dc-text-11 dc-text-[#898D99]">{t('trading.sellPrice')}</span>
                                <span className="dc-text-11 dc-text-[#FF2B64]">{Number(sellPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                            </div>

                            <hr className="dc-border-opacity-6 dc-w-full dc-h-1 dc-border dc-border-white" />

                            {/* Buy/Sell Sizes */}
                            <div className="dc-flex dc-items-center dc-justify-between dc-w-full">
                                <span className="dc-text-11 dc-text-[#898D99]">{t('trading.buySize')}</span>
                                <span className="dc-text-11 dc-text-[#3FB185]">{Number(buySize).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                            </div>
                            <div className="dc-flex dc-items-center dc-justify-between dc-w-full">
                                <span className="dc-text-11 dc-text-[#898D99]">{t('trading.sellSize')}</span>
                                <span className="dc-text-11 dc-text-[#FF2B64]">{Number(sellSize).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="dc-h-68 dc-grid dc-w-full grid-rows-2 dc-gap-4 dc-mb-16">
                            <button
                                className="dc-text-12 dc-bg-[#3FB185] dc-text-white dc-font-bold dc-rounded-[8px]"
                                onClick={() => handleClickBuySellModal("Long")}
                            >
                                {t('trading.buyLong')}
                            </button>
                            <button
                                className="dc-text-12 dc-bg-[#FF2B64] dc-text-white dc-font-bold dc-rounded-[8px]"
                                onClick={() => handleClickBuySellModal("Short")}
                            >
                                {t('trading.sellShort')}
                            </button>
                        </div>

                        {/* Account Info */}
                        <div className="dc-w-full dc-h-132 dc-p-8 dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px] dc-mb-8">
                            <div className="dc-flex dc-justify-between dc-mb-8">
                                <span className="dc-text-10 dc-text-[#898D99]">{t('trading.value')}</span>
                                <span className="dc-text-10 dc-text-white">{(() => {
                                    // Calculate unrealized P&L from all positions
                                    const unrealizedPnL = positions.reduce((total, position) => {
                                        let positionPnl = 0;
                                        const symbolPrice = allSymbolPrices.find(price => price.symbol === position.symbol);
                                        if (position.direction === "LONG") {
                                            positionPnl = Number(position.quantity) * Number(symbolPrice?.price) - Number(position.quantity) * Number(position.entry_price);
                                        } else { // SHORT
                                            positionPnl = Number(position.quantity) * Number(position.entry_price) - Number(position.quantity) * Number(symbolPrice?.price);
                                        }
                                        return total + positionPnl;
                                    }, 0);

                                    // Calculate realized P&L from positions
                                    const realizedPnL = positions.reduce((total, position) => {
                                        return total - (Number(position.quantity) * Number(position.entry_price) * (mockConfig?.market_order_fee_rate || 0.055) * 0.01);
                                    }, 0);

                                    // Sum up the values
                                    const totalValue = Number(userAssets?.usdt_balance) + unrealizedPnL + realizedPnL;
                                    return Number(totalValue.toFixed(1)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                                })()}</span>
                            </div>
                            <div className="dc-flex dc-justify-between dc-mb-8">
                                <span className="dc-text-10 dc-text-[#898D99]">{t('trading.balance')}</span>
                                <span className="dc-text-10 dc-text-white">{Number((Number(userAssets?.usdt_balance) || 0).toFixed(1)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                            </div>
                            <div className="dc-flex dc-justify-between">
                                <span className="dc-text-10 dc-text-[#898D99]">{t('trading.available')}</span>
                                <span className="dc-text-10 dc-text-white">{Number(calculateAvailableMargin()).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                            </div>

                            <hr className="dc-border-opacity-6 dc-w-full dc-h-1 dc-my-8 dc-border dc-border-white" />

                            {/* Additional Info */}
                            <div className="dc-flex dc-justify-between dc-mb-8">
                                <span className="dc-text-10 dc-text-[#898D99]">{t('trading.forcedLiquidation')}</span>
                                <span className="dc-text-10 dc-text-[#E8E8E8]">{((mockConfig?.liquidation_threshold_ratio || 0.6) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="dc-flex dc-justify-between">
                                <span className="dc-text-10 dc-text-[#898D99]">{t('trading.fee')}</span>
                                <span className="dc-text-10 dc-text-[#E8E8E8]">{((mockConfig?.limit_order_fee_rate || 0.02) * 100).toFixed(2)}% / {((mockConfig?.market_order_fee_rate || 0.055) * 100).toFixed(3)}%</span>
                            </div>
                        </div>

                        {/* Recharge Button */}
                        <button
                            onClick={handleRechargeClick}
                            className="dc-p-4 dc-w-full dc-h-40 dc-text-12 dc-bg-gradient-to-br dc-from-[#131416]/80 dc-to-[#0A0A0B]/80 dc-border dc-border-white dc-border-opacity-6 dc-text-white dc-rounded-[8px] dc-flex dc-items-center dc-justify-center"
                        >
                            <div className="dc-w-full dc-h-full dc-flex dc-items-center dc-justify-center dc-bg-gradient-to-br dc-from-[#1C1E21] dc-to-[#111316] dc-text-white dc-rounded-[8px]">
                                {userAssets?.free_recharge && userAssets.free_recharge > 0
                                    ? `Free Recharge(${userAssets.free_recharge})`
                                    : userItems?.find(item => item.item?.name === "USDT Recharge" && item.quantity > 0)
                                        ? `Recharge Item(${userItems.find(item => item.item?.name === "USDT Recharge")?.quantity || 0})`
                                        : t('trading.recharge')}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Positions and Orders */}
            <div className="dc-mb-24">
                <div className="dc-min-h-400 dc-p-4">
                    {/* Tabs */}
                    <div className="dc-flex dc-items-center dc-justify-between dc-h-48 dc-mb-4">
                        <div className="dc-p-8 dc-flex dc-items-center dc-justify-between dc-bg-gradient-to-br dc-from-[#131416] dc-to-[#0A0A0B] dc-border dc-border-white dc-border-opacity-6 dc-rounded-[16px]">
                            <button
                                className={`dc-px-20 dc-h-32 dc-text-14 ${activeOrderTab === "Position" ? "dc-text-white dc-bg-[#FDB41D] dc-rounded-[12px]" : "dc-text-white"}`}
                                onClick={() => setActiveOrderTab("Position")}
                            >
                                {t('trading.position')}({positions.length})
                            </button>
                            <button
                                className={`dc-px-20 dc-h-32 dc-text-14 ${activeOrderTab === "Current Orders" ? "dc-text-white dc-bg-[#FDB41D] dc-rounded-[12px]" : "dc-text-white"}`}
                                onClick={() => setActiveOrderTab("Current Orders")}
                            >
                                {t('trading.currentOrders')}({orders.filter(order => order.status === "PENDING").length})
                            </button>
                            <button
                                className={`dc-px-20 dc-h-32 dc-text-14 ${activeOrderTab === "Order History" ? "dc-text-white dc-bg-[#FDB41D] dc-rounded-[12px]" : "dc-text-white"}`}
                                onClick={() => setActiveOrderTab("Order History")}
                            >
                                {t('trading.orderHistory')}
                            </button>
                            <button
                                className={`dc-px-20 dc-h-32 dc-text-14 ${activeOrderTab === "PnL" ? "dc-text-white dc-bg-[#FDB41D] dc-rounded-[12px]" : "dc-text-white"}`}
                                onClick={() => setActiveOrderTab("PnL")}
                            >
                                {t('trading.pnl')}
                            </button>
                        </div>

                        <div className="dc-flex dc-items-center dc-justify-end dc-gap-4 dc-mb-10 dc-ml-auto">
                            {isSoundMute && <img src="/images/check_circle.png" alt="mute" className="dc-w-16 dc-h-16 dc-ml-auto dc-rounded-sm dc-cursor-pointer" onClick={() => setIsSoundMute(false)} />}
                            {!isSoundMute && <img src="/images/check_white_circle.png" alt="mute" className="dc-w-16 dc-h-16 dc-ml-auto dc-rounded-sm dc-cursor-pointer" onClick={() => setIsSoundMute(true)} />}
                            <span className="dc-text-10 dc-text-[#898D99] dc-mr-20">{t('trading.sound')}</span>
                            {activeOrderTab === "Position" && <button className="dc-ml-auto dc-text-12 dc-h-36 dc-px-16 dc-py-2  dc-text-white dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-2 dc-rounded-[24px]" onClick={handleClickCloseAllModal}>{t('trading.closeAll')}</button>}
                            {activeOrderTab === "Current Orders" && <button className="dc-ml-auto dc-text-12 dc-h-36 dc-px-16 dc-py-2 dc-text-white dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-2 dc-rounded-[24px]" onClick={handleClickCancelAllOrderModal}>{t('trading.cancelAll')}</button>}
                        </div>
                    </div>

                    {/* <hr className="dc-border-opacity-6 dc-w-full dc-h-1 dc-mt-20 dc-mb-16 dc-border-b dc-border-white" /> */}

                    {/* Position Table */}
                    {activeOrderTab === "Position" && (
                        <div className="">
                            <table className="dc-w-full dc-border-separate">
                                <thead className="dc-relative">
                                    <div className="dc-absolute dc-left-0 dc-top-3 dc-w-full dc-h-52 dc-bg-white dc-bg-opacity-2 dc-border-opacity-6 dc-border dc-border-white dc-rounded-[40px]" />
                                    <tr className="dc-text-12 dc-h-52 dc-text-white">
                                        <th className="dc-font-normal dc-text-center">{t('trading.contracts')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.qty')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.value')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.entryPrice')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.currentPrice')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.liqPrice')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.pMargin')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.mMargin')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.unrealizedPnl')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.realizedPnl')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {positions.map((position, index) => {
                                        const symbolPrice = allSymbolPrices.find(price => price.symbol === position.symbol);

                                        return (
                                            <tr key={index} className="dc-text-12 dc-h-48">
                                                <td className="dc-relative dc-flex dc-flex-col dc-pl-16 dc-text-left">
                                                    {/* <span className={cn("dc-absolute dc-block dc-left-0 dc-h-4/5 dc-border-l-3", position.direction === "LONG" ? "border-[#3FB185]" : "border-[#FF2B64]")}></span> */}
                                                    <span>{position.symbol}</span>
                                                    <span className={cn("dc-text-xs", position.direction === "LONG" ? "text-[#3FB185]" : "text-[#FF2B64]")}>{position.direction}</span>
                                                </td>
                                                <td className="dc-text-center">{Number(position.quantity).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                                <td className="dc-text-center">{Number((Number(position.quantity) * Number(position.entry_price)).toFixed(1)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                                <td className="dc-text-center">{Number(position.entry_price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                                <td className="dc-text-center">{Number(symbolPrice?.price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                                <td className="dc-text-center">
                                                    {userAssets?.margin_mode === "cross" && (() => {
                                                        const userAssetsUsdtBalance = Number(userAssets.usdt_balance);
                                                        const entryPrice = Number(position.entry_price);
                                                        const leverage = Number(userAssets.leverage);
                                                        const quantity = Number(position.quantity);

                                                        let liquidationPrice;
                                                        if (position.direction === "LONG") {
                                                            // Calculate price drop that would create unrealized PnL = -0.6 * balance
                                                            // For LONG: unrealizedPnl = quantity * (currentPrice - entryPrice)
                                                            // When unrealizedPnl = -0.6 * balance:
                                                            // quantity * (liquidationPrice - entryPrice) = -0.6 * balance
                                                            // liquidationPrice = entryPrice - (0.6 * balance / quantity)
                                                            liquidationPrice = entryPrice - ((userAssetsUsdtBalance * 0.6) / quantity);
                                                        } else {
                                                            // For SHORT: unrealizedPnl = quantity * (entryPrice - currentPrice)
                                                            // When unrealizedPnl = -0.6 * balance:
                                                            // quantity * (entryPrice - liquidationPrice) = -0.6 * balance
                                                            // liquidationPrice = entryPrice + (0.6 * balance / quantity)
                                                            liquidationPrice = entryPrice + ((userAssetsUsdtBalance * 0.6) / quantity);
                                                        }

                                                        return <span className="dc-text-[#E1E1E1]">{liquidationPrice < 0 ? "-" : liquidationPrice.toFixed(2)}</span>
                                                    })()}
                                                    {userAssets?.margin_mode === "isolated" && (() => {
                                                        // Calculate liquidation price based on position direction
                                                        const entryPrice = Number(position.entry_price);
                                                        const currentLeverage = Number(userAssets.leverage);

                                                        let liquidationPrice;
                                                        if (position.direction === "LONG") {
                                                            // For long positions: Entry - (Entry / Leverage)
                                                            liquidationPrice = entryPrice - (entryPrice / currentLeverage) * (mockConfig?.liquidation_threshold_ratio || 0.6);
                                                        } else {
                                                            // For short positions: Entry + (Entry / Leverage)
                                                            liquidationPrice = entryPrice + (entryPrice / currentLeverage) * (mockConfig?.liquidation_threshold_ratio || 0.6);
                                                        }

                                                        return (
                                                            <span className="dc-text-[#E1E1E1]">{liquidationPrice.toFixed(2)}</span>
                                                        );
                                                    })()}
                                                </td>
                                                <td className="dc-text-center">{(Number(position.quantity) * Number(position.entry_price) / Number(userAssets.leverage)).toFixed(2)} USDT</td>
                                                <td className="dc-text-center">
                                                    {userAssets?.margin_mode === "cross" && (
                                                        <span>-</span>
                                                    )}
                                                    {userAssets?.margin_mode === "isolated" && (() => {
                                                        return <span>{((Number(position.quantity) * Number(position.entry_price) - (Number(position.quantity) * Number(position.entry_price) * 0.0005 * Number(userAssets.leverage))) / Number(userAssets.leverage)).toFixed(2)} USDT</span>
                                                    })()}
                                                </td>
                                                <td className="dc-text-center">
                                                    {(() => {
                                                        let pnl, pnlPercentage;

                                                        if (position.direction === "LONG") {
                                                            pnl = Number(position.quantity) * Number(symbolPrice?.price) - Number(position.quantity) * Number(position.entry_price);
                                                            pnlPercentage = ((Number(symbolPrice?.price) - Number(position.entry_price)) / Number(position.entry_price)) * 100 * Number(userAssets.leverage);
                                                        } else { // SHORT
                                                            pnl = Number(position.quantity) * Number(position.entry_price) - Number(position.quantity) * Number(symbolPrice?.price);
                                                            pnlPercentage = ((Number(position.entry_price) - Number(symbolPrice?.price)) / Number(position.entry_price)) * 100 * Number(userAssets.leverage);
                                                        }

                                                        const textColor = pnl >= 0 ? "#3FB185" : "#FF2B64";
                                                        const isNearLiquidation = userAssets?.margin_mode === "isolated" && pnlPercentage <= -50 && pnlPercentage > -60;

                                                        return (
                                                            <>
                                                                <span className={`dc-text-[${textColor}]`}>{Number(pnl.toFixed(2)).toLocaleString()} USDT</span>
                                                                <span className={`dc-block dc-mt-1 dc-text-xs dc-text-[${textColor}]`}>
                                                                    ({pnlPercentage.toFixed(2)}%)
                                                                    {isNearLiquidation && <span className="dc-ml-1 dc-text-[#E1E1E1]">⚠️</span>}
                                                                </span>
                                                            </>
                                                        );
                                                    })()}
                                                </td>
                                                <td className="dc-text-center dc-text-[#FF2B64]">{Number(-(Number(position.quantity) * Number(position.entry_price) * (mockConfig?.market_order_fee_rate || 0.055) * 0.01).toFixed(2)).toLocaleString()} USDT</td>
                                                <td className="dc-text-center">
                                                    <button className="dc-bg-opacity-2 dc-border-opacity-6 dc-px-8 dc-py-2 dc-mr-8 dc-text-white dc-bg-white dc-border dc-border-white dc-rounded-full" onClick={() => handleClickLimitCloseModal(position)}>
                                                        Limit
                                                    </button>
                                                    <button className="dc-bg-opacity-2 dc-border-opacity-6 dc-px-8 dc-py-2 dc-text-white dc-bg-white dc-border dc-border-white dc-rounded-full" onClick={() => handleClickMarketCloseModal(position)}>
                                                        Market
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Current Orders */}
                    {activeOrderTab === "Current Orders" && (
                        <div className="">
                            <table className="dc-w-full dc-border-separate">
                                <thead className="dc-relative">
                                    <div className="dc-absolute dc-left-0 dc-top-3 dc-w-full dc-h-52 dc-bg-white dc-bg-opacity-2 dc-border-opacity-6 dc-border dc-border-white dc-rounded-[40px]" />
                                    <tr className="dc-text-12 dc-h-52 dc-text-white">
                                        <th className="dc-font-normal dc-text-center">{t('trading.symbol')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.qty')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.orderPrice')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.tradeType')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.orderType')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.orderNo')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.orderTime')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.cancel')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.filter(order => order.status === "PENDING").map((order, index) => (
                                        <tr key={index} className="dc-text-12 dc-h-48">
                                            <td className="dc-text-center">{order.symbol}</td>
                                            <td className="dc-text-center">{Number(order.quantity).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                            <td className="dc-text-center">{Number(order.order_price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                            <td className="dc-text-center">{order.direction}</td>
                                            <td className="dc-text-center">{order.order_type}</td>
                                            <td className="dc-text-center">{order.order_id}</td>
                                            <td className="dc-text-center">{new Date(Number(order.created_at) * 1000).toLocaleString()}</td>
                                            <td className="dc-text-center">
                                                <button className="dc-bg-opacity-2 dc-border-opacity-6 dc-px-8 dc-py-2 dc-text-white dc-bg-white dc-border dc-border-white dc-rounded-full" onClick={() => handleClickCancelOrderModal(order)}>
                                                    취소
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Order History */}
                    {activeOrderTab === "Order History" && (
                        <div className="">
                            <table className="dc-w-full dc-border-separate">
                                <thead className="dc-relative">
                                    <div className="dc-absolute dc-left-0 dc-top-3 dc-w-full dc-h-52 dc-bg-white dc-bg-opacity-2 dc-border-opacity-6 dc-border dc-border-white dc-rounded-[40px]" />
                                    <tr className="dc-text-12 dc-h-52 dc-text-white">
                                        <th className="dc-font-normal dc-text-center">{t('trading.symbol')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.qty')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.orderPrice')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.executionPrice')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.tradeType')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.orderType')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.status')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.orderNo')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.orderTime')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr key={index} className="dc-text-12 dc-h-48">
                                            <td className="dc-text-center">{order.symbol}</td>
                                            <td className="dc-text-center">{Number(order.quantity).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                            <td className="dc-text-center">{Number(order.order_price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                            <td className="dc-text-center">{Number(order.entry_price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                            <td className="dc-text-center">{order.direction}</td>
                                            <td className="dc-text-center">{order.order_type}</td>
                                            <td className="dc-text-center">{order.status}</td>
                                            <td className="dc-text-center">{order.order_id}</td>
                                            <td className="dc-text-center">{new Date(Number(order.created_at) * 1000).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Order History Pagination */}
                            {orderHistoryTotalPages > 1 && (
                                <div className="dc-mt-6">
                                    <Pagination
                                        currentPage={orderHistoryPage}
                                        totalPages={orderHistoryTotalPages}
                                        onPageChange={setOrderHistoryPage}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* PnL */}
                    {activeOrderTab === "PnL" && (
                        <div className="">
                            <table className="dc-w-full dc-border-separate">
                                <thead className="dc-relative">
                                    <div className="dc-absolute dc-left-0 dc-top-3 dc-w-full dc-h-52 dc-bg-white dc-bg-opacity-2 dc-border-opacity-6 dc-border dc-border-white dc-rounded-[40px]" />
                                    <tr className="dc-text-12 dc-h-52 dc-text-white">
                                        <th className="dc-font-normal dc-text-center">{t('trading.symbol')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.qty')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.entryPrice')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.liquidationPrice')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.tradeType')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.closingPnl')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.entryFee')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.closingFee')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.fundingFee')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.liquidationType')}</th>
                                        <th className="dc-font-normal dc-text-center">{t('trading.liquidationTime')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pnls.map((pnl, index) => (
                                        <tr key={index} className="dc-text-12 dc-h-48">
                                            <td className="dc-text-center">{pnl.symbol}</td>
                                            <td className="dc-text-center">{Number(pnl.quantity).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                            <td className="dc-text-center">{Number(pnl.entry_price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                            <td className="dc-text-center">{Number(pnl.liquidation_price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                            <td className="dc-text-center">{pnl.direction}</td>
                                            <td className="dc-text-center">{Number(pnl.pnl).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                            <td className="dc-text-center">{Number(pnl.opening_fee).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                            <td className="dc-text-center">{Number(pnl.closed_fee).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                            <td className="dc-text-center">{Number(pnl.funding_fee).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                                            <td className="dc-text-center">{pnl.pnl_type}</td>
                                            <td className="dc-text-center">{new Date(Number(pnl.created_at) * 1000).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* P&L Pagination */}
                            {pnlTotalPages > 1 && (
                                <div className="dc-mt-6">
                                    <Pagination
                                        currentPage={pnlPage}
                                        totalPages={pnlTotalPages}
                                        onPageChange={setPnlPage}
                                    />
                                </div>
                            )}
                        </div>
                    )}


                    {/* Empty State for Other Tabs */}
                    {/* {activeOrderTab !== "Position" && (
                        <div className="dc-h-200 dc-flex dc-items-center dc-justify-center">
                            <div className="dc-text-center">
                                <div className="dc-text-14 dc-mb-8 dc-text-[#777777]">No data</div>
                            </div>
                        </div>
                    )} */}
                </div>
            </div>

            {/* Footer */}
            {/* <Footer /> */}
        </div>
    );
}   