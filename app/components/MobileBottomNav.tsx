import { Link, useLocation } from "@remix-run/react";
import { Gamepad2 } from "lucide-react";
import { useTranslation } from "~/i18n/TranslationContext";
import { TradingActiveIcon, TradingInactiveIcon, PortfolioActiveIcon, PortfolioInactiveIcon, LeaderboardActiveIcon, LeaderboardInactiveIcon } from "@orderly.network/ui";

export default function MobileBottomNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const { t } = useTranslation();

  return (
    <footer className="md:dc-hidden dc-fixed dc-h-64 dc-bottom-0 dc-left-0 dc-right-0 dc-z-50 dc-bg-black dc-border-t dc-border-gray-800">
      <div className="relative oui-box oui-px-3 oui-size-width dc-h-64 oui-flex oui-flex-row oui-items-center oui-justify-between oui-flex-nowrap oui-bg-base-9">
        <Link to="/" className={`h-full rounded-full oui-box oui-flex oui-flex-col oui-items-center oui-justify-center oui-flex-nowrap oui-flex-1 ${pathname.startsWith("/perp") ? "nav-active -translate-y-0.5 transition-all duration-200 ease-linear text-[#ffba00] bg-[rgba(255, 186, 0, 0.15)] before:-translate-y-0.5 before:transition-all before:duration-200 before:ease-linear before:dc-w-24 before:dc-h-[3.5px] before:dc-bg-[#ffba00] before:absolute before:-top-1 before:dc-rounded-b-[3px]" : "text-[#ffffffb3]"}`}
          style={pathname.startsWith("/perp") ? { fontWeight: 600, background: 'rgba(255, 186, 0, 0.15)' } : {}}>

          <span>{t('common.trading')}</span>
        </Link>

        <Link to="/portfolio" className={`h-full rounded-full oui-box oui-flex oui-flex-col oui-items-center oui-justify-center oui-flex-nowrap oui-flex-1 ${pathname.startsWith("/portfolio") ? "nav-active -translate-y-0.5 transition-all duration-200 ease-linear text-[#ffba00] bg-[rgba(255, 186, 0, 0.15)] before:-translate-y-0.5 before:transition-all before:duration-200 before:ease-linear before:dc-w-24 before:dc-h-[3.5px] before:dc-bg-[#ffba00] before:absolute before:-top-1 before:dc-rounded-b-[3px]" : "text-[#ffffffb3]"}`}
          style={pathname.startsWith("/portfolio") ? { fontWeight: 600, background: 'rgba(255, 186, 0, 0.15)' } : {}}>

          <span>{t('common.portfolio')}</span>
        </Link>

        <Link to="/markets" className={`h-full rounded-full oui-box oui-flex oui-flex-col oui-items-center oui-justify-center oui-flex-nowrap oui-flex-1 ${pathname.startsWith("/markets") ? "nav-active -translate-y-0.5 transition-all duration-200 ease-linear text-[#ffba00] bg-[rgba(255, 186, 0, 0.15)] before:-translate-y-0.5 before:transition-all before:duration-200 before:ease-linear before:dc-w-24 before:dc-h-[3.5px] before:dc-bg-[#ffba00] before:absolute before:-top-1 before:dc-rounded-b-[3px]" : "text-[#ffffffb3]"}`}
          style={pathname.startsWith("/markets") ? { fontWeight: 600, background: 'rgba(255, 186, 0, 0.15)' } : {}}>

          <span>{t('common.markets')}</span>
        </Link>

        <Link to="/demo_trading/BTCUSDT" className={`h-full rounded-full oui-box oui-flex oui-flex-col oui-items-center oui-justify-center oui-flex-nowrap oui-flex-1 ${pathname.startsWith("/demo_trading") ? "nav-active -translate-y-0.5 transition-all duration-200 ease-linear text-[#ffba00] bg-[rgba(255, 186, 0, 0.15)] before:-translate-y-0.5 before:transition-all before:duration-200 before:ease-linear before:dc-w-24 before:dc-h-[3.5px] before:dc-bg-[#ffba00] before:absolute before:-top-1 before:dc-rounded-b-[3px]" : "text-[#ffffffb3]"}`}
          style={pathname.startsWith("/demo_trading") ? { fontWeight: 600, background: 'rgba(255, 186, 0, 0.15)' } : {}}>

          <span>{t('common.demo')}</span>
        </Link>
      </div>
    </footer>
  );
} 