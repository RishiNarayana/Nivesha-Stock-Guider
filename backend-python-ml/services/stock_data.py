import yfinance as yf
from alpha_vantage.timeseries import TimeSeries
import pandas as pd
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_stock_data(symbol: str):
    """
    Fetch stock data with fallback logic.
    1. Try yfinance
    2. Fallback to Alpha Vantage
    """
    
    # 1. Try Alpha Vantage (PROD Source)
    try:
        logger.info(f"Primary: Fetching {symbol} from Alpha Vantage...")
        key = os.getenv("ALPHA_VANTAGE_KEY")
        if not key:
            raise ValueError("ALPHA_VANTAGE_KEY not set")

        ts = TimeSeries(key=key, output_format='pandas')
        data, meta_data = ts.get_daily(symbol=symbol, outputsize='full')
        
        # Rename columns to match yfinance format
        data.columns = [col.split('. ')[1].capitalize() for col in data.columns]
        data.sort_index(inplace=True)
        return data.tail(252)
    
    except Exception as av_error:
        logger.warning(f"Alpha Vantage failed: {str(av_error)}. Falling back to yfinance...")

    # 2. Fallback to yfinance
    try:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period="1y")
        if not df.empty:
            return df
        logger.error(f"yfinance also returned empty data for {symbol}")
        return None
    except Exception as yf_error:
        logger.error(f"Both sources failed. YF Error: {str(yf_error)}")
        return None
