import { useEffect } from "react";
import { Outlet } from "@remix-run/react";
import { Scaffold } from "@orderly.network/ui-scaffold";
import { useOrderlyConfig } from "@/utils/config";
import { useNav } from "@/hooks/useNav";
import { useTranslation } from "@orderly.network/i18n";

export default function PerpPage() {
  const config = useOrderlyConfig();
  const { onRouteChange } = useNav();
  const { t } = useTranslation();

  // Set page title for all demo trading pages
  useEffect(() => {
    document.title = t('extend.pageTitle');
  }, [t]);

  return (
    <Scaffold
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/demo_trading/BTCUSDT",
      }}
      footerProps={config.scaffold.footerProps}
      routerAdapter={{
        onRouteChange,
        currentPath: "/demo_trading/BTCUSDT",
      }}
    >
      <Outlet />
    </Scaffold>
  );
}
