import {
  ReactNode,
  useCallback,
  lazy,
  Suspense,
  useState,
  useEffect,
} from "react";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import { useOrderlyConfig } from "@/utils/config";
import type { NetworkId } from "@orderly.network/types";
import {
  LocaleProvider,
  Resources,
  defaultLanguages,
} from "@orderly.network/i18n";
import { useLocation } from "@remix-run/react";
import { useNav } from "@/hooks/useNav";
import { useIpRestriction } from "@/api/useIpRestriction";


const NETWORK_ID_KEY = "orderly_network_id";

const getNetworkId = (): NetworkId => {
  if (typeof window === "undefined") return "mainnet";

  const disableMainnet = import.meta.env.VITE_DISABLE_MAINNET === "true";
  const disableTestnet = import.meta.env.VITE_DISABLE_TESTNET === "true";

  if (disableMainnet && !disableTestnet) {
    return "testnet";
  }

  if (disableTestnet && !disableMainnet) {
    return "mainnet";
  }

  return (localStorage.getItem(NETWORK_ID_KEY) as NetworkId) || "mainnet";
};

const setNetworkId = (networkId: NetworkId) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(NETWORK_ID_KEY, networkId);
  }
};

const WalletConnector = lazy(
  () => import("@/components/orderlyProvider/walletConnector")
);
const ServiceRestrictionsDialog = lazy(
  () => import("@/components/orderlyProvider/ServiceRestrictionsDialog")
);

const LocaleProviderWithLanguages = lazy(async () => {
  const languageCodes = import.meta.env.VITE_AVAILABLE_LANGUAGES?.split(
    ","
  ) || ["en"];

  const languagePromises = languageCodes.map(async (code: string) => {
    const trimmedCode = code.trim();
    try {
      // Load main language file
      const mainResponse = await fetch(
        `${import.meta.env.VITE_BASE_URL ?? ""}/locales/${trimmedCode}.json?v=8e823e23`
      );
      if (!mainResponse.ok) {
        throw new Error(
          `Failed to fetch ${trimmedCode}.json: ${mainResponse.status}`
        );
      }
      const mainData = await mainResponse.json();

      // Load extended language file
      let extendedData = {};
      try {
        const extendedResponse = await fetch(
          `${import.meta.env.VITE_BASE_URL ?? ""
          }/locales/extend/${trimmedCode}.json?v=8e823e23`
        );
        if (extendedResponse.ok) {
          extendedData = await extendedResponse.json();
        }
      } catch (extendedError) {
        console.warn(
          `Extended language file not found for ${trimmedCode}`,
          extendedError
        );
      }

      // Merge main data with extended data (extended data takes precedence)
      const mergedData = { ...mainData, ...extendedData };

      return { code: trimmedCode, data: mergedData };
    } catch (error) {
      console.error(`Failed to load language: ${trimmedCode}`, error);
      return null;
    }
  });

  const results = await Promise.all(languagePromises);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resources: Resources<any> = {};
  results.forEach((result) => {
    if (result) {
      resources[result.code] = result.data;
    }
  });

  const languages = defaultLanguages.filter((lang) =>
    languageCodes.some((code: string) => code.trim() === lang.localCode)
  );

  return {
    default: ({ children }: { children: ReactNode }) => (
      <LocaleProvider resources={resources} languages={languages}>
        {children}
      </LocaleProvider>
    ),
  };
});

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <style>
      {`
				.loading-container {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
					height: 100vh;
					background-color: rgba(0, 0, 0, 0.03);
				}
				.loading-spinner {
					width: 50px;
					height: 50px;
					border: 4px solid rgba(0, 0, 0, 0.1);
					border-radius: 50%;
					border-left-color: #09f;
					animation: spin 1s linear infinite;
				}
				@keyframes spin {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}
			`}
    </style>
  </div>
);

