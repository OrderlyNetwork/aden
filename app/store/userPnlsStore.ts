import { create } from 'zustand';
import { getUserPnls, UserPnl, UserPnlResponse } from '~/api/user_pnls';

interface UserPnlsStoreState {
  pnls: UserPnl[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  startDate: number;
  endDate: number;
  userId: number;
  fetchPnls: (userId: number, newStartDate?: number, newEndDate?: number, resetPagination?: boolean) => Promise<void>;
  setDateRange: (startDate: number, endDate: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToPage: (page: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  getCurrentPage: () => number;
  getTotalPages: () => number;
}

export const useUserPnlsStore = create<UserPnlsStoreState>((set, get) => ({
  pnls: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  limit: 10,
  offset: 0,
  hasMore: false,
  startDate: new Date().setHours(0, 0, 0, 0) / 1000 - 7 * 24 * 60 * 60, // Default to 7 days ago
  endDate: new Date().setHours(23, 59, 59, 999) / 1000,
  userId: -1,

  fetchPnls: async (userId: number, newStartDate?: number, newEndDate?: number, resetPagination = false) => {
    const { limit, offset, startDate: currentStartDate, endDate: currentEndDate } = get();
    
    try {
      set({ isLoading: true, error: null, userId });
      
      // Use provided dates or current state
      const start = newStartDate !== undefined ? newStartDate : currentStartDate;
      const end = newEndDate !== undefined ? newEndDate : currentEndDate;
      const newOffset = resetPagination ? 0 : offset;
      
      const response = await getUserPnls(userId, start, end, newOffset, limit);
      
      set({
        pnls: response.data,
        totalCount: response.total,
        offset: newOffset,
        hasMore: response.has_more,
        startDate: start,
        endDate: end,
        isLoading: false
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch USDT transactions' 
      });
    }
  },

  setDateRange: (startDate: number, endDate: number) => {
    set({ 
      startDate, 
      endDate, 
      offset: 0 // Reset pagination when changing date range
    });
    
    // Refetch with new date range
    const { userId } = get();
    if (userId !== -1) {
      get().fetchPnls(userId, startDate, endDate, true);
    }
  },

  goToNextPage: () => {
    const { offset, limit, hasMore, userId, startDate, endDate } = get();
    if (hasMore) {
      const newOffset = offset + limit;
      set({ offset: newOffset });
      
      // Refetch data for next page
      if (userId !== -1) {
        get().fetchPnls(userId);
      }
    }
  },

  goToPrevPage: () => {
    const { offset, limit, userId } = get();
    if (offset - limit >= 0) {
      const newOffset = offset - limit;
      set({ offset: newOffset });
      
      // Refetch data for previous page
      if (userId !== -1) {
        get().fetchPnls(userId);
      }
    }
  },

  goToPage: (page: number) => {
    const { limit, totalCount, userId } = get();
    const maxOffset = Math.max(0, totalCount - limit);
    const newOffset = Math.min(maxOffset, Math.max(0, (page - 1) * limit));
    set({ offset: newOffset });
    
    // Refetch data for the selected page
    if (userId !== -1) {
      get().fetchPnls(userId);
    }
  },

  goToFirstPage: () => {
    const { userId } = get();
    set({ offset: 0 });
    
    // Refetch data for first page
    if (userId !== -1) {
      get().fetchPnls(userId);
    }
  },

  goToLastPage: () => {
    const { limit, totalCount, userId } = get();
    const lastPageOffset = Math.max(0, totalCount - limit);
    set({ offset: lastPageOffset });
    
    // Refetch data for last page
    if (userId !== -1) {
      get().fetchPnls(userId);
    }
  },

  getCurrentPage: () => {
    const { offset, limit } = get();
    return Math.floor(offset / limit) + 1;
  },

  getTotalPages: () => {
    const { totalCount, limit } = get();
    return Math.ceil(totalCount / limit);
  }
})); 