'use client';
import { useState } from 'react';
import { Card, Radio, Segmented } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Generate dummy data
const generateDummyData = (days = 7, interval = 'hourly') => {
  const data = [];
  const now = new Date();
  
  if (interval === 'hourly') {
    // Generate data for each hour in the past days
    for (let d = days - 1; d >= 0; d--) {
      for (let h = 0; h < 24; h += 3) { // Every 3 hours to reduce clutter
        const date = new Date(now);
        date.setDate(date.getDate() - d);
        date.setHours(h);
        date.setMinutes(0);
        date.setSeconds(0);
        
        data.push({
          time: date.toLocaleString('tr-TR', { 
            month: 'numeric', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          count: Math.floor(Math.random() * 15) + 5, // Random between 5-20 people
        });
      }
    }
  } else if (interval === 'daily') {
    // Generate data for each day in the past 30 days
    for (let d = days - 1; d >= 0; d--) {
      const date = new Date(now);
      date.setDate(date.getDate() - d);
      
      data.push({
        time: date.toLocaleDateString('tr-TR', { month: 'numeric', day: 'numeric' }),
        count: Math.floor(Math.random() * 15) + 5, // Random between 5-20 people
      });
    }
  } else if (interval === 'weekly') {
    // Generate data for each week
    for (let w = 0; w < days; w++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7));
      
      data.push({
        time: `Hafta ${days - w}`,
        count: Math.floor(Math.random() * 15) + 5, // Random between 5-20 people
      });
    }
  } else if (interval === 'monthly') {
    // Generate data for past months
    for (let m = days - 1; m >= 0; m--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - m);
      
      data.push({
        time: date.toLocaleDateString('tr-TR', { month: 'long' }),
        count: Math.floor(Math.random() * 15) + 5, // Random between 5-20 people
      });
    }
  }
  
  return data;
};

const HistoricalGraph = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [interval, setInterval] = useState('daily');
  
  const rangeOptions = [
    { label: 'Haftalık', value: 'week' },
    { label: 'Aylık', value: 'month' },
    { label: '3 Aylık', value: 'quarter' },
    { label: 'Yıllık', value: 'year' },
  ];
  
  // Generate data based on selected time range
  const getData = () => {
    switch (timeRange) {
      case 'week':
        return generateDummyData(7, 'hourly');
      case 'month':
        return generateDummyData(30, 'daily');
      case 'quarter':
        return generateDummyData(12, 'weekly');
      case 'year':
        return generateDummyData(12, 'monthly');
      default:
        return generateDummyData(7, 'daily');
    }
  };
  
  const data = getData();
  
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
          <Line type="monotone" dataKey="count" stroke="#8884d8" name="Kişi Sayısı" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default HistoricalGraph; 