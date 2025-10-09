import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState
} from '@tanstack/react-table';
import { useAccount } from '@orderly.network/hooks';

import { getCampaignRanking_VolumePNL, getUserStats_volume_pnl, type CampaignRankingData, type UserStats } from '@/api/campaign';
import { useTranslation } from '@orderly.network/i18n';

interface CampaignLeaderboardProps {
  campaignId: number;
  userAddress?: string;
  minVolume?: number;
}

const ENTRIES_PER_PAGE = 10;

const CampaignLeaderboard: React.FC<CampaignLeaderboardProps> = ({
  campaignId,
  userAddress,
  minVolume = 0
}) => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const [activeTab, setActiveTab] = useState<'volume' | 'pnl'>('volume');
  const [cache, setCache] = useState<{ rows: CampaignRankingData[]; total: number }>({ rows: [], total: 0 });
  const [data, setData] = useState<CampaignRankingData[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'volume' | 'pnl'>('volume');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const CACHE_SIZE = 500;
  const [sorting, setSorting] = useState<SortingState>([
    { id: activeTab, desc: true }
  ]);
  // For jump-to input box
  const [jumpToValue, setJumpToValue] = useState<string>(currentPage.toString());
  const [currentBlockIndex, setCurrentBlockIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Calculate cache block: 1-500, 501-1000, etc.
        const blockIndex = Math.floor((currentPage - 1) * ENTRIES_PER_PAGE / CACHE_SIZE);
        const blockStartRank = blockIndex * CACHE_SIZE + 1;
        const blockEndRank = blockStartRank + CACHE_SIZE - 1;
        const fetchPage = Math.ceil(blockStartRank / CACHE_SIZE);
        const pageStart = (currentPage - 1) * ENTRIES_PER_PAGE;
        const pageEnd = pageStart + ENTRIES_PER_PAGE;
        const blockOffset = pageStart - (blockStartRank - 1);
        // Use single cache
        if (blockIndex !== currentBlockIndex) {
          setCurrentBlockIndex(blockIndex);
          // Fetch 500 rows for the block
          const result = await getCampaignRanking_VolumePNL(
            campaignId,
            sortBy,
            fetchPage,
            CACHE_SIZE,
            activeTab === 'pnl' ? minVolume : 0.000001
          );
          if (result.success) {
            setCache({ rows: result.data.rows, total: result.data.meta.total });
            setData(result.data.rows.slice(blockOffset, blockOffset + ENTRIES_PER_PAGE));
            setTotalPages(Math.ceil(result.data.meta.total / ENTRIES_PER_PAGE));
            return;
          } else {
            setError('Failed to fetch leaderboard data');
          }
        }
        let cachedRows = cache.rows.slice(blockOffset, blockOffset + ENTRIES_PER_PAGE);
        if (cachedRows.length === ENTRIES_PER_PAGE) {
          setData(cachedRows);
          setTotalPages(Math.ceil(cache.total / ENTRIES_PER_PAGE));
          setLoading(false);
          return;
        }
      } catch (err) {
        setError('Error loading leaderboard data');
        console.error('Error fetching campaign ranking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [campaignId, sortBy, currentPage, minVolume, activeTab, currentBlockIndex, cache]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!account?.accountId || !account?.address) return;

      try {
        const userResult = await getUserStats_volume_pnl(
          campaignId,
          account.accountId,
          account.address,
          activeTab,
          activeTab === 'pnl' ? minVolume : 0.000001
        );

        if (userResult.success) {
          setUserStats(userResult.data);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserData();
  }, [account?.accountId, account?.address, campaignId, activeTab, minVolume]);

  useEffect(() => {
    setCurrentBlockIndex(-1);
    setCache({ rows: [], total: 0 });
    setData([]);
    setTotalPages(1);
    setError(null);
    setCurrentPage(1);
  }, [activeTab]);

  // Keep jumpToValue in sync with currentPage
  useEffect(() => {
    setJumpToValue(currentPage.toString());
  }, [currentPage]);

  const formatAddress = (address: string) => {
    if (!address) return '-';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getDashboardUrl = (address: string) => {
    return `https://orderly-dashboard.orderly.network/address/${address}?broker_id=aden`;
  };

  const formatCurrency = (value: number) => {
    if (value === 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    if (value === 0) return '-';
    return `${value.toFixed(2)}%`;
  };

  const GoldMedal = () => (
    <svg style={{ height: '1.75rem' }} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L12 6 M10 4 L14 4" stroke="#FFD700" strokeWidth="1" fill="none" />
      <circle cx="12" cy="12" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1" />
      <circle cx="12" cy="12" r="6" fill="#FFF3B0" stroke="#FFD700" strokeWidth="0.5" />
      <text x="12" y="15" textAnchor="middle" fontWeight="bold" fontSize="8" fill="#B8860B">1</text>
      <circle cx="10" cy="10" r="2" fill="#FFFFFF" opacity="0.3" />
    </svg>
  );
  const SilverMedal = () => (
    <svg style={{ height: '1.75rem' }} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L12 6 M10 4 L14 4" stroke="#C0C0C0" strokeWidth="1" fill="none" />
      <circle cx="12" cy="12" r="8" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="1" />
      <circle cx="12" cy="12" r="6" fill="#F0F0F0" stroke="#C0C0C0" strokeWidth="0.5" />
      <text x="12" y="15" textAnchor="middle" fontWeight="bold" fontSize="8" fill="#888">2</text>
      <circle cx="10" cy="10" r="2" fill="#FFFFFF" opacity="0.3" />
    </svg>
  );
  const BronzeMedal = () => (
    <svg style={{ height: '1.75rem' }} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L12 6 M10 4 L14 4" stroke="#CD7F32" strokeWidth="1" fill="none" />
      <circle cx="12" cy="12" r="8" fill="#CD7F32" stroke="#8B5C2A" strokeWidth="1" />
      <circle cx="12" cy="12" r="6" fill="#F7CBA0" stroke="#CD7F32" strokeWidth="0.5" />
      <text x="12" y="15" textAnchor="middle" fontWeight="bold" fontSize="8" fill="#8B5C2A">3</text>
      <circle cx="10" cy="10" r="2" fill="#FFFFFF" opacity="0.3" />
    </svg>
  );

  const getRankDisplay = useCallback((index: number) => {
    const rank = (currentPage - 1) * ENTRIES_PER_PAGE + index + 1;
    if (rank === 1) return <GoldMedal />;
    if (rank === 2) return <SilverMedal />;
    if (rank === 3) return <BronzeMedal />;
    return rank.toString();
  }, [currentPage]);

  const getRowStyling = (index: number) => {
    const rank = (currentPage - 1) * ENTRIES_PER_PAGE + index + 1;
    if (rank === 1) {
      return 'bg-yellow-600/30 border-yellow-300';
    }
    if (rank === 2) {
      return 'bg-gray-800/50 border-gray-700/50';
    }
    if (rank === 3) {
      return 'bg-orange-600/10 border-orange-600/20';
    }
    return '';
  };

  const calculateUserROI = (stats: UserStats) => {
    if (stats.start_account_value + stats.total_deposit_amount === 0) return 0;
    return (stats.pnl / (stats.start_account_value + stats.total_deposit_amount)) * 100;
  };

  const calculateUserPNL = (stats: UserStats) => {
    return stats.pnl;
  };

  const isCurrentUser = useCallback((address: string) => {
    return userAddress && address.toLowerCase() === userAddress.toLowerCase();
  }, [userAddress]);

  const columns = useMemo<ColumnDef<CampaignRankingData>[]>(() => (
    activeTab === 'volume'
      ? [
        {
          header: t('extend.competition.rank'),
          accessorFn: (row, index) => index,
          cell: ({ row }) => (
            <div className="flex items-center justify-center">
              <span className="text-lg">{getRankDisplay(row.index)}</span>
            </div>
          ),
          enableSorting: false,
          size: 80,
        },
        {
          header: t('extend.competition.user'),
          accessorKey: 'address',
          cell: ({ getValue }) => {
            const value = getValue() as string;
            const [copied, setCopied] = React.useState(false);
            const handleCopy = () => {
              navigator.clipboard.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            };
            return (
              <div className="flex items-center gap-2">
                <a
                  href={getDashboardUrl(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 underline"
                >
                  {formatAddress(value)}
                </a>
                {isCurrentUser(value) && (
                  <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                    (You)
                  </span>
                )}
                <button
                  onClick={handleCopy}
                  className="ml-1 p-1 rounded hover:bg-gray-700 focus:outline-none"
                  title="Copy address"
                  style={{ lineHeight: 0 }}
                >
                  {copied ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 8l3 3 5-5" stroke="#ff9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="3" y="5" width="8" height="8" rx="2" stroke="#ff9800" strokeWidth="1.5" /><rect x="5" y="3" width="8" height="8" rx="2" stroke="#ffb347" strokeWidth="1.5" /></svg>
                  )}
                </button>
              </div>
            );
          },
          enableSorting: false,
          size: 200,
        },
        {
          header: t('extend.competition.volume'),
          accessorKey: 'volume',
          cell: ({ getValue }) => {
            const value = getValue() as number;
            return <span className="font-mono">{formatCurrency(value)}</span>;
          },
          size: 180,
          enableSorting: false,
        },
      ]
      : [
        {
          header: t('extend.competition.rank'),
          accessorFn: (row, index) => index,
          cell: ({ row }) => (
            <div className="flex items-center justify-center">
              <span className="text-lg">{getRankDisplay(row.index)}</span>
            </div>
          ),
          enableSorting: false,
          size: 80,
        },
        {
          header: t('extend.competition.user'),
          accessorKey: 'address',
          cell: ({ getValue }) => {
            const value = getValue() as string;
            const [copied, setCopied] = React.useState(false);
            const handleCopy = () => {
              navigator.clipboard.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            };
            return (
              <div className="flex items-center gap-2">
                <a
                  href={getDashboardUrl(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 underline"
                >
                  {formatAddress(value)}
                </a>
                {isCurrentUser(value) && (
                  <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                    (You)
                  </span>
                )}
                <button
                  onClick={handleCopy}
                  className="ml-1 p-1 rounded hover:bg-gray-700 focus:outline-none"
                  title="Copy address"
                  style={{ lineHeight: 0 }}
                >
                  {copied ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 8l3 3 5-5" stroke="#ff9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="3" y="5" width="8" height="8" rx="2" stroke="#ff9800" strokeWidth="1.5" /><rect x="5" y="3" width="8" height="8" rx="2" stroke="#ffb347" strokeWidth="1.5" /></svg>
                  )}
                </button>
              </div>
            );
          },
          enableSorting: false,
          size: 200,
        },
        {
          header: t('extend.competition.pnl'),
          accessorKey: 'pnl',
          cell: ({ getValue }) => {
            const value = getValue() as number;
            return (
              <span className={`font-mono ${value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(value)}
              </span>
            );
          },
          size: 150,
        },
      ]
  ), [getRankDisplay, isCurrentUser, t, activeTab]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      sorting: [{ id: activeTab, desc: true }],
    },
    columnResizeMode: 'onChange',
  });

  // Update the column count based on active tab
  const getColumnCount = () => activeTab === 'volume' ? 3 : 3; // Both tabs now have 3 columns

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setSortBy('volume');
            setActiveTab('volume');
            setSorting([{ id: 'volume', desc: true }]);
            setCurrentPage(1);
          }}
          disabled={loading}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border transition-all duration-200 ${activeTab === 'volume'
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black border-orange-500'
            : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-orange-500'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {t('extend.competition.tradingVolumeShort')}
        </button>
        <button
          onClick={() => {
            setSortBy('pnl');
            setActiveTab('pnl');
            setSorting([{ id: 'pnl', desc: true }]);
            setCurrentPage(1);
          }}
          disabled={loading}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border transition-all duration-200 ${activeTab === 'pnl'
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black border-orange-500'
            : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-orange-500'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {t('extend.competition.pnl')}
        </button>
      </div>

      {/* Info text */}
      <div className="mb-6 text-sm text-gray-400">
        <p>{t('extend.competition.maliciousTrading')}</p>
        {activeTab === 'pnl' ? (
          <p>{t('extend.competition.hourlyUpdate')}</p>
        ) : (
          <p>{t('extend.competition.minutesUpdate')}</p>
        )}
        {minVolume > 0 && activeTab === 'pnl' && (
          <p>{t('extend.competition.minVolumeRequirement', { amount: formatCurrency(minVolume) })}</p>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto relative">
        <table className="w-full table-fixed">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-b border-gray-700">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400"
                    style={{ width: header.column.getSize() }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <>
                {/* Loading spinner positioned absolutely over the table */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
                {/* Empty rows to maintain table height */}
                {Array.from({ length: ENTRIES_PER_PAGE + (userStats ? 1 : 0) }).map((_, index) => (
                  <tr key={`loading-placeholder-${index}`} className="border-b border-gray-800">
                    {Array.from({ length: getColumnCount() }).map((_, cellIndex) => (
                      <td
                        key={`loading-placeholder-cell-${index}-${cellIndex}`}
                        className="px-4 py-2 text-lg"
                        style={{ width: cellIndex === 0 ? 80 : cellIndex === 1 ? 200 : 150 }}
                      >
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ) : error ? (
              <tr>
                <td colSpan={getColumnCount()} className="px-4 py-8">
                  <div className="flex items-center justify-center text-red-400">
                    <div className="text-center">
                      <div className="text-2xl mb-2">⚠️</div>
                      <div>{error}</div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={getColumnCount()} className="px-4 py-8">
                  <div className="flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-4xl mb-4">📊</div>
                      <div className="text-lg">{t('extend.competition.leaderboardComing')}</div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {/* User stats row - always first */}
                {userStats && (
                  <tr className="bg-yellow-500/10 border-b border-yellow-500/30">
                    <td className="px-4 py-2 text-sm truncate" style={{ width: 80 }}>
                      <div className="flex items-center justify-center">
                        <span className="text-lg font-bold text-yellow-400">
                          {userStats.rank ? userStats.rank.toString() : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm truncate" style={{ width: 200 }}>
                      <div className="flex items-center gap-2">
                        {account?.address ? (
                          <a
                            href={getDashboardUrl(account.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm text-yellow-400 hover:text-yellow-300 transition-colors duration-200 underline"
                          >
                            {formatAddress(account.address)}
                          </a>
                        ) : (
                          <span className="font-mono text-sm text-yellow-400">-</span>
                        )}
                        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                          ({t('extend.competition.you')})
                        </span>
                      </div>
                    </td>
                    {activeTab === 'volume' && (
                      <td className="px-4 py-2 text-sm truncate" style={{ width: 180 }}>
                        <span className="font-mono text-yellow-400">{formatCurrency(userStats.volume)}</span>
                      </td>
                    )}
                    {activeTab === 'pnl' && (
                      <td className="px-4 py-2 text-sm truncate" style={{ width: 150 }}>
                        <span className={`font-mono ${userStats.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(userStats.pnl)}
                        </span>
                      </td>
                    )}
                  </tr>
                )}

                {/* Regular leaderboard rows */}
                {table.getRowModel().rows.map(row => {
                  const isUser = isCurrentUser(row.original.address);

                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-800 transition-colors ${isUser
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : getRowStyling(row.index) || 'hover:bg-gray-800/50'
                        }`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-4 py-2 text-sm truncate"
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                })}

                {/* Fill remaining rows with invisible placeholders */}
                {Array.from({ length: Math.max(0, ENTRIES_PER_PAGE - data.length - (userStats ? 1 : 0)) }).map((_, index) => (
                  <tr key={`placeholder-${index}`} className="border-b border-gray-800 invisible">
                    {Array.from({ length: getColumnCount() }).map((_, cellIndex) => (
                      <td
                        key={`placeholder-cell-${index}-${cellIndex}`}
                        className="px-4 py-2 text-lg"
                        style={{ width: cellIndex === 0 ? 80 : cellIndex === 1 ? 200 : 150 }}
                      >
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {data.length > 0 && (
        <div className="flex flex-col gap-2 mt-6 text-sm text-gray-400">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || loading}
                className={`px-3 py-1 rounded-md border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                &lt;&lt;
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                className={`px-3 py-1 rounded-md border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                &lt;
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
                className={`px-3 py-1 rounded-md border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                &gt;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || loading}
                className={`px-3 py-1 rounded-md border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                &gt;&gt;
              </button>
            </div>
            {/* Merged jump-to input with page display */}
            <div className="flex items-center gap-2">
              <span>{t('extend.competition.page')}</span>
              <input
                id="jump-to-page"
                type="number"
                min={1}
                max={totalPages}
                value={jumpToValue}
                onChange={e => setJumpToValue(e.target.value)}
                onBlur={e => {
                  let page = Number(e.target.value);
                  if (isNaN(page) || page < 1 || page > totalPages) {
                    setJumpToValue(currentPage.toString());
                    return;
                  }
                  setCurrentPage(page);
                  setJumpToValue(page.toString());
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    let page = Number(jumpToValue);
                    if (isNaN(page) || page < 1 || page > totalPages) {
                      setJumpToValue(currentPage.toString());
                      return;
                    }
                    setCurrentPage(page);
                    setJumpToValue(page.toString());
                  }
                }}
                className={`w-16 px-2 py-1 rounded-md border border-gray-600 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400 mx-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ textAlign: 'center' }}
                disabled={loading}
              />
              <span>{t('extend.competition.of')} {totalPages}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignLeaderboard;
