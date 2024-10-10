import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './ApiDataPage.css'

const ApiDataPage = () => {
    const [data, setData] = useState([]);
    const [queries, setQueries] = useState([]);
    const [results, setResults] = useState([]);
    const [token, setToken] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/intern-test/input'); 
            const { token, data, query } = response.data;
            setToken(token);
            setData(data);
            setQueries(query);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const processQueries = () => {
        const n = data.length;
        const prefixSum = new Array(n + 1).fill(0);
        const evenPrefixSum = new Array(n + 1).fill(0);
        const oddPrefixSum = new Array(n + 1).fill(0);

        for (let i = 0; i < n; i++) {
            prefixSum[i + 1] = prefixSum[i] + data[i];
            if (i % 2 === 0) {
                evenPrefixSum[i + 1] = evenPrefixSum[i] + data[i];
                oddPrefixSum[i + 1] = oddPrefixSum[i];
            } else {
                oddPrefixSum[i + 1] = oddPrefixSum[i] + data[i];
                evenPrefixSum[i + 1] = evenPrefixSum[i];
            }
        }

        const resultArray = queries.map(query => {
            const { type, range } = query;
            const [l, r] = range;

            if (type === "1") {
                return prefixSum[r + 1] - prefixSum[l];
            } else if (type === "2") {
                return evenPrefixSum[r + 1] - oddPrefixSum[r + 1] - (evenPrefixSum[l] - oddPrefixSum[l]);
            }
            return 0;
        });

        setResults(resultArray);
    };

    const sendResults = async () => {
        try {
            await axios.post('/api/intern-test/output', {
                results
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Results sent successfully:', results);
        } catch (error) {
            console.error('Error sending results:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data.length > 0 && queries.length > 0) {
            processQueries();
        }
    }, [data, queries]);

    useEffect(() => {
        if (results.length > 0) {
            sendResults();
        }
    }, [results]);

    return (
        <div className='api-data-page'>
            <nav className="header">
                <div className="header-content">
                    <a className="app_name" href="/">TM App</a>
                    <ul className="header-action">
                        <li className="nav-item">
                            <a className="nav-link nav-link-active active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/update-transaction">Update transaction</a>
                        </li>
                        <li className="nav-item action_active">
                            <a className="nav-link" href="/api-data">Task 4</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <span className="api-data-page-title">Results of queries</span>
            <div className="api-data-page-table">
                <table border="1" className="table table-borderless">
                    <thead>
                        <tr>
                            <th>Query</th>
                            <th>Results</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.length > 0 && results.map((result, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{result}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApiDataPage;