const OrderlyProvider = (props: { children: ReactNode }) => {
  // All hooks at the top
  const config = useOrderlyConfig();
  const networkId = getNetworkId();
  const [isClient, setIsClient] = useState(false);
  const location = useLocation();
  const { isRestricted } = useIpRestriction();

  // Enhanced ActiveNavigation logic with better DOM checking
  useEffect(() => {
    const updateActiveNav = () => {
      const path = location.pathname;
      const navItems = document.querySelectorAll("footer>div>div");

      // If nav items aren't ready yet, try again later
      if (navItems.length === 0) {
        setTimeout(updateActiveNav, 200);
        return;
      }

      // Remove active class from all items
      navItems.forEach((item) => item.classList.remove("nav-active"));

      // Add active class based on current path
      if (path.includes("/perp") || path.includes("/trading")) {
        navItems[0]?.classList.add("nav-active"); // Trading
      } else if (path.includes("/portfolio")) {
        navItems[1]?.classList.add("nav-active"); // Portfolio
      } else if (path.includes("/markets")) {
        navItems[2]?.classList.add("nav-active"); // Markets
      } else if (path.includes("/demo_trading")) {
        navItems[3]?.classList.add("nav-active"); // Demo
      }
    };

    // Run immediately if client is ready
    if (isClient) {
      updateActiveNav();
    }

    // Also run with delay to catch late-rendered elements
    const timer = setTimeout(updateActiveNav, 500);

    // Set up a MutationObserver to detect when the footer is added to DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Element node
            const element = node as Element;
            if (
              element.tagName === "FOOTER" ||
              element.querySelector("footer")
            ) {
              updateActiveNav();
            }
          }
        });
      });
    });

    // Start observing
    if (typeof document !== "undefined") {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [location.pathname, isClient]);

  const parseChainIds = (
    envVar: string | undefined
  ): Array<{ id: number }> | undefined => {
    if (!envVar) return undefined;
    return envVar
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id)
      .map((id) => ({ id: parseInt(id, 10) }))
      .filter((chain) => !isNaN(chain.id));
  };

  const disableMainnet = import.meta.env.VITE_DISABLE_MAINNET === "true";
  const mainnetChains = disableMainnet
    ? []
    : parseChainIds(import.meta.env.VITE_ORDERLY_MAINNET_CHAINS);
  const disableTestnet = import.meta.env.VITE_DISABLE_TESTNET === "true";
  const testnetChains = disableTestnet
    ? []
    : parseChainIds(import.meta.env.VITE_ORDERLY_TESTNET_CHAINS);

  const chainFilter =
    mainnetChains || testnetChains
      ? {
        ...(mainnetChains && { mainnet: mainnetChains }),
        ...(testnetChains && { testnet: testnetChains }),
      }
      : undefined;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onChainChanged = useCallback(
    (_chainId: number, { isTestnet }: { isTestnet: boolean }) => {
      const currentNetworkId = getNetworkId();
      if (
        (isTestnet && currentNetworkId === "mainnet") ||
        (!isTestnet && currentNetworkId === "testnet")
      ) {
        const newNetworkId: NetworkId = isTestnet ? "testnet" : "mainnet";
        setNetworkId(newNetworkId);

        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    },
    []
  );

  const { onRouteChange } = useNav();

  const appProvider = (
    <OrderlyAppProvider
      brokerId={import.meta.env.VITE_ORDERLY_BROKER_ID}
      brokerName={import.meta.env.VITE_ORDERLY_BROKER_NAME}
      networkId={networkId}
      onChainChanged={onChainChanged}
      appIcons={config.orderlyAppProvider.appIcons}
      orderbookDefaultTickSizes={{
        PERP_BTC_USDC: "10",
        PERP_ETH_USDC: "0.1",
        PERP_SOL_USDC: "0.01",
      }}
      notification={{
        orderFilled: {
          media: '/Coin.mp3',
          defaultOpen: true,
          displayInOrderEntry: true
        },
      }}
      onRouteChange={(option) => {
        onRouteChange(option as any);
      }}
      dataAdapter={{
        symbolList: (original) => {
          // Get allowed tokens from environment variable
          const allowedTokensEnv = import.meta.env.VITE_ALLOWED_TOKENS;
          const allowedTokens = allowedTokensEnv?.split(',').map((token: string) => token.trim()).filter(Boolean) || [];

          // If no tokens specified, return all symbols
          if (allowedTokens.length === 0) {
            return original;
          }

          console.log("allowedTokens", allowedTokens);

          // Filter symbols based on allowed tokens
          return original.filter((item) => {
            const symbol = item.symbol;
            // Extract token name (e.g., "PERP_BTC_USDC" -> "BTC")
            const tokenPart = symbol.replace('PERP_', '').replace(/_USD[CT]$/, '');
            return allowedTokens.includes(tokenPart);
          });
        },
      }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(chainFilter && ({ chainFilter } as any))}
      defaultChain={{
        mainnet: { id: 56 },
      }}
    >
      <ServiceRestrictionsDialog />
      {props.children}
    </OrderlyAppProvider>
  );

  // Only render info text if restricted
  if (isRestricted) {
    return (
      <>
        <ServiceRestrictionsDialog />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#101014', color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>
          Service not available in your region.
        </div>
      </>
    );
  }

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LocaleProviderWithLanguages>
        <WalletConnector networkId={networkId}>{appProvider}</WalletConnector>
      </LocaleProviderWithLanguages>
    </Suspense>
  );
};

export default OrderlyProvider;
