import { useEffect } from 'react';

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
        const originalFetch = window.fetch;

        // Get allowed tokens from environment variable
        const allowedTokens = import.meta.env.VITE_ALLOWED_TOKENS?.split(',').map(token => token.trim()) || [];

        window.fetch = async function (url, options) {
            const response = await originalFetch.call(this, url, options);

            // Check if this is the futures API call
            if (typeof url === 'string' && url.includes('/v1/public/futures')) {
                try {
                    const data = await response.clone().json();

                    // Filter the data if allowedTokens is configured
                    if (allowedTokens.length > 0 && allowedTokens[0] !== '' && data.data?.rows) {

                        const filteredRows = data.data.rows.filter(pair => {
                            const symbol = pair.symbol;

                            // Extract token name (e.g., "PERP_BTC_USDC" -> "BTC")
                            const tokenPart = symbol.replace('PERP_', '').replace('_USDC', '').replace('_USDT', '');

                            // Check if token is in allowed list
                            const isAllowed = allowedTokens.includes(tokenPart);

                            if (isAllowed) {
                                console.log(`✅ Allowing token pair: ${symbol}`);
                            }

                            return isAllowed;
                        });

                        console.log(`🎯 Filtered futures data: ${data.data.rows.length} -> ${filteredRows.length} pairs`);

                        // Create new response with filtered data
                        const filteredResponse = {
                            ...data,
                            data: {
                                ...data.data,
                                rows: filteredRows
                            }
                        };

                        return new Response(JSON.stringify(filteredResponse), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                    }

                    return response;
                } catch (error) {
                    console.error('Error filtering futures data:', error);
                    return response;
                }
            }

            // Check if this is the token API call
            if (typeof url === 'string' && url.includes('/v1/public/token')) {
                try {
                    const data = await response.clone().json();

                    if (data.success && data.data?.rows) {

                        // Process each token's chain_details to reorder chains
                        const reorderedRows = data.data.rows.map(tokenRow => {
                            if (tokenRow.chain_details && Array.isArray(tokenRow.chain_details)) {
                                const originalChainDetails = [...tokenRow.chain_details];

                                // Separate priority chains and others
                                const priorityChains = [];
                                const otherChains = [];

                                // First, collect priority chains in the desired order
                                desiredChainOrder.forEach(chainId => {
                                    const chainDetail = originalChainDetails.find(chain =>
                                        parseInt(chain.chain_id) === chainId
                                    );
                                    if (chainDetail) {
                                        priorityChains.push(chainDetail);
                                    }
                                });

                                // Then collect all other chains
                                originalChainDetails.forEach(chainDetail => {
                                    const chainId = parseInt(chainDetail.chain_id);
                                    if (!desiredChainOrder.includes(chainId)) {
                                        otherChains.push(chainDetail);
                                    }
                                });

                                // Combine priority chains first, then others
                                const reorderedChainDetails = [...priorityChains, ...otherChains];

                                return {
                                    ...tokenRow,
                                    chain_details: reorderedChainDetails
                                };
                            }
                            return tokenRow;
                        });

                        // Create new response with reordered data
                        const reorderedResponse = {
                            ...data,
                            data: {
                                ...data.data,
                                rows: reorderedRows
                            }
                        };

                        return new Response(JSON.stringify(reorderedResponse), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                    }

                    return response;
                } catch (error) {
                    console.error('Error reordering token data:', error);
                    return response;
                }
            }

            return response;
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);
};