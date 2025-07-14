import api from '~/utils/api';

export interface MockInvestmentConfig {
  initial_usdt: number;
  default_leverage_limit: number;
  item_leverage_limit: number;
  limit_order_fee_rate: number;
  market_order_fee_rate: number;
  liquidation_threshold_ratio: number;
  usdt_to_krw_exchange_rate: number;
}

export interface MockInvestmentConfigUpdatePayload {
  initial_usdt?: number;
  default_leverage_limit?: number;
  item_leverage_limit?: number;
  limit_order_fee_rate?: number;
  market_order_fee_rate?: number;
  liquidation_threshold_ratio?: number;
  usdt_to_krw_exchange_rate?: number;
}

let cachedConfig: MockInvestmentConfig | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

export const getMockInvestmentConfig = async (): Promise<MockInvestmentConfig> => {
  const now = Date.now();
  
  // 캐시된 데이터가 있고 유효하면 반환
  if (cachedConfig && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedConfig;
  }
  
  try {
    const response = await api.get('/api/mock-investment/config');
    cachedConfig = response.data;
    lastFetchTime = now;
    return response.data;
  } catch (error) {
    console.error('Failed to fetch mock investment config:', error);
    
    // 실패 시 기본값 반환
    const defaultConfig: MockInvestmentConfig = {
      initial_usdt: 100000,
      default_leverage_limit: 20,
      item_leverage_limit: 100,
      limit_order_fee_rate: 0.0002,
      market_order_fee_rate: 0.00055,
      liquidation_threshold_ratio: 0.6,
      usdt_to_krw_exchange_rate: 1320
    };
    
    return defaultConfig;
  }
};

export const updateMockInvestmentConfig = async (
  payload: MockInvestmentConfigUpdatePayload
): Promise<MockInvestmentConfig> => {
  try {
    const response = await api.put('/api/mock-investment/config', payload);
    cachedConfig = response.data;
    lastFetchTime = Date.now();
    return response.data;
  } catch (error) {
    console.error('Failed to update mock investment config:', error);
    throw error;
  }
};

// 캐시 무효화 함수
export const invalidateMockInvestmentConfigCache = (): void => {
  cachedConfig = null;
  lastFetchTime = 0;
}; 