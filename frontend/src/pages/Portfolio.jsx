import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { usePortfolioStore } from '../store/portfolioStore';
import { cn } from '../utils/cn';

export default function Portfolio() {
    const { portfolio, fetchPortfolio, loading, addHolding } = usePortfolioStore();
    const [isAddOpen, setAddOpen] = useState(false);
    const [formData, setFormData] = useState({ symbol: '', quantity: '', price: '' });

    const handleAdd = async (e) => {
        e.preventDefault();
        if (formData.symbol && formData.quantity && formData.price) {
            await addHolding(formData.symbol, Number(formData.quantity), Number(formData.price));
            setAddOpen(false);
            setFormData({ symbol: '', quantity: '', price: '' });
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const holdings = portfolio?.holdings || [];

    if (loading && !portfolio) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-gray-400">Loading your assets...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Holdings</h2>
                <button
                    onClick={() => setAddOpen(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                    <Plus size={18} />
                    Add Stock
                </button>
            </div>

            {isAddOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card p-6 rounded-xl border border-gray-800 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add Asset</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Symbol</label>
                                <input
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white uppercase"
                                    value={formData.symbol}
                                    onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                                    placeholder="AAPL"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                        value={formData.quantity}
                                        onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                        placeholder="10"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Avg Price</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="150"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setAddOpen(false)} className="text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">Add to Portfolio</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-border bg-slate-900/50">
                                <th className="p-4 font-medium text-gray-400">Stock</th>
                                <th className="p-4 font-medium text-gray-400 text-right">Qty</th>
                                <th className="p-4 font-medium text-gray-400 text-right">Avg Price</th>
                                <th className="p-4 font-medium text-gray-400 text-right">Value</th>
                                <th className="p-4 font-medium text-gray-400 text-right">Allocation</th>
                                <th className="p-4 font-medium text-gray-400 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No holdings found. Start by asking Gemini or adding a stock!
                                    </td>
                                </tr>
                            ) : holdings.map((stock) => {
                                const curValue = stock.quantity * stock.averagePrice;
                                return (
                                    <tr key={stock.symbol} className="border-b border-border hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white">{stock.symbol}</div>
                                        </td>
                                        <td className="p-4 text-right font-medium">{stock.quantity}</td>
                                        <td className="p-4 text-right text-gray-400">${stock.averagePrice.toFixed(2)}</td>
                                        <td className="p-4 text-right font-bold text-white">${curValue.toLocaleString()}</td>
                                        <td className="p-4 text-right">
                                            <div className="text-xs bg-slate-800 px-2 py-1 rounded inline-block">Active Asset</div>
                                        </td>
                                        <td className="p-4 flex justify-center gap-2">
                                            <button className="p-2 hover:bg-slate-700 rounded-full text-gray-400 hover:text-white transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-slate-700 rounded-full text-gray-400 hover:text-destructive transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
