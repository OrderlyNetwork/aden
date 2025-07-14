// Nav removed from here
import Footer from "~/components/Footer";
import Pagination from "~/components/Pagination";
import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, Search, ChevronDown, ChevronUp, Minus, Plus, RefreshCw } from "lucide-react";
import TradingViewWidget from "~/components/TradingViewWidget";
import { Link } from "@remix-run/react";
import { UserAssets } from "~/store/userAssetsStore";
import { Position } from "~/store/positionStore";
import { cn } from "~/utils";
import TradingStats from "~/components/TradingStats";
import useCommonStore from "~/store/commonStore";
import { UserOrder } from "~/api/user_orders";
import { UserPnl } from "~/api/user_pnls";
import MobileBottomNav from "~/components/MobileBottomNav";
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

interface MobileProps {
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


export default function Mobile({
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

}: MobileProps) {
    if (!userAssets) return null;
    const { t } = useTranslation();

    return (
        // Nav removed from here
        <div className="md:dc-hidden dc-flex dc-w-full dc-min-h-screen dc-bg-[#111318]">

            <main className="dc-pb-76 dc-flex-1 dc-w-full dc-mt-56 dc-overflow-y-auto dc-text-white dc-bg-[#111318]">

                {/* Price Info */}
                <TradingStats symbol={activeTab} />

                {/* Chart */}
                <div className="dc-my-12">
                    <div className="dc-h-300 dc-w-full dc-mb-12 dc-bg-[#0F0F0F] dc-overflow-hidden">
                        <TradingViewWidget symbol={activeTab} />
                    </div>
                </div>

                <div className="dc-h-700 dc-flex dc-w-full dc-gap-6 dc-px-6">
                    {/* Order Book */}
                    <div className="dc-w-1/2 dc-bg-gradient-to-br dc-from-[#131416]/80 dc-to-[#0A0A0B]/80 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[12px] dc-p-8 dc-overflow-hidden">
                        <div className="dc-p-6 dc-flex dc-w-full dc-h-40 dc-bg-gradient-to-br dc-from-[#131416]/80 dc-to-[#0A0A0B]/80 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px] dc-gap-6 dc-mb-12">
                            <button
                                className={`dc-text-10 dc-flex-1 dc-h-28 dc-px-10 dc-flex dc-items-center dc-justify-center dc-rounded-[4px] ${activeDisplayTab === "Order Book" ? "dc-text-white dc-bg-gradient-to-br dc-from-[#1C1E21]/80 dc-to-[#111316]/80" : "dc-text-[#898D99]"}`}
                                onClick={() => setActiveDisplayTab("Order Book")}
                            >
                                {t('trading.orderBook')}
                            </button>
                            <button
                                className={`dc-text-10 dc-flex-1 dc-h-28 dc-px-10 dc-flex dc-items-center dc-justify-center dc-rounded-[4px] ${activeDisplayTab === "Recent Trades" ? "dc-text-white dc-bg-gradient-to-br dc-from-[#1C1E21]/80 dc-to-[#111316]/80" : "dc-text-[#898D99]"}`}
                                onClick={() => setActiveDisplayTab("Recent Trades")}
                            >
                                {t('trading.recentTrades')}
                            </button>
                        </div>

                        <div className="dc-flex dc-flex-col dc-w-full dc-overflow-hidden">
                            {activeDisplayTab === "Order Book" ? (
                                <>
                                    {orderbookMode === 1 && (
                                        <>
                                            {/* Order Book Header */}
                                            <div className="dc-text-8 dc-h-8 dc-flex dc-items-center dc-justify-between dc-px-8 dc-mb- dc-text-[#A4A8AB]">
                                                <span>{t('trading.price')}(USDT)</span>
                                                <span>Qty({symbol.replace('USDT', '')})</span>
                                                <span>Total({symbol.replace('USDT', '')})</span>
                                            </div>

                                            <hr className="dc-border-opacity-6 dc-w-full dc-h-1 dc-mt-8 dc-mb-12 dc-border-white" />

                                            {/* Ask Orders (Sell) */}
                                            <div className="dc-flex dc-flex-col dc-w-full dc-gap-4 dc-px-8">
                                                {askOrders.map((order, index) => (
                                                    <div key={`ask-${index}`} className="dc-text-9 dc-relative dc-flex dc-items-center dc-justify-between dc-h-20">
                                                        <div className="dc-bg-green-900/40 dc-absolute dc-top-0 dc-right-0 dc-h-full" style={{ width: `${smoothedAsks[index]?.percentRatio || 0}%`, zIndex: 0, transition: 'width 0.2s ease-out' }}></div>
                                                        <span className="dc-w-1/3 dc-text-[#3FB185] hover:dc-bg-[#333333] dc-cursor-pointer dc-z-10" onClick={() => handleClickOrderPiceOnOrderBook(order.price)}>{Number(order.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.qty).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>
                                                        <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Price Indicator */}
                                            <div className="dc-text-10 dc-flex dc-items-center dc-justify-center dc-w-full dc-h-20 dc-gap-8 dc-p-4 dc-my-12">
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
                                                    <div key={`bid-${index}`} className="dc-text-9 dc-relative dc-flex dc-items-center dc-justify-between dc-h-20">
                                                        <div className="dc-bg-red-900/40 dc-absolute dc-top-0 dc-right-0 dc-h-full" style={{ width: `${smoothedBids[index]?.percentRatio || 0}%`, zIndex: 0, transition: 'width 0.2s ease-out' }}></div>
                                                        <span className="dc-w-1/3 dc-text-[#FF2B64] hover:dc-bg-[#333333] dc-cursor-pointer dc-z-10" onClick={() => handleClickOrderPiceOnOrderBook(order.price)}>{Number(order.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                        <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.qty).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>
                                                        <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {orderbookMode === 2 && (
                                        <>
                                            {/* Price Indicator */}
                                            <div className="dc-text-14 dc-h-72 dc-flex dc-flex-col dc-items-center dc-justify-center dc-w-full dc-gap-8 dc-mb-4">
                                                {isPriceBid && <span className="dc-text-[#3FB185]">↑ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>}
                                                {!isPriceBid && <span className="dc-text-[#FF2B64]">↓ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>}
                                                <span className="dc-flex dc-items-center">
                                                    <span className="dc-mr-8 dc-text-white">⚑</span>
                                                    <span>{Number(avgPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                </span>
                                            </div>

                                            {/* Order Book Header */}
                                            <div className="dc-px-8 dc-text-10 dc-h-52 dc-bg-[#0F0F0F] dc-flex dc-items-center dc-justify-between dc-mb-8 dc-text-white">
                                                <span>{t('trading.qty')}</span>
                                                <span>{t('trading.price')}</span>
                                                <span>{t('trading.price')}</span>
                                                <span>{t('trading.qty')}</span>
                                            </div>

                                            {/* Ask Orders (Sell) && Bid Orders (Buy) */}
                                            <div className="dc-flex dc-flex-col dc-w-full dc-gap-8 dc-px-8 dc-mb-4">
                                                {Array.from({ length: Math.max(askOrders.length, bidOrders.length) }).map((_, index) => (
                                                    <div key={`row-${index}`} className="dc-text-10 dc-min-h-20 dc-flex dc-items-center">
                                                        {/* Bid Side (Right) */}
                                                        <div className="dc-relative dc-flex dc-items-center dc-w-1/2">
                                                            {index < bidOrders.length && (
                                                                <>
                                                                    <div className="dc-bg-red-900/40 dc-absolute dc-top-0 dc-right-0 dc-h-full" style={{ width: `${smoothedBids[index]?.percentRatio || 0}%`, zIndex: 0, transition: 'width 0.2s ease-out' }}></div>
                                                                    <span className="dc-z-10 dc-w-1/2 dc-text-left">{Number(bidOrders[index].qty).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                                    <span className="dc-w-1/2 dc-text-center dc-text-[#FF2B64] hover:dc-bg-[#333333] dc-cursor-pointer dc-z-10" onClick={() => handleClickOrderPiceOnOrderBook(bidOrders[index].price)}>{Number(parseFloat(bidOrders[index].price)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        {/* Ask Side (Left) */}
                                                        <div className="dc-relative dc-flex dc-items-center dc-w-1/2">
                                                            {index < askOrders.length && (
                                                                <>
                                                                    <div className="dc-bg-green-900/40 dc-absolute dc-top-0 dc-left-0 dc-h-full" style={{ width: `${smoothedAsks[askOrders.length - 1 - index]?.percentRatio || 0}%`, zIndex: 0, transition: 'width 0.2s ease-out' }}></div>
                                                                    <span className="dc-w-1/2 dc-text-center dc-text-[#3FB185] hover:dc-bg-[#333333] dc-cursor-pointer dc-z-10" onClick={() => handleClickOrderPiceOnOrderBook(askOrders[askOrders.length - 1 - index].price)}>{Number(parseFloat(askOrders[askOrders.length - 1 - index].price)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                                    <span className="dc-z-10 dc-w-1/2 dc-text-left">{Number(askOrders[askOrders.length - 1 - index].qty).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {orderbookMode === 3 && (
                                        <>
                                            {/* Price Indicator */}
                                            <div className="dc-text-14 dc-h-72 dc-flex dc-flex-col dc-items-center dc-justify-center dc-w-full dc-gap-8 dc-mb-4">
                                                {isPriceBid && <span className="dc-text-[#3FB185]">↑ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>}
                                                {!isPriceBid && <span className="dc-text-[#FF2B64]">↓ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>}
                                                <span className="dc-flex dc-items-center">
                                                    <span className="dc-mr-8 dc-text-white">⚑</span>
                                                    <span>{Number(avgPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                </span>
                                            </div>

                                            {/* Order Book Header */}
                                            <div className="dc-px-8 dc-text-10 dc-h-52 dc-bg-[#0F0F0F] dc-flex dc-items-center dc-justify-between dc-mb-8 dc-text-white">
                                                <span>{t('trading.price')}(USDT)</span>
                                                <span>{symbol.replace('USDT', '')}</span>
                                                <span>{symbol.replace('USDT', '')}</span>
                                            </div>

                                            {/* Bid Orders (Buy) */}
                                            <div className="dc-flex dc-flex-col dc-w-full dc-gap-8 dc-px-8 dc-mb-4">
                                                {bidOrders.map((order, index) => (
                                                    <div key={`bid-${index}`} className="dc-text-10 dc-relative dc-flex dc-items-center dc-justify-between dc-h-20">
                                                        <div className="dc-bg-red-900/40 dc-absolute dc-top-0 dc-right-0 dc-h-full" style={{ width: `${smoothedBids[index]?.percentRatio || 0}%`, zIndex: 0, transition: 'width 0.2s ease-out' }}></div>
                                                        <span className="dc-w-1/3 dc-text-[#FF2B64] hover:dc-bg-[#333333] dc-cursor-pointer dc-z-10" onClick={() => handleClickOrderPiceOnOrderBook(order.price)}>{Number(order.price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                        <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.qty).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                        <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {orderbookMode === 4 && (
                                        <>
                                            {/* Price Indicator */}
                                            <div className="dc-text-14 dc-h-72 dc-flex dc-flex-col dc-items-center dc-justify-center dc-w-full dc-gap-8 dc-mb-4">
                                                {isPriceBid && <span className="dc-text-[#3FB185]">↑ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>}
                                                {!isPriceBid && <span className="dc-text-[#FF2B64]">↓ {Number(currentPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>}
                                                <span className="dc-flex dc-items-center">
                                                    <span className="dc-mr-8 dc-text-white">⚑</span>
                                                    <span>{Number(avgPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                </span>
                                            </div>

                                            {/* Order Book Header */}
                                            <div className="dc-px-8 dc-text-10 dc-h-52 dc-bg-[#0F0F0F] dc-flex dc-items-center dc-justify-between dc-mb-8 dc-text-white">
                                                <span>{t('trading.price')}(USDT)</span>
                                                <span>{symbol.replace('USDT', '')}</span>
                                                <span>{symbol.replace('USDT', '')}</span>
                                            </div>

                                            {/* Ask Orders (Sell) */}
                                            <div className="dc-flex dc-flex-col dc-w-full dc-gap-8 dc-px-8 dc-mb-4">
                                                {askOrders.map((order, index) => (
                                                    <div key={`ask-${index}`} className="dc-text-10 dc-relative dc-flex dc-items-center dc-justify-between dc-h-20">
                                                        <div className="dc-bg-green-900/40 dc-absolute dc-top-0 dc-right-0 dc-h-full" style={{ width: `${smoothedAsks[index]?.percentRatio || 0}%`, zIndex: 0, transition: 'width 0.2s ease-out' }}></div>
                                                        <span className="dc-w-1/3 dc-text-[#3FB185] hover:dc-bg-[#333333] dc-cursor-pointer dc-z-10" onClick={() => handleClickOrderPiceOnOrderBook(order.price)}>{Number(order.price).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                        <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.qty).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                        <span className="dc-z-10 dc-w-1/3 dc-text-right">{Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* Buy/Sell Percentage Indicator */}
                                    <div className="dc-h-36 dc-flex dc-flex-col dc-w-full dc-px-8 dc-mb-16">
                                        <div className="dc-flex dc-items-center dc-justify-between dc-mb-6">
                                            <div className="dc-flex dc-items-center dc-mr-4">
                                                <div className="dc-w-20 dc-h-20 dc-rounded-sm dc-bg-[#FF2B64] dc-mr-4"></div>
                                                <span className="dc-text-12">{Math.round((bidsTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%</span>
                                            </div>
                                            <div className="dc-flex dc-items-center dc-ml-4">
                                                <span className="dc-text-12">{Math.round((asksTotalVolume / (bidsTotalVolume + asksTotalVolume || 1)) * 100)}%</span>
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
                                </>
                            ) : (
                                <>
                                    {/* Recent Trades Header */}
                                    <div className="dc-px-8 dc-text-8 dc-h-12 dc-flex dc-items-center dc-justify-between dc-text-[#A4A8AB]">
                                        <span>{t('trading.price')}(USDT)</span>
                                        <span>{symbol.replace('USDT', '')}</span>
                                        <span>{t('trading.time')}</span>
                                    </div>

                                    <hr className="dc-border-opacity-6 dc-w-full dc-h-1 dc-mt-8 dc-mb-12 dc-border-white" />

                                    {/* Recent Trades List */}
                                    <div className="dc-flex dc-flex-col dc-w-full dc-gap-4 dc-px-8">
                                        {recentTrades.map((trade, index) => {
                                            const nextTrade = recentTrades[index + 1];
                                            const isPriceDifferent = !nextTrade || parseFloat(trade.price) !== parseFloat(nextTrade.price);

                                            return (
                                                <div key={`trade-${index}`} className="dc-text-9 dc-flex dc-items-center dc-justify-between dc-h-20">
                                                    <span className={`dc-w-1/3 ${trade.type === 'buy' ? 'dc-text-[#3FB185]' : 'dc-text-[#FF2B64]'}`}>
                                                        {Number(trade.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        {isPriceDifferent && (trade.type === 'buy' ? '↑' : '↓')}
                                                    </span>
                                                    <span className="dc-w-1/3 dc-text-right">{Number(trade.qty).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</span>
                                                    <span className="dc-w-1/3 dc-text-right">{trade.time}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Quote Display */}
                        {/* <div className="dc-h-66 dc-flex dc-flex-col dc-w-full dc-gap-8 dc-px-8">
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
                            <div className="dc-relative">
                                <div 
                                    className="dc-px-12 dc-w-134 dc-h-34 dc-flex dc-items-center dc-justify-between dc-bg-[#0F0F0F] dc-rounded-sm dc-cursor-pointer"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <span className="dc-text-14 dc-mr-8">{dropdownValue}</span>
                                    <ChevronDown className="dc-w-16 dc-h-16" />
                                </div>
                                
                                {isDropdownOpen && (
                                    <div className="dc-absolute dc-top-full dc-left-0 dc-mt-1 dc-w-134 dc-bg-[#1F1F1F] dc-rounded-sm dc-shadow-lg dc-z-50">
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
                        </div> */}
                    </div>

                    {/* Trading Form */}
                    <div className="dc-w-1/2 dc-bg-gradient-to-br dc-from-[#131416]/80 dc-to-[#0A0A0B]/80 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[12px] dc-p-8">
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

                        <div className="dc-flex dc-items-center dc-justify-end dc-gap-4 dc-mb-8">
                            {isSoundMute && <img src="/images/check_circle.png" alt="mute" className="dc-w-16 dc-h-16 dc-ml-auto dc-rounded-sm dc-cursor-pointer" onClick={() => setIsSoundMute(false)} />}
                            {!isSoundMute && <img src="/images/check_white_circle.png" alt="mute" className="dc-w-16 dc-h-16 dc-ml-auto dc-rounded-sm dc-cursor-pointer" onClick={() => setIsSoundMute(true)} />}
                            <span className="dc-text-10 dc-text-[#898D99]">{t('trading.sound')}</span>
                        </div>

                        {/* Position Type and Leverage */}
                        <div className="dc-h-36 dc-text-11 dc-flex dc-justify-between dc-w-full dc-gap-8 dc-mb-8">
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
                                <span className="dc-text-11 dc-mr-8">{userAssets?.leverage}x</span>
                                <ChevronDownIcon className="dc-w-16 dc-h-16" color="#FDB41D" />
                            </div>
                        </div>

                        {/* Price Input */}
                        <div className={`dc-h-36 dc-flex dc-items-center dc-justify-between dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px] dc-px-12 dc-mb-8`}>
                            {orderType === "MARKET" ? (
                                <div className="dc-text-14 dc-w-full dc-text-[#777777]">{t('trading.currentPriceAtPurchase')}</div>
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
                                {/* <span className={`${orderType === "MARKET" ? "dc-text-gray-500" : "dc-text-[#E1E1E1]"} dc-mr-8`}>{t('trading.last')}</span> */}
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

                        {/* Quantity Input */}
                        <div className="dc-h-36 dc-flex dc-items-center dc-justify-between dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px] dc-px-12 dc-mb-8">
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
                            <span className="dc-text-10 dc-text-[#898D99]">{allSymbolPrices.find(price => price.symbol === symbol)?.symbol.replace('USDT', '')}</span>
                        </div>

                        {/* Percentage Buttons */}
                        <div className="dc-h-28 dc-flex dc-w-full dc-items-center dc-bg-gradient-to-br dc-from-[#131416]/80 dc-to-[#0A0A0B]/80 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px] dc-mb-12">
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

                        <div className="dc-w-full dc-h-104 dc-flex dc-flex-col dc-items-center dc-justify-center dc-mb-8 dc-px-16 dc-py-10 dc-gap-6 dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px]">
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
                        <div className="dc-h-68 dc-grid dc-w-full grid-rows-2 dc-gap-4 dc-mb-12">
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

                <hr className="dc-border-none dc-border-[#292929] dc-my-8" />

                {/* Positions and Orders */}
                <div className="dc-min-h-200 dc-mx-4 dc-mb-20">
                    {/* Tabs */}
                    <div className="dc-h-52 dc-flex dc-justify-between dc-mb-12 dc-overflow-x-auto">
                        <div className="dc-flex dc-items-center dc-justify-between dc-bg-[#0D0E12]">
                            <button
                                className={`dc-px-20 dc-h-full dc-text-13 dc-whitespace-nowrap ${activeOrderTab === "Position" ? "dc-text-white dc-border-b-2 dc-border-white dc-rounded-sm" : "dc-text-[#777777]"}`}
                                onClick={() => setActiveOrderTab("Position")}
                            >
                                {t('trading.position')} ({positions.length})
                            </button>
                            <button
                                className={`dc-px-20 dc-h-full dc-text-13 dc-whitespace-nowrap ${activeOrderTab === "Current Orders" ? "dc-text-white dc-border-b-2 dc-border-white dc-rounded-sm" : "dc-text-[#777777]"}`}
                                onClick={() => setActiveOrderTab("Current Orders")}
                            >
                                {t('trading.currentOrders')} ({orders.filter(order => order.status === "PENDING").length})
                            </button>
                            <button
                                className={`dc-px-20 dc-h-full dc-text-13 dc-whitespace-nowrap ${activeOrderTab === "Order History" ? "dc-text-white dc-border-b-2 dc-border-white dc-rounded-sm" : "dc-text-[#777777]"}`}
                                onClick={() => setActiveOrderTab("Order History")}
                            >
                                {t('trading.orderHistory')}
                            </button>
                            <button
                                className={`dc-px-20 dc-h-full dc-text-13 dc-whitespace-nowrap ${activeOrderTab === "PnL" ? "dc-text-white dc-border-b-2 dc-border-white dc-rounded-sm" : "dc-text-[#777777]"}`}
                                onClick={() => setActiveOrderTab("PnL")}
                            >
                                {t('trading.pnl')}
                            </button>
                        </div>
                        {/* {activeOrderTab === "Current Orders" && <button className="dc-ml-auto dc-text-12 dc-h-full dc-px-20 dc-py-2 dc-text-white dc-border dc-border-[#1F1F1F] dc-rounded-sm" onClick={handleClickCancelAllOrderModal}>{t('trading.cancelAll')}</button>} */}
                    </div>

                    {/* Position Display */}
                    {activeOrderTab === "Position" && (
                        <>
                            <div className="dc-flex dc-flex-col dc-gap-8 dc-bg-[#111318] dc-border dc-border-white dc-border-opacity-6 dc-rounded-[16px] dc-p-8 dc-mb-12">
                                {positions.map((position, index) => {
                                    const symbolPrice = allSymbolPrices.find(price => price.symbol === position.symbol);

                                    return (
                                        <div key={index} className="dc-w-full dc-bg-[#111318] dc-border dc-border-white dc-border-opacity-6 dc-rounded-[16px] dc-p-12">
                                            {/* Symbol and Direction Header */}
                                            <div className="dc-flex dc-flex-col dc-gap-16 dc-mb-12">
                                                <div className="dc-flex dc-items-center dc-h-24">
                                                    <img
                                                        src={`/images/${position.symbol.replace('USDT', '').toLowerCase()}.png`}
                                                        alt={position.symbol}
                                                        className="dc-w-24 dc-h-24 dc-mr-12"
                                                    />
                                                    <span className="dc-text-14 dc-mr-8 dc-text-white">{position.symbol.replace('USDT', '')}</span>
                                                    <span className="dc-text-13 dc-text-[#cccccc]">Perp</span>
                                                </div>
                                                <div className="dc-flex dc-items-center dc-h-20 dc-gap-8">
                                                    <div className={`dc-text-white dc-text-10 dc-bg-[#FDB41D] dc-flex dc-items-center dc-h-full dc-px-10 dc-py-4 dc-rounded-[8px]`}>
                                                        {position.direction}
                                                    </div>
                                                    <div className="dc-text-10 dc-h-full dc-flex dc-items-center dc-px-10 dc-py-4 dc-text-white dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px]">
                                                        {userAssets?.margin_mode?.charAt(0).toUpperCase() + userAssets?.margin_mode?.slice(1)}
                                                    </div>
                                                    <div className="dc-text-10 dc-h-full dc-flex dc-items-center dc-px-10 dc-py-4 dc-text-white dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px]">
                                                        {userAssets?.leverage}x
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Top Row: PNL and ROE */}
                                            <div className="dc-flex dc-items-start dc-justify-between dc-mb-16">
                                                <div className="dc-flex-1">
                                                    <div className="dc-text-12 dc-mb-4 dc-text-[#898D99]">{t('trading.unrealizedPNL')}(USDT)</div>
                                                    <div className={`dc-text-14 dc-font-medium ${(() => {
                                                        let pnl;
                                                        if (position.direction === "LONG") {
                                                            pnl = Number(position.quantity) * Number(symbolPrice?.price) - Number(position.quantity) * Number(position.entry_price);
                                                        } else {
                                                            pnl = Number(position.quantity) * Number(position.entry_price) - Number(position.quantity) * Number(symbolPrice?.price);
                                                        }
                                                        return pnl >= 0 ? "dc-text-[#3FB185]" : "dc-text-[#FF2B64]";
                                                    })()}`}>
                                                        {(() => {
                                                            let pnl;
                                                            if (position.direction === "LONG") {
                                                                pnl = Number(position.quantity) * Number(symbolPrice?.price) - Number(position.quantity) * Number(position.entry_price);
                                                            } else {
                                                                pnl = Number(position.quantity) * Number(position.entry_price) - Number(position.quantity) * Number(symbolPrice?.price);
                                                            }
                                                            return pnl >= 0 ? `+${Number(pnl.toFixed(1)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}` : Number(pnl.toFixed(1)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                                                        })()}
                                                    </div>
                                                </div>
                                                <div className="dc-text-right">
                                                    <div className="dc-text-12 dc-mb-4 dc-text-[#898D99]">{t('trading.roe')}</div>
                                                    <div className={`dc-text-14 dc-font-medium ${(() => {
                                                        let pnlPercentage;
                                                        if (position.direction === "LONG") {
                                                            pnlPercentage = ((Number(symbolPrice?.price) - Number(position.entry_price)) / Number(position.entry_price)) * 100 * Number(userAssets?.leverage);
                                                        } else {
                                                            pnlPercentage = ((Number(position.entry_price) - Number(symbolPrice?.price)) / Number(position.entry_price)) * 100 * Number(userAssets?.leverage);
                                                        }
                                                        return pnlPercentage >= 0 ? "dc-text-[#3FB185]" : "dc-text-[#FF2B64]";
                                                    })()}`}>
                                                        {(() => {
                                                            let pnlPercentage;
                                                            if (position.direction === "LONG") {
                                                                pnlPercentage = ((Number(symbolPrice?.price) - Number(position.entry_price)) / Number(position.entry_price)) * 100 * Number(userAssets?.leverage);
                                                            } else {
                                                                pnlPercentage = ((Number(position.entry_price) - Number(symbolPrice?.price)) / Number(position.entry_price)) * 100 * Number(userAssets?.leverage);
                                                            }
                                                            const isNearLiquidation = userAssets?.margin_mode === "isolated" && pnlPercentage <= -50 && pnlPercentage > -60;
                                                            const formattedPercentage = pnlPercentage >= 0 ? `+${pnlPercentage.toFixed(2)}%` : `${pnlPercentage.toFixed(2)}%`;
                                                            return (
                                                                <>
                                                                    {formattedPercentage}
                                                                    {isNearLiquidation && <span className="dc-ml-1 dc-text-[#E1E1E1]">⚠️</span>}
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Middle Row: Position Details */}
                                            <div className="dc-grid dc-grid-cols-3 dc-gap-12 dc-mb-16">
                                                <div>
                                                    <div className="dc-text-12 dc-mb-4 dc-text-[#898D99]">{t('trading.qty')}({symbol.replace('USDT', '')})</div>
                                                    <div className="dc-text-12 dc-text-white">{Number(position.quantity).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                                </div>
                                                <div>
                                                    <div className="dc-text-12 dc-mb-4 dc-text-[#898D99]">{t('trading.pMargin')}(USDT)</div>
                                                    <div className="dc-text-12 dc-text-white">{Number((Number(position.quantity) * Number(position.entry_price) / Number(userAssets?.leverage)).toFixed(1)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                                </div>
                                                <div>
                                                    <div className="dc-text-12 dc-mb-4 dc-text-[#898D99]">{t('trading.mMargin')}(USDT)</div>
                                                    <div className="dc-text-12 dc-text-white">
                                                        {userAssets?.margin_mode === "cross" ? "-" : Number((Number(position.quantity) * Number(position.entry_price) / Number(userAssets?.leverage)).toFixed(1)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Row: Price Details */}
                                            <div className="dc-grid dc-grid-cols-3 dc-gap-12 dc-mb-16">
                                                <div>
                                                    <div className="dc-text-12 dc-mb-4 dc-text-[#898D99]">{t('trading.entryPrice')}</div>
                                                    <div className="dc-text-12 dc-text-white">{Number(Number(position.entry_price)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                                </div>
                                                <div>
                                                    <div className="dc-text-12 dc-mb-4 dc-text-[#898D99]">{t('trading.currentPrice')}</div>
                                                    <div className="dc-text-12 dc-text-white">{Number(Number(symbolPrice?.price)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                                </div>
                                                <div>
                                                    <div className="dc-text-12 dc-mb-4 dc-text-[#898D99]">{t('trading.liqPrice')}</div>
                                                    <div className="dc-text-12 dc-text-[#E1E1E1]">
                                                        {userAssets?.margin_mode === "cross" ? (() => {
                                                            const userAssetsUsdtBalance = Number(userAssets.usdt_balance);
                                                            const entryPrice = Number(position.entry_price);
                                                            const currentLeverage = Number(userAssets?.leverage);
                                                            const quantity = Number(position.quantity);

                                                            let liquidationPrice;
                                                            if (position.direction === "LONG") {
                                                                liquidationPrice = entryPrice - (entryPrice / currentLeverage) * (mockConfig?.liquidation_threshold_ratio || 0.6);
                                                            } else {
                                                                liquidationPrice = entryPrice + (entryPrice / currentLeverage) * (mockConfig?.liquidation_threshold_ratio || 0.6);
                                                            }

                                                            return liquidationPrice < 0 ? "-" : Number(liquidationPrice).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
                                                        })() : "-"}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="dc-h-28 dc-flex dc-justify-between dc-w-full dc-gap-8">
                                                <button
                                                    className="dc-w-105 dc-text-white dc-flex dc-items-center dc-justify-center dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px] dc-text-10"
                                                    onClick={() => handleClickLimitCloseModal(position)}
                                                >
                                                    {t('trading.limit')}
                                                </button>
                                                <button
                                                    className="dc-w-105 dc-text-white dc-flex dc-items-center dc-justify-center dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px] dc-text-10"
                                                    onClick={() => handleClickMarketCloseModal(position)}
                                                >
                                                    {t('trading.closePosition')}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button className="dc-mb-20 dc-w-full dc-text-12 dc-h-42 dc-flex dc-items-center dc-justify-center dc-text-white dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px]" onClick={handleClickCloseAllModal}>{t('trading.closeAll')}</button>
                        </>
                    )}

                    {/* Current Orders */}
                    {activeOrderTab === "Current Orders" && (
                        <>
                            <div className="dc-flex dc-flex-col dc-gap-8 dc-bg-[#111318] dc-border dc-border-white dc-border-opacity-6 dc-rounded-[16px] dc-p-8 dc-mb-12">
                                {orders.filter(order => order.status === "PENDING").map((order, index) => (
                                    <div key={index} className="dc-w-full dc-bg-[#111318] dc-border dc-border-white dc-border-opacity-6 dc-rounded-[16px] dc-p-12">
                                        {/* Symbol and Direction Header */}
                                        <div className="dc-flex dc-flex-col dc-gap-16 dc-mb-12">
                                            <div className="dc-flex dc-items-center dc-h-24">
                                                <img
                                                    src={`/images/${order.symbol.replace('USDT', '').toLowerCase()}.png`}
                                                    alt={order.symbol}
                                                    className="dc-w-24 dc-h-24 dc-mr-12"
                                                />
                                                <span className="dc-text-14 dc-mr-8 dc-text-white">{order.symbol.replace('USDT', '')}</span>
                                                <span className="dc-text-13 dc-text-[#cccccc]">Perp</span>
                                            </div>
                                            <div className="dc-flex dc-items-center dc-h-20 dc-gap-8">
                                                <div className={`dc-text-white dc-text-10 dc-bg-[#FDB41D] dc-flex dc-items-center dc-h-full dc-px-10 dc-py-4 dc-rounded-[8px]`}>
                                                    {order.direction}
                                                </div>
                                                <div className="dc-text-10 dc-h-full dc-flex dc-items-center dc-px-10 dc-py-4 dc-text-white dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px]">
                                                    {order.order_type}
                                                </div>
                                                <div className="dc-text-10 dc-h-full dc-flex dc-items-center dc-px-10 dc-py-4 dc-text-white dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px]">
                                                    PENDING
                                                </div>
                                            </div>
                                        </div>

                                        {/* Top Row: Order Details */}
                                        <div className="dc-grid dc-grid-cols-3 dc-gap-12 dc-mb-16">
                                            <div>
                                                <div className="dc-text-12 dc-mb-4 dc-text-[#898D99]">{t('trading.quantity')}</div>
                                                <div className="dc-text-12 dc-text-white">{Number(order.quantity).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                            </div>
                                            <div>
                                                <div className="dc-text-12 dc-mb-4 dc-text-[#898D99]">{t('trading.orderPrice')}</div>
                                                <div className="dc-text-12 dc-text-white">{Number(Number(order.order_price)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                            </div>
                                            <div>
                                                <div className="dc-text-12 dc-mb-4 dc-text-[#898D99]">{t('trading.orderID')}</div>
                                                <div className="dc-text-12 dc-text-white">{order.order_id}</div>
                                            </div>
                                        </div>

                                        {/* Bottom Row: Time and Action */}
                                        <div className="dc-flex dc-items-center dc-justify-between dc-mb-16">
                                            <div>
                                                <div className="dc-text-12 dc-mb-4 dc-text-[#898D99]">{t('trading.createdAt')}</div>
                                                <div className="dc-text-12 dc-text-white">{new Date(Number(order.created_at) * 1000).toLocaleString()}</div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="dc-h-28 dc-flex dc-justify-end dc-w-full">
                                            <button
                                                className="dc-w-105 dc-text-white dc-flex dc-items-center dc-justify-center dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px] dc-text-10"
                                                onClick={() => handleClickCancelOrderModal(order)}
                                            >
                                                {t('trading.cancel')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="dc-mb-20 dc-w-full dc-text-12 dc-h-42 dc-flex dc-items-center dc-justify-center dc-text-white dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[8px]" onClick={handleClickCancelAllOrderModal}>{t('trading.cancelAll')}</button>
                        </>
                    )}

                    {/* Order History */}
                    {activeOrderTab === "Order History" && (
                        <div className="dc-w-full">
                            {/* Single Scroll Container with Sticky Header */}
                            <div className="dc-max-h-400 dc-w-full dc-overflow-x-auto dc-overflow-y-auto">
                                <div className="dc-min-w-780">
                                    {/* Sticky Table Header */}
                                    <div className="dc-sticky dc-top-0 dc-z-10 dc-px-12 dc-h-40 dc-flex dc-items-center dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[40px] dc-mb-2">
                                        <div className="dc-min-w-780 dc-flex dc-gap-8 dc-text-10 dc-text-[#898D99]">
                                            <div className="dc-min-w-112 dc-w-112 dc-text-center">{t('trading.symbol')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.direction')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.orderType')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.quantity')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.orderPrice')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.status')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.createdAt')}</div>
                                        </div>
                                    </div>

                                    {/* Table Content */}
                                    <div className="dc-bg-[#111318]">
                                        {orders.map((order, index) => (
                                            <div key={index} className="dc-px-8 dc-py-12">
                                                <div className="dc-text-11 dc-flex dc-items-center dc-gap-8">
                                                    <div className="dc-min-w-112 dc-w-112 dc-flex dc-items-center dc-justify-center dc-text-center">
                                                        <img
                                                            src={`/images/${order.symbol.replace('USDT', '').toLowerCase()}.png`}
                                                            alt={order.symbol}
                                                            className="dc-w-16 dc-h-16 dc-mr-8"
                                                        />
                                                        <span className="dc-text-white">{order.symbol.replace('USDT', '')}</span>
                                                    </div>
                                                    <div className={`dc-min-w-88 dc-w-88 dc-text-center dc-text-11 ${order.direction === "LONG" ? "dc-text-[#3FB185]" : "dc-text-[#FF2B64]"}`}>
                                                        {order.direction}
                                                    </div>
                                                    <div className="dc-min-w-88 dc-w-88 dc-text-center dc-text-white">{order.order_type}</div>
                                                    <div className="dc-min-w-88 dc-w-88 dc-text-center dc-text-white">{Number(order.quantity).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                                    <div className="dc-min-w-88 dc-w-88 dc-text-center dc-text-white">{Number(Number(order.order_price)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                                    <div className={`dc-min-w-88 dc-w-88 dc-text-11 ${order.status === "FILLED" ? "dc-text-[#3FB185]" :
                                                        order.status === "PENDING" ? "dc-text-[#FFA500]" :
                                                            order.status === "CANCELLED" ? "dc-text-[#FF2B64]" : "dc-text-white"
                                                        }`}>
                                                        {order.status}
                                                    </div>
                                                    <div className="dc-min-w-88 dc-w-88 dc-text-center dc-text-[#898D99] dc-text-10">
                                                        {new Date(Number(order.created_at) * 1000).toLocaleString('ko-KR', {
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

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

                            {orders.length === 0 && (
                                <div className="dc-flex dc-items-center dc-justify-center dc-h-120 dc-text-[#898D99] dc-text-12">
                                    {t('trading.noOrderHistory')}
                                </div>
                            )}
                        </div>
                    )}

                    {/* PnL */}
                    {activeOrderTab === "PnL" && (
                        <div className="dc-w-full">
                            {/* Single Scroll Container with Sticky Header */}
                            <div className="dc-max-h-400 dc-w-full dc-overflow-x-auto dc-overflow-y-auto">
                                <div className="dc-min-w-1000">
                                    {/* Sticky Table Header */}
                                    <div className="dc-sticky dc-top-0 dc-z-10 dc-px-12 dc-h-40 dc-flex dc-items-center dc-bg-white dc-bg-opacity-2 dc-border dc-border-white dc-border-opacity-6 dc-rounded-[40px] dc-mb-2">
                                        <div className="dc-min-w-1000 dc-flex dc-gap-8 dc-text-10 dc-text-[#898D99]">
                                            <div className="dc-min-w-112 dc-w-112 dc-text-center">{t('trading.symbol')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.direction')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.quantity')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.entryPrice')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.liquidationPrice')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.pnl')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.openingFee')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.closedFee')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.fundingFee')}</div>
                                            <div className="dc-min-w-88 dc-w-88 dc-text-center">{t('trading.createdAt')}</div>
                                        </div>
                                    </div>

                                    {/* Table Content */}
                                    <div className="dc-bg-[#111318]">
                                        {pnls.map((pnl, index) => (
                                            <div key={index} className="dc-px-8 dc-py-12">
                                                <div className="dc-text-11 dc-flex dc-items-center dc-gap-8">
                                                    <div className="dc-min-w-112 dc-w-112 dc-flex dc-items-center dc-justify-center dc-text-center">
                                                        <img
                                                            src={`/images/${pnl.symbol.replace('USDT', '').toLowerCase()}.png`}
                                                            alt={pnl.symbol}
                                                            className="dc-w-16 dc-h-16 dc-mr-8"
                                                        />
                                                        <span className="dc-text-white">{pnl.symbol.replace('USDT', '')}</span>
                                                    </div>
                                                    <div className={`dc-min-w-88 dc-w-88 dc-text-center dc-text-11 ${pnl.direction === "LONG" ? "dc-text-[#3FB185]" : "dc-text-[#FF2B64]"}`}>
                                                        {pnl.direction}
                                                    </div>
                                                    <div className="dc-min-w-88 dc-w-88 dc-text-center dc-text-white">{Number(pnl.quantity).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                                    <div className="dc-min-w-88 dc-w-88 dc-text-center dc-text-white">{Number(Number(pnl.entry_price)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                                    <div className="dc-min-w-88 dc-w-88 dc-text-center dc-text-white">{Number(Number(pnl.liquidation_price)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                                    <div className={`dc-min-w-88 dc-w-88 dc-text-center dc-text-11 ${Number(pnl.pnl) >= 0 ? "dc-text-[#3FB185]" : "dc-text-[#FF2B64]"}`}>
                                                        {Number(Number(pnl.pnl)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                                    </div>
                                                    <div className="dc-min-w-88 dc-w-88 dc-text-center dc-text-white">{Number(Number(pnl.opening_fee)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                                    <div className="dc-min-w-88 dc-w-88 dc-text-center dc-text-white">{Number(Number(pnl.closed_fee)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                                    <div className="dc-min-w-88 dc-w-88 dc-text-center dc-text-white">{Number(Number(pnl.funding_fee)).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</div>
                                                    <div className="dc-min-w-88 dc-w-88 dc-text-center dc-text-[#898D99] dc-text-10">
                                                        {new Date(Number(pnl.created_at) * 1000).toLocaleString('ko-KR', {
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

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

                            {pnls.length === 0 && (
                                <div className="dc-flex dc-items-center dc-justify-center dc-h-120 dc-text-[#898D99] dc-text-12">
                                    {t('trading.noPnlHistory')}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {/* <Footer /> */}
                <div className="dc-mb-8 dc-text-xs dc-text-center dc-text-[#898D99]">
                    <p>Copyright  Aden.io . All rights reseved.</p>
                </div>
            </main>
        </div>
    );
}
