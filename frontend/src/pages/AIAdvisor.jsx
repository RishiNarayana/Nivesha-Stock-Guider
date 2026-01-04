import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, TrendingUp, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { cn } from '../utils/cn';
import { usePortfolioStore } from '../store/portfolioStore';

const AI_GATEWAY_URL = 'http://localhost:5000/api/ai';

export default function AIAdvisor() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, role: 'ai', content: 'Hello! I am Nivesha, your AI Advisor. I have access to your portfolio and live market data. How can I help you today?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const addHolding = usePortfolioStore(state => state.addHolding);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const parseTradeTag = (content) => {
        const match = content.match(/\[TRADE:\s+(BUY|SELL)\s+([A-Z]+)\s*(\d+)?\]/);
        if (match) {
            return {
                action: match[1],
                symbol: match[2],
                quantity: parseInt(match[3]) || 1
            };
        }
        return null;
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${AI_GATEWAY_URL}/chat`,
                { message: input },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const aiMsg = {
                id: Date.now() + 1,
                role: 'ai',
                content: response.data.reply
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'ai',
                content: "Error connecting to AI Gateway. Please ensure the Node service is running on port 5000."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const executeTrade = async (trade) => {
        try {
            const qty = trade.action === 'SELL' ? -trade.quantity : trade.quantity;
            await addHolding(trade.symbol, qty, 150); // Using 150 as mock price for demo update
            alert(`Successfully executed ${trade.action} for ${trade.quantity} shares of ${trade.symbol}`);
        } catch (err) {
            alert("Trade execution failed: " + err.message);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-card rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3 bg-slate-900/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <Bot className="text-white" size={24} />
                </div>
                <div>
                    <h2 className="font-bold text-white flex items-center gap-2">
                        Nivesha AI Advisor <Sparkles size={16} className="text-yellow-400" />
                    </h2>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/30">
                {messages.map((msg) => {
                    const trade = msg.role === 'ai' ? parseTradeTag(msg.content) : null;
                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-3 max-w-[80%]",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                msg.role === 'ai' ? "bg-indigo-600" : "bg-slate-600"
                            )}>
                                {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                            </div>
                            <div className="space-y-3">
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                                    msg.role === 'user'
                                        ? "bg-primary text-white rounded-tr-none"
                                        : "bg-slate-800 text-gray-200 rounded-tl-none border border-slate-700"
                                )}>
                                    {msg.content.replace(/\[TRADE:.*\]/, '')}
                                </div>
                                {trade && (
                                    <div className="bg-indigo-900/40 border border-indigo-500/50 p-4 rounded-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500 rounded-lg">
                                                <TrendingUp size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider">AI Suggestion</p>
                                                <p className="text-sm font-bold text-white">{trade.action} {trade.quantity} shares of {trade.symbol}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => executeTrade(trade)}
                                            className="px-6 py-2 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-all flex items-center gap-2"
                                        >
                                            <ShoppingCart size={16} /> Confirm Trade
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {isTyping && (
                    <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot size={16} />
                        </div>
                        <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex gap-1 items-center h-12">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-card border-t border-border">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Analyze my portfolio or ask about a stock..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-[60px]"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="absolute right-3 top-3 p-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
