'use client';
import { useState, useEffect } from 'react';
import { Card, Segmented } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HistoricalGraph = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const rangeOptions = [
    { label: 'Haftalık', value: 'week' },
    { label: 'Aylık', value: 'month' },
    { label: '3 Aylık', value: 'quarter' },
    { label: 'Yıllık', value: 'year' },
  ];

  const getDays = (range) => {
    switch (range) {
      case 'week':
        return 7;
      case 'month':
        return 30;
      case 'quarter':
        return 90;
      case 'year':
        return 365;
      default:
        return 7;
    }
  };

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        const days = getDays(timeRange);
        const response = await fetch(`http://localhost:8000/historical?days=${days}`);
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [timeRange]);

  return (
    <Card 
      title="Zaman-Kişi Sayısı Grafiği" 
      extra={
        <Segmented
          options={rangeOptions}
          value={timeRange}
          onChange={setTimeRange}
        />
      }
      style={{ width: '100%', marginBottom: 20 }}
      loading={loading}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#8884d8" 
            name="Çevrimiçi Kişi Sayısı" 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default HistoricalGraph; 