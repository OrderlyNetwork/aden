import { useEffect } from "react";
import { ReferralProvider } from "@orderly.network/affiliate";
import { Outlet } from "@remix-run/react";
import {
    TradingRewardsLayoutWidget,
} from "@orderly.network/trading-rewards";
import { useOrderlyConfig } from "@/utils/config";
import { useNav } from "@/hooks/useNav";
import { useTranslation } from "@orderly.network/i18n";

export default function TradingRewardsLayout() {
    const { onRouteChange } = useNav();
    const config = useOrderlyConfig();
    const { t } = useTranslation();

    useEffect(() => {
        document.title = t('extend.pageTitle');
    }, [t]);

    return (
        <ReferralProvider
            becomeAnAffiliateUrl={import.meta.env.VITE_BECOME_AFFILIATE_URL}
            learnAffiliateUrl={import.meta.env.VITE_LEARN_AFFILIATE_URL}
            referralLinkUrl={import.meta.env.VITE_REFERRAL_LINK_URL}
            overwrite={{
                shortBrokerName: import.meta.env.VITE_ORDERLY_BROKER_NAME,
                brokerName: import.meta.env.VITE_ORDERLY_BROKER_NAME,
                ref: {
                },
            }}
        >
            <TradingRewardsLayoutWidget
                footerProps={config.scaffold.footerProps}
                mainNavProps={{
                    ...config.scaffold.mainNavProps,
                    initialMenu: "/referral",
                }}
                routerAdapter={{ onRouteChange }}
                leftSidebar={null}>
                <Outlet />
            </TradingRewardsLayoutWidget>
        </ReferralProvider >
    )
}
