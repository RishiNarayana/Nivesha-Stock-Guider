import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <nav className="border-b border-border p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Nivesha.ai</h1>
                <div className="space-x-4">
                    <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Login</Link>
                    <Link to="/register" className="px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-full transition-all">Get Started</Link>
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
                <div className="space-y-6 mb-16">
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                        Invest Smarter with <br />
                        <span className="text-primary">AI-Powered Insights</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Stop guessing. Start investing with precision using Nivesha's advanced ML algorithms and real-time market analysis.
                    </p>
                    <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-gray-200 transition-all">Start Investing Now</Link>
                        <Link to="/login" className="px-8 py-4 border border-border text-white font-bold rounded-lg hover:bg-slate-800 transition-all">View Demo</Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 w-full">
                    {[
                        { icon: TrendingUp, title: "Predictive Analytics", desc: "LSTM & ARIMA models predict future stock trends with high accuracy." },
                        { icon: Zap, title: "Real-time Signals", desc: "Get instant Buy/Sell/Hold signals based on technical indicators." },
                        { icon: ShieldCheck, title: "Risk Management", desc: "Analyze portfolio risk and get AI-driven optimization tips." }
                    ].map((feature, i) => (
                        <div key={i} className="bg-card p-6 rounded-xl border border-border">
                            <feature.icon className="w-12 h-12 text-primary mb-4 mx-auto" />
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="border-t border-border p-8 text-center text-gray-500 mt-20">
                © 2025 Nivesha.ai. Built for the Future of Finance.
            </footer>
        </div>
    );
}
