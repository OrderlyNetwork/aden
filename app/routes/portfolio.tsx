import { useEffect } from "react";
import { Outlet, useLocation } from "@remix-run/react";
import { PortfolioLayoutWidget } from "@orderly.network/portfolio";
import { useOrderlyConfig } from "@/utils/config";
import { useNav } from "@/hooks/useNav";
import { useTranslation } from "@orderly.network/i18n";

export default function PortfolioLayout() {
  const location = useLocation();
  const pathname = location.pathname;
  const { t } = useTranslation();

  const { onRouteChange } = useNav();
  const config = useOrderlyConfig();

  useEffect(() => {
    document.title = t('extend.pageTitle');
  }, [t]);

  const customSideBarItems = [
    {
      name: t("common.overview"),
      href: "/portfolio"
    },
    {
      name: t("common.positions"),
      href: "/portfolio/positions"
    },
    {
      name: t("common.orders"),
      href: "/portfolio/orders"
    },
    {
      name: t("common.assets"),
      href: "/portfolio/assets"
    },
    {
      name: t("portfolio.apiKeys"),
      href: "/portfolio/api-key"
    },
    {
      name: t("portfolio.setting"),
      href: "/portfolio/setting"
    },
  ];

  return (
    <PortfolioLayoutWidget
      items={customSideBarItems}
      footerProps={config.scaffold.footerProps}
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/portfolio",
      }}
      routerAdapter={{
        onRouteChange,
      }}
      leftSideProps={{
        current: pathname,
      }}
    >
      <Outlet />
    </PortfolioLayoutWidget>
  );
}
