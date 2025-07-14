import { useEffect, useState } from 'react';
import { UserAssets } from '~/store/userAssetsStore';
import { getUserTodayProfit } from '~/api/user_profit';
import useUserStore from '~/store/userStore';

export interface TodayProfitData {
  todayUsdtGain: number;
  todayBugsGain: number;
  isLoading: boolean;
  error: string | null;
}

interface UserTodayProfitContainerProps {
  userAssets: UserAssets;
  children: (data: TodayProfitData) => React.ReactNode;
}

export default function UserTodayProfitContainer({ userAssets, children }: UserTodayProfitContainerProps) {
  const [todayUsdtGain, setTodayUsdtGain] = useState(0);
  const [todayBugsGain, setTodayBugsGain] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchTodayProfit = async () => {
      if (user.user_id !== -1) {
        try {
          setIsLoading(true);
          setError(null);
          const profitData = await getUserTodayProfit(user.user_id);
          setTodayUsdtGain(profitData.today_usdt_gain);
          setTodayBugsGain(profitData.today_bugs_gain);
        } catch (err) {
          console.error('Failed to fetch today profit data:', err);
          setError('Failed to fetch today\'s profit data');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTodayProfit();
  }, [user.user_id]);

  return <>{children({ todayUsdtGain, todayBugsGain, isLoading, error })}</>;
} 