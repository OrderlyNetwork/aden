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

import { getCampaignRanking, getUserStats, type CampaignRankingData, type UserStats } from '@/api/campaign';
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
  const [activeTab, setActiveTab] = useState<'volume' | 'roi'>('volume');
  const [data, setData] = useState<CampaignRankingData[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'volume' | 'roi'>('volume');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);




  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await getCampaignRanking(campaignId, sortBy, currentPage, ENTRIES_PER_PAGE, activeTab === 'roi' ? minVolume : undefined);
        
        if (result.success) {
          setData(result.data.rows);
          setTotalPages(Math.ceil(result.data.meta.total / ENTRIES_PER_PAGE));
        } else {
          setError('Failed to fetch leaderboard data');
        }
      } catch (err) {
        setError('Error loading leaderboard data');
        console.error('Error fetching campaign ranking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [campaignId, sortBy, currentPage, minVolume, activeTab]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!account?.accountId) return;
      
      try {
        const result = await getUserStats(
          campaignId, 
          account.accountId, 
          activeTab, 
          activeTab === 'roi' ? minVolume : undefined
        );
        if (result.success) {
          setUserStats(result.data);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserData();
  }, [account?.accountId, campaignId, activeTab, minVolume]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: activeTab, desc: true }
  ]);

  useEffect(() => {
    setSortBy(activeTab);
    setCurrentPage(1);
    setSorting([{ id: activeTab, desc: true }]);
  }, [activeTab]);

  const formatAddress = (address: string) => {
    if (!address) return '-';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
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
    <svg style={{height: '1.75rem'}} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L12 6 M10 4 L14 4" stroke="#FFD700" strokeWidth="1" fill="none"/>
      <circle cx="12" cy="12" r="8" fill="#FFD700" stroke="#B8860B" strokeWidth="1"/>
      <circle cx="12" cy="12" r="6" fill="#FFF3B0" stroke="#FFD700" strokeWidth="0.5"/>
      <text x="12" y="15" textAnchor="middle" fontWeight="bold" fontSize="8" fill="#B8860B">1</text>
      <circle cx="10" cy="10" r="2" fill="#FFFFFF" opacity="0.3"/>
    </svg>
  );
  const SilverMedal = () => (
    <svg style={{height: '1.75rem'}} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L12 6 M10 4 L14 4" stroke="#C0C0C0" strokeWidth="1" fill="none"/>
      <circle cx="12" cy="12" r="8" fill="#C0C0C0" stroke="#A0A0A0" strokeWidth="1"/>
      <circle cx="12" cy="12" r="6" fill="#F0F0F0" stroke="#C0C0C0" strokeWidth="0.5"/>
      <text x="12" y="15" textAnchor="middle" fontWeight="bold" fontSize="8" fill="#888">2</text>
      <circle cx="10" cy="10" r="2" fill="#FFFFFF" opacity="0.3"/>
    </svg>
  );
  const BronzeMedal = () => (
    <svg style={{height: '1.75rem'}} width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2 L12 6 M10 4 L14 4" stroke="#CD7F32" strokeWidth="1" fill="none"/>
      <circle cx="12" cy="12" r="8" fill="#CD7F32" stroke="#8B5C2A" strokeWidth="1"/>
      <circle cx="12" cy="12" r="6" fill="#F7CBA0" stroke="#CD7F32" strokeWidth="0.5"/>
      <text x="12" y="15" textAnchor="middle" fontWeight="bold" fontSize="8" fill="#8B5C2A">3</text>
      <circle cx="10" cy="10" r="2" fill="#FFFFFF" opacity="0.3"/>
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

  const isCurrentUser = useCallback((address: string) => {
    return userAddress && address.toLowerCase() === userAddress.toLowerCase();
  }, [userAddress]);

  const columns = useMemo<ColumnDef<CampaignRankingData>[]>(() => [
    {
      header: t('extend.competition.rank'),
      accessorFn: (row, index) => index,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <span className="text-lg">
            {getRankDisplay(row.index)}
          </span>
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
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">
              {formatAddress(value)}
              {isCurrentUser(value) && (
                <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                  (You)
                </span>
              )}
            </span>
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
    {
      header: t('extend.competition.roi'),
      accessorKey: 'roi',
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return (
          <span className={`font-mono ${value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatPercentage(value * 100)}
          </span>
        );
      },
      size: 120,
      enableSorting: false,
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
  ], [getRankDisplay, isCurrentUser, t]);

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





  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('volume')}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border transition-all duration-200 ${
            activeTab === 'volume'
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black border-orange-500'
              : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-orange-500'
          }`}
        >
          {t('extend.competition.tradingVolumeShort')}
        </button>
        <button
          onClick={() => setActiveTab('roi')}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider border transition-all duration-200 ${
            activeTab === 'roi'
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-black border-orange-500'
              : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700 hover:border-orange-500'
          }`}
        >
          {t('extend.competition.roi')}
        </button>
      </div>

      {/* Info text */}
      <div className="mb-6 text-sm text-gray-400">
        <p>{t('extend.competition.maliciousTrading')}</p>
        <p>{t('extend.competition.hourlyUpdate')}</p>
        {minVolume > 0 && activeTab === 'roi' && (
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
                    {Array.from({ length: 5 }).map((_, cellIndex) => (
                      <td
                        key={`loading-placeholder-cell-${index}-${cellIndex}`}
                        className="px-4 py-2 text-lg"
                        style={{ width: cellIndex === 0 ? 80 : cellIndex === 1 ? 200 : cellIndex === 2 ? 180 : cellIndex === 3 ? 120 : 150 }}
                      >
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-4 py-8">
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
                <td colSpan={5} className="px-4 py-8">
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
                          <span className="text-lg font-bold text-yellow-400">?</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm truncate" style={{ width: 200 }}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-yellow-400">
                            {account?.address ? formatAddress(account.address) : '-'}
                          </span>
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                            ({t('extend.competition.you')})
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm truncate" style={{ width: 180 }}>
                        <span className="font-mono text-yellow-400">{formatCurrency(userStats.volume)}</span>
                      </td>
                      <td className="px-4 py-2 text-sm truncate" style={{ width: 120 }}>
                        <span className={`font-mono ${calculateUserROI(userStats) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPercentage(calculateUserROI(userStats))}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm truncate" style={{ width: 150 }}>
                        <span className={`font-mono ${userStats.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(userStats.pnl)}
                        </span>
                      </td>
                    </tr>
                  )}
                  
                  {/* Regular leaderboard rows */}
                  {table.getRowModel().rows.map(row => {
                    const isUser = isCurrentUser(row.original.address);
                    
                    return (
                      <tr
                        key={row.id}
                        className={`border-b border-gray-800 transition-colors ${
                          isUser 
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
                      {Array.from({ length: 5 }).map((_, cellIndex) => (
                        <td
                          key={`placeholder-cell-${index}-${cellIndex}`}
                          className="px-4 py-2 text-lg"
                          style={{ width: cellIndex === 0 ? 80 : cellIndex === 1 ? 200 : cellIndex === 2 ? 180 : cellIndex === 3 ? 120 : 150 }}
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
      <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt;&lt;
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lt;
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &gt;
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &gt;&gt;
          </button>
        </div>
        <span>
          {t('extend.competition.page')} {currentPage} {t('extend.competition.of')} {totalPages}
        </span>
      </div>
    </div>
  );
};

export default CampaignLeaderboard;
