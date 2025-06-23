import { ReactNode, useCallback, lazy, Suspense, useState, useEffect, useRef } from "react";
import { OrderlyAppProvider } from "@orderly.network/react-app";
import { useOrderlyConfig } from "@/utils/config";
import type { NetworkId } from "@orderly.network/types";
import { LocaleProvider, Resources, defaultLanguages, useTranslation } from "@orderly.network/i18n";

const NETWORK_ID_KEY = "orderly_network_id";

const getNetworkId = (): NetworkId => {
	if (typeof window === "undefined") return "mainnet";

	const disableMainnet = import.meta.env.VITE_DISABLE_MAINNET === 'true';
	const disableTestnet = import.meta.env.VITE_DISABLE_TESTNET === 'true';

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

const PrivyConnector = lazy(() => import("@/components/orderlyProvider/privyConnector"));
const WalletConnector = lazy(() => import("@/components/orderlyProvider/walletConnector"));

const LocaleProviderWithLanguages = lazy(async () => {
	const languageCodes = import.meta.env.VITE_AVAILABLE_LANGUAGES?.split(',') || ['en'];

	const languagePromises = languageCodes.map(async (code: string) => {
		const trimmedCode = code.trim();
		try {
			const response = await fetch(`${import.meta.env.VITE_BASE_URL ?? ''}/locales/${trimmedCode}.json`);
			if (!response.ok) {
				throw new Error(`Failed to fetch ${trimmedCode}.json: ${response.status}`);
			}
			const data = await response.json();
			return { code: trimmedCode, data };
		} catch (error) {
			console.error(`Failed to load language: ${trimmedCode}`, error);
			return null;
		}
	});

	const results = await Promise.all(languagePromises);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const resources: Resources<any> = {};
	results.forEach(result => {
		if (result) {
			resources[result.code] = result.data;
		}
	});

	const languages = defaultLanguages.filter(lang =>
		languageCodes.some((code: string) => code.trim() === lang.localCode)
	);

	return {
		default: ({ children }: { children: ReactNode }) => (
			<LocaleProvider
				resources={resources}
				languages={languages}
			>
				{children}
			</LocaleProvider>
		)
	};
});

const LanguageSwitcher = () => {
	const { i18n } = useTranslation();
	const dragging = useRef(false);
	const hasDragged = useRef(false);
	const offset = useRef({ x: 0, y: 0 });
	const [isClient, setIsClient] = useState(false);

	const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setBubblePos({
				x: window.innerWidth - 90,
				y: window.innerHeight - 110,
			});
			setIsClient(true);

			const handleResize = () => {
				if (!dragging.current) {
					setBubblePos({
						x: window.innerWidth - 90,
						y: window.innerHeight - 110,
					});
				}
			};

			window.addEventListener("resize", handleResize);
			return () => window.removeEventListener("resize", handleResize);
		}
	}, []);

	if (!isClient) {
		return null;
	}

	const toggleLanguage = () => {
		const currentLang = i18n.language;
		const nextLang = currentLang === "en" ? "ko" : "en";
		i18n.changeLanguage(nextLang);
	};

	const onMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
		dragging.current = true;
		hasDragged.current = false;
		offset.current = {
			x: e.clientX - bubblePos.x,
			y: e.clientY - bubblePos.y,
		};
		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!dragging.current) return;
		hasDragged.current = true;
		setBubblePos({
			x: e.clientX - offset.current.x,
			y: Math.max(0, e.clientY - offset.current.y),
		});
	};

	const onMouseUp = () => {
		dragging.current = false;
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	};

	const onTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
		dragging.current = true;
		hasDragged.current = false;
		const touch = e.touches[0];
		offset.current = {
			x: touch.clientX - bubblePos.x,
			y: touch.clientY - bubblePos.y,
		};
		document.addEventListener("touchmove", onTouchMove);
		document.addEventListener("touchend", onTouchEnd);
	};

	const onTouchMove = (e: TouchEvent) => {
		if (!dragging.current) return;
		hasDragged.current = true;
		const touch = e.touches[0];
		setBubblePos({
			x: touch.clientX - offset.current.x,
			y: Math.max(0, touch.clientY - offset.current.y),
		});
	};

	const onTouchEnd = () => {
		dragging.current = false;
		document.removeEventListener("touchmove", onTouchMove);
		document.removeEventListener("touchend", onTouchEnd);
	};

	const handleClick = () => {
		if (!hasDragged.current) {
			toggleLanguage();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleLanguage();
		}
	};

	return (
		<button
			id="changeLocaleButtonDiv"
			style={{
				position: "fixed",
				top: bubblePos.y,
				left: bubblePos.x,
				transform: "translate(-50%, 0)",
				zIndex: 1000,
				background: "rgb(253 180 29)",
				borderRadius: "999px",
				boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
				padding: "8px 20px",
				cursor: "grab",
				fontWeight: 500,
				fontSize: "15px",
				transition: "background 0.2s",
				border: "1px solid rgb(213, 191, 65)",
				minWidth: "80px",
				textAlign: "center",
				userSelect: "none",
				color: "black"
			}}
			onClick={handleClick}
			onMouseDown={onMouseDown}
			onTouchStart={onTouchStart}
			onKeyDown={handleKeyDown}
			title="Switch Language"
			tabIndex={0}
		>
			{i18n.language === "en" ? "한국어" : "English"}
		</button>
	);
};

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

