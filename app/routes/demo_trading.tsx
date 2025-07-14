import { Outlet } from "@remix-run/react";
import { Scaffold } from "@orderly.network/ui-scaffold";
import { useOrderlyConfig } from "@/utils/config";
import { useNav } from "@/hooks/useNav";

export default function PerpPage() {
  const config = useOrderlyConfig();
  const { onRouteChange } = useNav();

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
    bottomNavProps={{...config.scaffold.bottomNavProps, current: "/demo_trading/BTCUSDT"}}
    >
      <Outlet />
    </Scaffold>
  );
}
