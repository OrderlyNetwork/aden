import { useState, useEffect } from 'react';
import { getMockInvestmentConfig, MockInvestmentConfig } from '~/api/mock_investment_config';

export const useMockInvestmentConfig = () => {
  const [config, setConfig] = useState<MockInvestmentConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        const configData = await getMockInvestmentConfig();
        setConfig(configData);
      } catch (err) {
        console.error('Failed to fetch mock investment config:', err);
        setError('설정을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const refreshConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const configData = await getMockInvestmentConfig();
      setConfig(configData);
    } catch (err) {
      console.error('Failed to refresh mock investment config:', err);
      setError('설정을 새로고침하는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return {
    config,
    loading,
    error,
    refreshConfig
  };
}; 