const DynamicSEO = () => {
	const { i18n } = useTranslation();

	useEffect(() => {
		const isKorean = i18n.language === "ko";
		
		document.title = isKorean 
			? "DeFi: DEX 거래소 아덴"
			: "ADEN - DeFi Crypto Futures Trading Platform";

		const descriptionMeta = document.querySelector('meta[name="description"]');
		if (descriptionMeta) {
			descriptionMeta.setAttribute('content', isKorean
				? "아덴 거래소(ADEN): 탈중앙화 거래소(DEX)에서 암호화폐 선물거래를 경험하세요. 아덴, 거래소, 덱스 거래소, DeFi, 암호화폐, 선물거래"
				: "Aden Exchange (ADEN): Experience DeFi crypto futures trading on a decentralized exchange (DEX). Aden, Exchange, DEX Exchange, DeFi, Crypto, Futures Trading"
			);
		}

		const keywordsMeta = document.querySelector('meta[name="keywords"]');
		if (keywordsMeta) {
			keywordsMeta.setAttribute('content', isKorean
				? "아덴 거래소, 아덴, 탈중앙화 거래소, 거래소, 덱스 거래소, DEX, DeFi, 암호화폐, 선물거래"
				: "Aden Exchange, Aden, Decentralized Exchange, Exchange, DEX Exchange, DEX, DeFi, Crypto, Futures Trading"
			);
		}

		const ogTitleMeta = document.querySelector('meta[property="og:title"]');
		if (ogTitleMeta) {
			ogTitleMeta.setAttribute('content', isKorean
				? "DeFi: DEX 거래소 아덴"
				: "ADEN - DeFi Crypto Futures Trading Platform"
			);
		}

		const ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
		if (ogDescriptionMeta) {
			ogDescriptionMeta.setAttribute('content', isKorean
				? "아덴 거래소(ADEN): 탈중앙화 거래소(DEX)에서 암호화폐 선물거래를 경험하세요."
				: "Aden Exchange (ADEN): Experience DeFi crypto futures trading on a decentralized exchange (DEX)."
			);
		}

		document.documentElement.lang = isKorean ? "ko" : "en";
	}, [i18n.language]);

	return null;
};

const OrderlyProvider = (props: { children: ReactNode }) => {
	const config = useOrderlyConfig();
	const networkId = getNetworkId();
	const [isClient, setIsClient] = useState(false);

	const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;
	const usePrivy = !!privyAppId;

	const parseChainIds = (envVar: string | undefined): Array<{ id: number }> | undefined => {
		if (!envVar) return undefined;
		return envVar.split(',')
			.map(id => id.trim())
			.filter(id => id)
			.map(id => ({ id: parseInt(id, 10) }))
			.filter(chain => !isNaN(chain.id));
	};

	const disableMainnet = import.meta.env.VITE_DISABLE_MAINNET === 'true';
	const mainnetChains = disableMainnet ? [] : parseChainIds(import.meta.env.VITE_ORDERLY_MAINNET_CHAINS);
	const disableTestnet = import.meta.env.VITE_DISABLE_TESTNET === 'true';
	const testnetChains = disableTestnet ? [] : parseChainIds(import.meta.env.VITE_ORDERLY_TESTNET_CHAINS);

	const chainFilter = (mainnetChains || testnetChains) ? {
		...(mainnetChains && { mainnet: mainnetChains }),
		...(testnetChains && { testnet: testnetChains })
	} : undefined;

	useEffect(() => {
		setIsClient(true);
	}, []);

	const onChainChanged = useCallback(
		(_chainId: number, { isTestnet }: { isTestnet: boolean }) => {
			const currentNetworkId = getNetworkId();
			if ((isTestnet && currentNetworkId === 'mainnet') || (!isTestnet && currentNetworkId === 'testnet')) {
				const newNetworkId: NetworkId = isTestnet ? 'testnet' : 'mainnet';
				setNetworkId(newNetworkId);

				setTimeout(() => {
					window.location.reload();
				}, 100);
			}
		},
		[]
	);

	const appProvider = (
		<OrderlyAppProvider
			brokerId={import.meta.env.VITE_ORDERLY_BROKER_ID}
			brokerName={import.meta.env.VITE_ORDERLY_BROKER_NAME}
			networkId={networkId}
			onChainChanged={onChainChanged}
			appIcons={config.orderlyAppProvider.appIcons}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			{...(chainFilter && { chainFilter } as any)}
			defaultChain={{
				mainnet: { id: 34443 }
			}}
		>
			{props.children}
		</OrderlyAppProvider>
	);

	if (!isClient) {
		return <LoadingSpinner />;
	}

	const walletConnector = usePrivy
		? <PrivyConnector networkId={networkId}>{appProvider}</PrivyConnector>
		: <WalletConnector networkId={networkId}>{appProvider}</WalletConnector>;

	return (
		<Suspense fallback={<LoadingSpinner />}>
			<LocaleProviderWithLanguages>
				<LanguageSwitcher />
				<DynamicSEO />
				{walletConnector}
			</LocaleProviderWithLanguages>
		</Suspense>
	);
};

export default OrderlyProvider;
