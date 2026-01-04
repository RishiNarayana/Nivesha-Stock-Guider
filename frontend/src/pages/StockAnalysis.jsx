import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Brain, ThumbsUp, ThumbsDown, AlertTriangle, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import axios from 'axios';

const AI_GATEWAY_URL = 'http://localhost:5000/api/ai';

export default function StockAnalysis() {
    const { symbol } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiAnalysis, setAiAnalysis] = useState(null);

    useEffect(() => {
        const fetchStockData = async () => {
            setLoading(true);
            try {
                // 1. Fetch AI Analysis (which includes ML data)
                const response = await axios.get(`${AI_GATEWAY_URL}/analyze/${symbol}`);
                setAiAnalysis(response.data);

                // 2. Format chart data (mocking price history for now as yfinance history is for chart)
                // In a real app, we'd fetch historical data from the Python service too.
                setData({
                    symbol: symbol,
                    price: response.data.ml_data?.current_price || 0,
                    change: 1.2, // Mock 
                    marketCap: "2.8T",
                    peRatio: "28.5",
                    volume: "55M",
                    dividendYield: "0.5",
                    history: [
                        { date: '21 Dec', value: 180 },
                        { date: '22 Dec', value: 185 },
                        { date: '23 Dec', value: response.data.ml_data?.current_price || 190 }
                    ]
                });
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (symbol) fetchStockData();
    }, [symbol]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-gray-400 font-medium">Nivesha AI is fetching real-time data...</p>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-card rounded-xl border border-border">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{symbol}</h1>
                    <p className="text-gray-400">Live Market Analysis</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                    <h2 className="text-4xl font-bold text-white">${data.price.toFixed(2)}</h2>
                    <div className={`text-lg font-medium flex items-center justify-end gap-2 text-green-500`}>
                        +{data.change}% <TrendingUp size={20} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border min-h-[400px]">
                    <h3 className="text-xl font-bold mb-4">Price Performance</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.history}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-xl border border-indigo-500/30 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Brain size={100} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="flex items-center gap-2 font-bold text-white mb-2">
                                <Brain className="text-indigo-400" /> AI Target
                            </h3>
                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-3xl font-black text-green-400">
                                    ${aiAnalysis?.ml_data?.prediction?.target_price?.toFixed(2) || '---'}
                                </span>
                                <span className="text-indigo-200 text-sm">Signal: {aiAnalysis?.ml_data?.prediction?.signal}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-xl border border-border">
                        <h3 className="font-bold text-gray-400 mb-4 uppercase text-sm tracking-wider">Market Context</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-800/50 rounded-lg">
                                <p className="text-xs text-gray-500">Market Cap</p>
                                <p className="font-bold text-white">{data.marketCap}</p>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-lg">
                                <p className="text-xs text-gray-500">P/E Ratio</p>
                                <p className="font-bold text-white">{data.peRatio}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gemini Analysis Section */}
            <div className="bg-card p-8 rounded-xl border border-border relative">
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="text-indigo-400" />
                    <h3 className="text-xl font-bold text-white">Gemini Financial Review</h3>
                </div>
                <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {aiAnalysis?.analysis.replace(/\[TRADE:.*\]/, '') || "AI Review loading..."}
                </div>
            </div>
        </div>
    );
}
