import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PieChart, TrendingUp, Bot, LogOut, Menu, X, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { cn } from '../utils/cn';

export default function DashboardLayout() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: PieChart, label: 'Portfolio', path: '/portfolio' },
        { icon: TrendingUp, label: 'Market Analysis', path: '/stock/AAPL' }, // Default to AAPL for demo
        { icon: Bot, label: 'AI Advisor', path: '/ai-advisor' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
                    !isSidebarOpen && "-translate-x-full md:hidden"
                )}
            >
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Nivesha.ai
                    </h1>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                                location.pathname.startsWith(item.path)
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-gray-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-4 py-3 text-gray-400">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                            <User size={16} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-destructive transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden">
                {/* Mobile Header */}
                <div className="md:hidden p-4 border-b border-border flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(true)} className="text-white">
                        <Menu size={24} />
                    </button>
                    <span className="font-bold">Nivesha.ai</span>
                    <div className="w-6" /> {/* Spacer */}
                </div>

                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
