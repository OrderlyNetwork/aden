import { useMemo } from "react";
import { Outlet, useLocation } from "@remix-run/react";
import { PortfolioLayoutWidget } from "@orderly.network/portfolio";
import { useOrderlyConfig } from "@/utils/config";
import { useNav } from "@/hooks/useNav";

export default function PortfolioLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  const { onRouteChange } = useNav();
  const config = useOrderlyConfig();

  const currentPath = useMemo(() => {
    if (pathname.endsWith("/portfolio")) return "/portfolio";
    if (pathname.endsWith("/portfolio/fee")) return "/portfolio/feeTier";
    if (pathname.endsWith("/portfolio/api-key")) return "/portfolio/apiKey";
    return pathname;
  }, [pathname]);

  const customSideBarItems = [
    {
      name: "Overview",
      href: "/portfolio"
    },
    {
      name: "Positions",
      href: "/portfolio/positions"
    },
    {
      name: "Orders",
      href: "/portfolio/orders"
    },
    {
      name: "API Keys",
      href: "/portfolio/api-key"
    },
    {
      name: "Settings",
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
        current: currentPath,
      }}
      bottomNavProps={config.scaffold.bottomNavProps}
    >
      <Outlet />
    </PortfolioLayoutWidget>
  );
}
