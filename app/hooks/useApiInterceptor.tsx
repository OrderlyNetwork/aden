import { useEffect } from 'react';

// TypeScript interfaces for better type safety
interface FuturesPair {
    symbol: string;
    [key: string]: any;
}

interface ChainDetail {
    chain_id: string;
    [key: string]: any;
}

interface TokenRow {
    chain_details?: ChainDetail[];
    [key: string]: any;
}

interface ApiResponseData {
    rows: FuturesPair[] | TokenRow[];
    [key: string]: any;
}

interface ApiResponse {
    success?: boolean;
    data?: ApiResponseData;
    [key: string]: any;
}

// Chain ID to name mapping
const chainIdToName = {
    56: 'BNB Smart Chain',
    1: 'Ethereum',
    900900900: 'Solana',
    42161: 'Arbitrum',
    8453: 'Base',
    10: 'Optimism',
    1329: 'Sei Network',
    137: 'Polygon',
    146: 'Sonic',
    1514: 'Story',
    2741: 'Kinto',
    2818: 'Morph',
    34443: 'Mode',
    43114: 'Avalanche',
    5000: 'Mantle',
    80094: 'Berachain',
    98866: 'Plume'
};

// Desired chain order
const desiredChainOrder = [
    56,        // BNB Smart Chain
    1,         // Ethereum
    900900900, // Solana
    42161,     // Arbitrum
    8453,      // Base
    // All others will follow in their original order
];

export const useApiInterceptor = () => {
    useEffect(() => {
        // Early return if we're on the server side
        if (typeof window === 'undefined') return;

        const originalFetch = window.fetch;

        // Cache allowed tokens to avoid re-parsing on every request
        const allowedTokensEnv = import.meta.env.VITE_ALLOWED_TOKENS;
        const allowedTokens = allowedTokensEnv?.split(',').map((token: string) => token.trim()).filter(Boolean) || [];
        const hasTokenFilter = allowedTokens.length > 0;

        // Only intercept if there's actually something to do
        if (!hasTokenFilter) {
            console.log('🔧 API Interceptor: No token filtering needed, skipping fetch override');
            return;
        }

        console.log('🔧 API Interceptor: Setting up with allowed tokens:', allowedTokens);

        // Create a more efficient interceptor
        window.fetch = async function (url, options) {
            const response = await originalFetch.call(this, url, options);

            // Quick exit for non-matching URLs
            if (typeof url !== 'string') return response;

            const isFuturesAPI = url.includes('/v1/public/futures');
            const isTokenAPI = url.includes('/v1/public/token');

            if (!isFuturesAPI && !isTokenAPI) return response;

            try {
                // Only clone if we need to process the response
                const data = await response.clone().json() as ApiResponse;

                if (isFuturesAPI && hasTokenFilter && data.data?.rows) {
                    const originalLength = data.data.rows.length;

                    const filteredRows = (data.data.rows as FuturesPair[]).filter((pair: FuturesPair) => {
                        const symbol = pair.symbol;
                        // Extract token name (e.g., "PERP_BTC_USDC" -> "BTC")
                        const tokenPart = symbol.replace('PERP_', '').replace(/_USD[CT]$/, '');
                        return allowedTokens.includes(tokenPart);
                    });

                    if (filteredRows.length !== originalLength) {
                        return new Response(JSON.stringify({
                            ...data,
                            data: {
                                ...data.data,
                                rows: filteredRows
                            }
                        }), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                    }
                }

                if (isTokenAPI && data.success && data.data?.rows) {
                    // Process chain reordering
                    const reorderedRows = (data.data.rows as TokenRow[]).map((tokenRow: TokenRow) => {
                        if (!tokenRow.chain_details || !Array.isArray(tokenRow.chain_details)) {
                            return tokenRow;
                        }

                        const chainDetailsMap = new Map<number, ChainDetail>();
                        tokenRow.chain_details.forEach((detail: ChainDetail) => {
                            chainDetailsMap.set(parseInt(detail.chain_id), detail);
                        });

                        // Build reordered array efficiently
                        const reorderedChainDetails: ChainDetail[] = [];

                        // Add priority chains first
                        desiredChainOrder.forEach(chainId => {
                            const detail = chainDetailsMap.get(chainId);
                            if (detail) {
                                reorderedChainDetails.push(detail);
                                chainDetailsMap.delete(chainId);
                            }
                        });

                        // Add remaining chains
                        chainDetailsMap.forEach(detail => {
                            reorderedChainDetails.push(detail);
                        });

                        return {
                            ...tokenRow,
                            chain_details: reorderedChainDetails
                        };
                    });

                    return new Response(JSON.stringify({
                        ...data,
                        data: {
                            ...data.data,
                            rows: reorderedRows
                        }
                    }), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }

                return response;
            } catch (error) {
                console.error('Error in API interceptor:', error);
                return response;
            }
        };

        return () => {
            // Restore original fetch on cleanup
            if (window.fetch !== originalFetch) {
                window.fetch = originalFetch;
                console.log('🔧 API Interceptor: Cleaned up fetch override');
            }
        };
    }, []); // Empty dependency array is fine since we're using env vars that don't change at runtime
};