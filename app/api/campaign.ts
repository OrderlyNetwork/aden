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
  rank?: number | null;
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
      aggregate_by: "address"
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
  address: string,
  sortBy: "volume" | "roi" = "volume",
  minVolume?: number
): Promise<UserStatsResponse> => {
  try {
    const [userResponse, rankingResponse] = await Promise.all([
      fetch(
        `https://api.orderly.org/v1/public/campaign/user?${new URLSearchParams({
          campaign_id: campaignId.toString(),
          account_id: accountId,
          sort_by: sortBy,
          ...(minVolume &&
            minVolume > 0 && { min_volume: minVolume.toString() }),
        })}`
      ),
      fetch(
        `https://api.orderly.org/v1/public/campaign/ranking?${new URLSearchParams(
          {
            campaign_id: campaignId.toString(),
            sort_by: sortBy,
            page: "1",
            size: "500",
            ...(minVolume &&
              minVolume > 0 && { min_volume: minVolume.toString() }),
          }
        )}`
      ),
    ]);

    if (!userResponse.ok) {
      throw new Error(`HTTP error! status: ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    if (rankingResponse.ok) {
      const rankingData = await rankingResponse.json();
      const userRank = rankingData.data.rows.findIndex(
        (row: CampaignRankingData) =>
          row.account_id.toLowerCase() === accountId.toLowerCase()
      );

      return {
        ...userData,
        data: {
          ...userData.data,
          rank: userRank >= 0 ? userRank + 1 : null,
        },
      };
    }

    return {
      ...userData,
      data: {
        ...userData.data,
        rank: null,
      },
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw new Error("Failed to fetch user stats data");
  }
};

export const getUserStatsNoRanking = async (
  campaignId: number,
  accountId: string,
  address: string,
  sortBy: "volume" | "roi" = "volume",
  minVolume?: number
): Promise<UserStatsResponse> => {
  try {
    const [userResponse] = await Promise.all([
      fetch(
        `https://api.orderly.org/v1/public/campaign/user?${new URLSearchParams({
          campaign_id: campaignId.toString(),
          // account_id: accountId,
          address: "0x88dc86676f58421b52a158422d2297cea847770c",
          sort_by: sortBy,
          ...(minVolume &&
            minVolume > 0 && { min_volume: minVolume.toString() }),
        })}`
      ),
    ]);

    if (!userResponse.ok) {
      throw new Error(`HTTP error! status: ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    return {
      ...userData,
      data: {
        ...userData.data,
        rank: null,
      },
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw new Error("Failed to fetch user stats data");
  }
};