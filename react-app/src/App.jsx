import React from 'react';
import { useState } from 'react';
import './styles.css';
import { useEffect } from 'react';
function App() {
    const [stockSymbol, setStockSymbol] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshTime, setRefreshTime] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    const [stockHistory, setStockHistory] = useState([]);
    const handleStockChange = (event) => {
        setStockSymbol(event.target.value);

    };
    const handleRefreshTimer = (event) => {
        setRefreshTime(Number(event.target.value));
    }

    const fetchData = () => {
        if (!stockSymbol) return;

        setLoading(true);

        const apiKey='crk5c59r01qq23fgvv1gcrk5c59r01qq23fgvv20';
        const url = `https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${apiKey}`
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                const currentTime = new Date().toLocaleTimeString();
                
                const newStockData = {
                    currentPrice: data.c,
                    openPrice: data.o,
                    highPrice: data.h,
                    lowPrice: data.l,
                    previousClosePrice: data.pc,
                    time: currentTime,
                };

                setStockHistory((prevHistory) => [newStockData, ...prevHistory]);

                setLoading(false);
            });
    };
    const startFetching =() =>{
        if (intervalId) clearInterval(intervalId);
        if(refreshTime && refreshTime > 0){
            const id = setInterval(fetchData, refreshTime *1000);
            setIntervalId(id);
        }else{
            fetchData();
        }
    }

    useEffect(() => {
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [intervalId]);
    
    return(
        <div>
            <div>
                <h1>Stock Tracker</h1>
            </div>
            <div className='wrapper'> 
                <input
                    type="text"
                    id="stockSymbol"
                    placeholder='Enter Stock Symbol'
                    value={stockSymbol}
                    onChange={handleStockChange}
                />
                <input
                    type="number"
                    id="seconds"
                    placeholder='Enter Sec Refresh'
                    value={refreshTime}
                    onChange={handleRefreshTimer}
                
                />
            </div>

            <div className='mainDisplay'>
                <h2 className='stockSymbol'> Stock Data for: {stockSymbol}</h2>
                <button onClick={startFetching}> Get Stock Price </button>
                {loading ? (<p>Loading...</p>) : (
                    <table className='stockTable'>
                        <thead>
                            <tr>
                                <th>Current Stock Price</th>
                                <th>Open Stock Price</th>
                                <th>High Stock Price</th>
                                <th>Low Stock Price</th>
                                <th>Previous Close Stock Price</th>
                                <th>Time Log</th>
                            </tr>
                        </thead>
                        <tbody>
                        {stockHistory.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.currentPrice !== null ? `$${entry.currentPrice}` : 'N/A'}</td>
                                    <td>{entry.openPrice !== null ? `$${entry.openPrice}` : 'N/A'}</td>
                                    <td>{entry.highPrice !== null ? `$${entry.highPrice}` : 'N/A'}</td>
                                    <td>{entry.lowPrice !== null ? `$${entry.lowPrice}` : 'N/A'}</td>
                                    <td>{entry.previousClosePrice !== null ? `$${entry.previousClosePrice}` : 'N/A'}</td>
                                    <td>{entry.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
               )}
            </div>

            <div className='display'></div>
    
        </div>
    );
}

export default App;
