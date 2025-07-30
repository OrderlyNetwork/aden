import { MetaFunction } from "@remix-run/node";
import { LeaderboardPage } from "@orderly.network/trading-leaderboard";
import { generatePageTitle } from "@/utils/utils";

// export const meta: MetaFunction = () => {
//   return [{ title: generatePageTitle("Leaderboard") }];
// };

export default function MarketsPage() {
  return <LeaderboardPage
    campaignId={118}
    backgroundSrc="./back.webm"

  />;
}
