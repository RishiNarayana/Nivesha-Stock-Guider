import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/portfolio';

export const usePortfolioStore = create((set, get) => ({
    portfolio: null,
    loading: false,
    error: null,

    fetchPortfolio: async () => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const portfolio = response.data;
            const updatedHoldings = [];

            // Fetch live prices for each holding
            if (portfolio.holdings && portfolio.holdings.length > 0) {
                // Use Promise.all for parallel fetching
                const pricePromises = portfolio.holdings.map(async (holding) => {
                    try {
                        const priceRes = await axios.get(`${import.meta.env.VITE_AI_GATEWAY_URL}/price/${holding.symbol}`);
                        return { ...holding, currentPrice: priceRes.data.current_price, prediction: priceRes.data.prediction };
                    } catch (err) {
                        console.error(`Failed to fetch price for ${holding.symbol}`, err);
                        return { ...holding, currentPrice: holding.averagePrice }; // Fallback
                    }
                });

                const results = await Promise.all(pricePromises);
                updatedHoldings.push(...results);
            }

            const finalPortfolio = { ...portfolio, holdings: updatedHoldings };

            set({ portfolio: finalPortfolio, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    addHolding: async (symbol, quantity, price) => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/add`, {
                symbol,
                quantity,
                avgPrice: price,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await get().fetchPortfolio(); // Refresh
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    }
}));
