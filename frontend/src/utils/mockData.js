export const MOCK_PORTFOLIO_HISTORY = [
    { date: '2024-01', value: 100000 },
    { date: '2024-02', value: 105000 },
    { date: '2024-03', value: 103000 },
    { date: '2024-04', value: 112000 },
    { date: '2024-05', value: 118000 },
    { date: '2024-06', value: 125000 },
];

export const MOCK_HOLDINGS = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', qty: 50, avg: 2400, ltp: 2550, change: 1.5 },
    { symbol: 'TCS', name: 'Tata Consultancy Svcs', qty: 20, avg: 3400, ltp: 3600, change: 0.8 },
    { symbol: 'INFY', name: 'Infosys Ltd', qty: 100, avg: 1400, ltp: 1380, change: -1.2 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', qty: 200, avg: 1550, ltp: 1620, change: 2.1 },
];

export const MOCK_STOCK_DATA = {
    symbol: 'AAPL',
    price: 185.92,
    change: 1.25,
    marketCap: '2.8T',
    peRatio: 28.5,
    pbRatio: 12.1,
    dividendYield: 0.5,
    volume: '55M',
    pros: [
        "Strong brand loyalty and ecosystem lock-in.",
        "Consistent revenue growth from Services segment.",
        "High cash reserves and share buybacks."
    ],
    cons: [
        "High dependence on iPhone sales.",
        "Regulatory scrutiny in EU and US.",
        "China market slowdown risks."
    ],
    aiSignal: "BUY",
    aiConfidence: 87
};
