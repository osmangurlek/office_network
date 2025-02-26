'use client';
import { useState } from 'react';
import { Card, Tabs, Table, Tag, Statistic, Row, Col, Timeline, DatePicker, Select } from 'antd';
import { UserOutlined, FieldTimeOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Generate dummy data for the user statistics
const generateUserHistory = (days = 30) => {
  const data = [];
  const now = new Date();
  
  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    
    // Random online/offline statuses for each day
    const statusChanges = Math.floor(Math.random() * 5) + 1; // 1-5 status changes per day
    let lastStatus = Math.random() > 0.5;
    
    for (let i = 0; i < statusChanges; i++) {
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      
      const eventTime = new Date(date);
      eventTime.setHours(hours, minutes, 0, 0);
      
      data.push({
        time: eventTime,
        status: lastStatus ? 'Çevrimiçi' : 'Çevrimdışı',
      });
      
      lastStatus = !lastStatus;
    }
  }
  
  // Sort by time
  return data.sort((a, b) => a.time - b.time);
};

// Generate daily statistics for a person
const generateDailyStats = (days = 30) => {
  const data = [];
  const now = new Date();
  
  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    
    const totalHours = Math.floor(Math.random() * 9) + 1; // 1-9 hours online
    const totalOfflineIntervals = Math.floor(Math.random() * 5) + 1; // 1-5 offline intervals
    
    data.push({
      date: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric' }),
      onlineHours: totalHours,
      offlineIntervals: totalOfflineIntervals,
    });
  }
  
  return data;
};

const PersonStatistics = ({ personId }) => {
  const [selectedPerson, setSelectedPerson] = useState('John Doe');
  const [timeRange, setTimeRange] = useState({ startDate: null, endDate: null });
  
  // In a real app, this would come from props or API
  // For now, using dummy person ID or default
  const userId = personId || 'user123';
  
  // Generate dummy data
  const userHistory = generateUserHistory(30);
  const dailyStats = generateDailyStats(30);
  
  // Calculate summary statistics
  const totalOnlineDays = dailyStats.filter(day => day.onlineHours > 0).length;
  const averageHoursPerDay = dailyStats.reduce((acc, curr) => acc + curr.onlineHours, 0) / dailyStats.length;
  const maxHoursOnline = Math.max(...dailyStats.map(day => day.onlineHours));
  
  // Mock data for person selection dropdown
  const personOptions = [
    { label: 'John Doe', value: 'John Doe' },
    { label: 'Jane Smith', value: 'Jane Smith' },
    { label: 'Bob Johnson', value: 'Bob Johnson' },
  ];
  
  // Columns for the timeline table
  const timelineColumns = [
    {
      title: 'Tarih',
      dataIndex: 'time',
      key: 'time',
      render: (time) => time.toLocaleString('tr-TR'),
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        status === 'Çevrimiçi' ? 
          <Tag color="green" icon={<CheckCircleOutlined />}>Çevrimiçi</Tag> : 
          <Tag color="red" icon={<ClockCircleOutlined />}>Çevrimdışı</Tag>
      ),
    },
  ];
  
  return (
    <Card title={`Kişi İstatistikleri: ${selectedPerson}`} style={{ width: '100%', marginBottom: 20 }}>
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Select
            style={{ width: 200, marginRight: 16 }}
            placeholder="Kişi Seçin"
            options={personOptions}
            value={selectedPerson}
            onChange={setSelectedPerson}
          />
          <DatePicker.RangePicker 
            style={{ marginRight: 16 }}
            onChange={(dates) => {
              if (dates && dates.length === 2) {
                setTimeRange({ startDate: dates[0], endDate: dates[1] });
              } else {
                setTimeRange({ startDate: null, endDate: null });
              }
            }} 
          />
        </Col>
      </Row>
      
      <Tabs defaultActiveKey="summary">
        <Tabs.TabPane tab="Özet" key="summary">
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Statistic 
                title="Toplam Çevrimiçi Gün" 
                value={totalOnlineDays} 
                suffix={`/ ${dailyStats.length} gün`}
                prefix={<UserOutlined />} 
              />
            </Col>
            <Col span={8}>
              <Statistic 
                title="Ortalama Günlük Çevrimiçi Saat" 
                value={averageHoursPerDay.toFixed(1)} 
                precision={1} 
                prefix={<FieldTimeOutlined />} 
                suffix="saat"
              />
            </Col>
            <Col span={8}>
              <Statistic 
                title="En Uzun Çevrimiçi Süre" 
                value={maxHoursOnline} 
                prefix={<ClockCircleOutlined />} 
                suffix="saat"
              />
            </Col>
          </Row>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dailyStats.slice(-14)} // Last 14 days
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="onlineHours" name="Çevrimiçi Saatler" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="offlineIntervals" name="Çevrimdışı Aralıklar" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Tabs.TabPane>
        
        <Tabs.TabPane tab="Geçmiş" key="history">
          <Table 
            dataSource={userHistory}
            columns={timelineColumns}
            rowKey={(record) => record.time.toString()}
            pagination={{ pageSize: 10 }}
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default PersonStatistics; 