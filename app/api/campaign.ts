export interface CampaignRankingData {
  account_id: string;
  volume: number;
  address: string;
  broker_id: string;
  pnl: number;
  total_deposit_amount: number;
  total_withdrawal_amount: number;
  start_account_value: number;
  end_account_value: number;
  roi: number;
}

export interface UserStats {
  volume: number;
  pnl: number;
  filled_orders_count: number;
  updated_time: number;
  total_deposit_amount: number;
  total_withdrawal_amount: number;
  start_account_value: number;
  end_account_value: number;
  total_staked_order: number;
  total_staked_esorder: number;
  total_transfer_in: number;
  total_transfer_out: number;
  new_invited_referee: number;
  new_traded_referee: number;
}

export interface UserStatsResponse {
  success: boolean;
  timestamp: number;
  data: UserStats;
}

export interface CampaignRankingResponse {
  success: boolean;
  timestamp: number;
  data: {
    meta: {
      total: number;
      records_per_page: number;
      current_page: number;
    };
    rows: CampaignRankingData[];
  };
}

export const getCampaignRanking = async (
  campaignId: number,
  sortBy: "volume" | "roi" = "volume",
  page: number = 1,
  size: number = 25,
  minVolume?: number
): Promise<CampaignRankingResponse> => {
  try {
    const params = new URLSearchParams({
      campaign_id: campaignId.toString(),
      sort_by: sortBy,
      page: page.toString(),
      size: size.toString(),
    });

    if (minVolume && minVolume > 0) {
      params.append("min_volume", minVolume.toString());
    }

    const response = await fetch(
      `https://api.orderly.org/v1/public/campaign/ranking?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching campaign ranking:", error);
    throw new Error("Failed to fetch campaign ranking data");
  }
};

export const getUserStats = async (
  campaignId: number,
  accountId: string,
  sortBy: "volume" | "roi" = "volume",
  minVolume?: number
): Promise<UserStatsResponse> => {
  try {
    const params = new URLSearchParams({
      campaign_id: campaignId.toString(),
      account_id: accountId,
      sort_by: sortBy,
    });

    if (minVolume && minVolume > 0) {
      params.append("min_volume", minVolume.toString());
    }

    const response = await fetch(
      `https://api.orderly.org/v1/public/campaign/user?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw new Error("Failed to fetch user stats data");
  }
};
