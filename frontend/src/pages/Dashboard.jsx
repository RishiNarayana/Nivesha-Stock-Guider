import { useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ArrowUpRight, ArrowDownRight, IndianRupee, Activity, TrendingUp, Loader2 } from 'lucide-react';
import { usePortfolioStore } from '../store/portfolioStore';

const MOCK_HISTORY = [
    { date: '18 Dec', value: 4500 },
    { date: '19 Dec', value: 4800 },
    { date: '20 Dec', value: 5100 },
    { date: '21 Dec', value: 4900 },
    { date: '22 Dec', value: 5300 },
    { date: '23 Dec', value: 5600 },
    { date: '24 Dec', value: 6000 },
];

export default function Dashboard() {
    const { portfolio, fetchPortfolio, loading } = usePortfolioStore();

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const holdings = portfolio?.holdings || [];

    // Aggregates
    const totalInvestment = holdings.reduce((acc, stock) => acc + (stock.quantity * stock.averagePrice), 0);
    const totalValue = holdings.reduce((acc, stock) => acc + (stock.quantity * (stock.currentPrice || stock.averagePrice)), 0);
    const totalPnL = totalValue - totalInvestment;
    const pnlPercent = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

    // Use current portfolio value for the last point of history if mock
    // In real prod, fetch portfolio history snapshot
    const chartData = [...MOCK_HISTORY];
    if (chartData.length > 0) {
        chartData[chartData.length - 1].value = totalValue > 0 ? totalValue : 6000;
    }

    if (loading && !portfolio) return (
        <div className="flex items-center justify-center h-96">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Value Card */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Total Portfolio Value</h3>
                        <IndianRupee className="bg-primary/20 text-primary p-1.5 rounded-lg w-8 h-8" />
                    </div>
                    <p className="text-3xl font-bold text-white">${totalValue.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-green-500 flex items-center">
                            <ArrowUpRight size={16} />
                            2.4%
                        </span>
                        <span className="text-gray-500 text-sm">vs yesterday</span>
                    </div>
                </div>

                {/* Total P&L Card */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">Total Returns</h3>
                        <TrendingUp className="bg-secondary/20 text-secondary p-1.5 rounded-lg w-8 h-8" />
                    </div>
                    <p className={`text-3xl font-bold text-green-500`}>
                        +${totalPnL.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">AI-driven profit growth</p>
                </div>

                {/* Market Status Card */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 font-medium">AI Market Sentiment</h3>
                        <Activity className="bg-accent/20 text-accent p-1.5 rounded-lg w-8 h-8" />
                    </div>
                    <p className="text-3xl font-bold text-white">Bullish</p>
                    <p className="text-secondary text-sm mt-2">Gemini targets 5% growth in Tech</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-bold mb-6">Portfolio Growth (AI Analysis)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_HISTORY}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Holdings */}
                <div className="bg-card p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-bold mb-6">Top Assets</h3>
                    <div className="space-y-4">
                        {holdings.slice(0, 4).map((stock) => (
                            <div key={stock.symbol} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                <div>
                                    <h4 className="font-bold text-white">{stock.symbol}</h4>
                                    <p className="text-sm text-gray-400">{stock.quantity} shares</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white">${(stock.quantity * stock.averagePrice).toLocaleString()}</p>
                                    <p className="text-sm text-green-500">Active</p>
                                </div>
                            </div>
                        ))}
                        {holdings.length === 0 && <p className="text-gray-500 text-center py-8">No assets to display.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
