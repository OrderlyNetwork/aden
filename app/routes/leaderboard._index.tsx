import React, { useEffect, useState } from "react";
import {
  TradingLeaderboardProvider,
  CampaignsWidget,
  LeaderboardSection,
  LeaderboardPage,
} from "@orderly.network/trading-leaderboard";
import { useCustomRanking } from "@/hooks/useCustomRanking";

export const leaderboardCampaigns: any[] = [
  {
    campaign_id: '118',
    title: 'ADEN x Orderly Trading Competition',
    description: 'Volume trading competition. Be the champion and win $1,000,000 in prizes!',
    image: './back.webp',
    start_time: new Date('2025-08-01T00:00:00Z').toISOString(),
    end_time: new Date('2025-08-31T23:59:59Z').toISOString(),
    reward_distribution_time: undefined,
    volume_scope: undefined,
    prize_pools: [
      {
        pool_id: 'trading',
        label: 'Trading volume pool',
        total_prize: 500000,
        currency: 'USDT',
        metric: 'volume',
        tiers: [
          { position: 1, amount: 40000 },
          { position: 2, amount: 25000 },
          { position: 3, amount: 15000 },
          { position_range: [4, 10], amount: 7000 },
          { position_range: [11, 30], amount: 4000 },
          { position_range: [31, 100], amount: 2000 },
          { position_range: [101, 200], amount: 1000 },
          { position_range: [201, 500], amount: 170 },
        ],
      },
      {
        pool_id: 'PNL',
        label: 'Trading PNL pool',
        total_prize: 500000,
        currency: 'USDT',
        metric: 'pnl',
        tiers: [
          { position: 1, amount: 30000 },
          { position: 2, amount: 20000 },
          { position: 3, amount: 10000 },
          { position_range: [4, 10], amount: 5000 },
          { position_range: [11, 30], amount: 3000 },
          { position_range: [31, 100], amount: 2000 },
          { position_range: [101, 200], amount: 1000 },
          { position_range: [201, 500], amount: 170 },
        ],
      },
    ],
    rule_url: '',
    trading_url: ``,
  } as any,
  // {
  //     campaign_id: '101',
  //     title: 'DAWN OF DOMINANCE',
  //     description: 'A new era begins. Outtrade the competition. Climb the ranks. Secure your legacy.',
  //     image: '/leaderboard/woofi_leaderboard_test.jpeg',
  //     start_time: new Date('2025-06-18T00:00:00Z').toISOString(),
  //     end_time: new Date('2025-07-04T23:59:59Z').toISOString(),
  //     referral_codes: ['VIP2024', 'ELITE', 'PREMIUM'],
  //     reward_distribution_time: undefined,
  //     volume_scope: undefined,
  //     prize_pools: [
  //         {
  //             pool_id: 'trading',
  //             label: 'Trading volume pool',
  //             total_prize: 20000,
  //             currency: 'USDC',
  //             metric: 'volume',
  //             tiers: [
  //                 { position: 1, amount: 1400 },
  //                 { position: 2, amount: 1200 },
  //                 { position: 3, amount: 1000 },
  //                 { position_range: [4, 5], amount: 750 },
  //                 { position_range: [6, 10], amount: 440 },
  //                 { position_range: [11, 15], amount: 340 },
  //                 { position_range: [16, 25], amount: 275 },
  //                 { position_range: [26, 50], amount: 180 },
  //                 { position_range: [51, 75], amount: 75 },
  //                 { position_range: [76, 100], amount: 50 },
  //                 { position_range: [101, 125], amount: 25 },
  //             ],
  //         },
  //     ],
  //     ticket_rules: {
  //         total_prize: 2500,
  //         currency: 'USDC',
  //         metric: 'volume',
  //         mode: 'tiered',
  //         tiers: [
  //             { value: 5000, tickets: 1 },
  //             { value: 10000, tickets: 5 },
  //             { value: 50000, tickets: 30 },
  //             { value: 100000, tickets: 70 },
  //             { value: 250000, tickets: 200 },
  //         ],
  //     },
  //     rule_url: '',
  //     trading_url: 'https://pro.woofi.com/en/trade/ETH_PERP',
  // } as any,
  // {
  //     campaign_id: 102,
  //     title: 'RISE ABOVE. OUTTRADE THE REST',
  //     description:
  //         'A new era of traders is rising. Are you the one leading the charge? Compete for your share of $15K by climbing the ranks. Only the bold will make it to the top.',
  //     image: '/leaderboard/woof.png',
  //     href: 'https://orderly.network/',
  //     start_time: new Date('2025-03-27T14:30:00Z').toISOString(),
  //     end_time: new Date('2025-04-02T23:59:00Z').toISOString(),
  //     reward_distribution_time: new Date('2025-04-02T23:59:00Z').toISOString(),
  //     prize_pools: [
  //         {
  //             pool_id: 'general_volume',
  //             label: 'Volume Trading Pool',
  //             total_prize: 10000,
  //             currency: 'USDT',
  //             metric: 'volume' as const,
  //             tiers: [
  //                 { position: 1, amount: 3000 },
  //                 { position: 2, amount: 2000 },
  //                 { position: 3, amount: 1500 },
  //                 { position_range: [4, 10], amount: 500 },
  //                 { position_range: [11, 50], amount: 100 },
  //             ],
  //         },
  //         {
  //             pool_id: 'pnl_bonus',
  //             label: 'PnL Bonus Pool',
  //             total_prize: 5000,
  //             currency: 'USDT',
  //             metric: 'pnl' as const,
  //             tiers: [
  //                 { position: 1, amount: 2000 },
  //                 { position: 2, amount: 1500 },
  //                 { position: 3, amount: 1000 },
  //                 { position_range: [4, 10], amount: 100 },
  //             ],
  //         },
  //     ],
  //     ticket_rules: {
  //         total_prize: 1000,
  //         currency: 'WIF',
  //         metric: 'volume' as const,
  //         mode: 'tiered' as const,
  //         tiers: [
  //             { value: 50000, tickets: 20 },
  //             { value: 25000, tickets: 10 },
  //             { value: 10000, tickets: 5 },
  //             { value: 5000, tickets: 1 },
  //         ],
  //     },
  // } as any,
  //
  // // Future exclusive campaign for specific referral codes
  // {
  //     campaign_id: 106,
  //     title: 'VIP TRADERS EXCLUSIVE CHAMPIONSHIP',
  //     description:
  //         'An exclusive tournament for our VIP community. Massive prizes await the elite traders. Limited to verified VIP members only.',
  //     image: '/leaderboard/woof.png',
  //     // href: {
  //     //     learnMore: 'https://orderly.network/vip-campaign',
  //     //     trading: 'https://orderly.network/trade',
  //     // },
  //     start_time: new Date('2025-03-27T14:30:00Z').toISOString(),
  //     end_time: new Date('2025-04-02T23:59:00Z').toISOString(),
  //     reward_distribution_time: new Date('2025-04-02T23:59:00Z').toISOString(),
  //     // referral_codes: ['VIP2024', 'ELITE', 'PREMIUM'],
  //     volume_scope: undefined,
  //     prize_pools: [
  //         {
  //             pool_id: 'vip_exclusive',
  //             label: 'VIP Exclusive Pool',
  //             total_prize: 50000,
  //             currency: 'USDT',
  //             metric: 'volume' as const,
  //             tiers: [
  //                 { position: 1, amount: 20000 },
  //                 { position: 2, amount: 15000 },
  //                 { position: 3, amount: 10000 },
  //                 { position_range: [4, 5], amount: 2500 },
  //             ],
  //         },
  //     ],
  //     ticket_rules: {
  //         total_prize: 5000,
  //         currency: 'ORD',
  //         metric: 'pnl' as const,
  //         mode: 'linear' as const,
  //         linear: {
  //             every: 1000,
  //             tickets: 1,
  //         },
  //     },
  // } as any,

  // Summer Trading Championship 2025

  // {
  //     title: 'THE MARKET IS CHAOS. BUT $10K IS $10K.',
  //     description:
  //         'Markets are ruthless, but let’s be real-you’ve seen it all before. So here’s another trading competition. Use the new leaderboard to track your position!',
  //     image: '/leaderboard/campaign1_bg.png',
  //     startTime: new Date('2025-03-27T14:30:00Z'),
  //     endTime: new Date('2025-04-02T23:59:00Z'),
  //     href: 'https://mirror.xyz/woofi.eth/A01G4XHqicuWwmjsCVl0_cDVx4EvC2kq-aHbWHitQHo',
  // },
  // {
  //     title: 'Berachain trading rush: $5,000 USDC reward pool',
  //     description:
  //         'To celebrate the powerhouse partnership between Berachain, Orderly, and WOOFi Pro, we’re giving you the chance to win from a $5,000 USDC reward pool just by trading on WOOFi Pro. Whether you’re a first-timer or a longtime user, rewards are up for grabs—don’t miss your shot!',
  //     image: '/leaderboard/campaign2_bg.jpg',
  //     startTime: new Date('2025-04-08T09:00:00Z'),
  //     endTime: new Date('2025-04-14T09:00:00Z'),
  //     href: 'https://www.notion.so/Berachain-trading-rush-5-000-USDC-reward-pool-1b2afa8a243d801fa2bae0b3eb4fff21',
  // },
  // {
  //     title: 'WOOFi Trade Frenzy: 5,000 USDC Prize Pool',
  //     description: 'Update alert! Track your PnL via our live leaderboard and win up to 5,000 USDC.',
  //     image: '/leaderboard/campaign3_bg.png',
  //     startTime: new Date('2025-04-25T00:00:00Z'),
  //     endTime: new Date('2025-05-01T00:00:00Z'),
  //     href: 'https://mirror.xyz/woofi.eth/9nCf1Aoge4ETaFCFmgGNt9Iro0aAcv4v3JQqkSFaf-U',
  // },
];

export default function leaderboardPage() {
  const [campaignId, setCampaignId] = useState<string | undefined>('118');
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const campaign_id = searchParams.get('campaign_id');
    const campaign = leaderboardCampaigns.find((campaign) => campaign.campaign_id === String(campaign_id));
    if (campaign_id && campaign) {
      setCampaignId(campaign_id);
    } else {
      const now = new Date().toISOString();
      const campaign = leaderboardCampaigns.find((campaign) => campaign.start_time < now && campaign.end_time > now);
      if (campaign) {
        setCampaignId(campaign.campaign_id);
      }
    }
  }, []);

  const { dataAdapter } = useCustomRanking(campaignId);

  return (
    <LeaderboardPage
      campaignId={campaignId}
      onCampaignChange={setCampaignId as any}
      campaigns={leaderboardCampaigns}
      href={{
        trading: "tradingUrl",
      }}
      backgroundSrc="./back.webm',"
      className="oui-py-5"
      dataAdapter={dataAdapter}
    />
  );
}
