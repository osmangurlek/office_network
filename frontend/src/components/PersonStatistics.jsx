'use client';
import { useState, useEffect } from 'react';
import { Card, Tabs, Table, Tag, Statistic, Row, Col, DatePicker, Tooltip, Space, Descriptions, Alert } from 'antd';
import { 
  UserOutlined, 
  FieldTimeOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  WifiOutlined,
  GlobalOutlined,
  LaptopOutlined
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const PersonStatistics = ({ hostname }) => {
  const [timeRange, setTimeRange] = useState({ startDate: null, endDate: null });
  const [data, setData] = useState(null);
  const [deviceDetails, setDeviceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!hostname) return;

      try {
        setLoading(true);
        setError(null);
        
        // Fetch person stats
        const statsResponse = await fetch(`http://localhost:8000/person/${hostname}/stats?days=30`);
        if (!statsResponse.ok) {
          throw new Error(`Failed to fetch stats: ${statsResponse.statusText}`);
        }
        const statsResult = await statsResponse.json();
        
        // Validate the data structure
        if (!statsResult?.summary || !statsResult?.daily) {
          throw new Error('Invalid data structure received from the server');
        }
        
        setData(statsResult);

        // Fetch current device details
        const devicesResponse = await fetch('http://localhost:8000/devices');
        if (!devicesResponse.ok) {
          throw new Error(`Failed to fetch devices: ${devicesResponse.statusText}`);
        }
        const devicesResult = await devicesResponse.json();
        const currentDevice = devicesResult.devices.find(d => d.hostname === hostname);
        setDeviceDetails(currentDevice);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, [hostname]);

  if (!hostname) {
    return <Alert message="No hostname provided" type="warning" />;
  }

  if (error) {
    return <Alert message={error} type="error" />;
  }

  if (loading && !data) {
    return (
      <Card loading={true} style={{ width: '100%', marginBottom: 20 }}>
        <div style={{ height: 400 }}></div>
      </Card>
    );
  }

  const getDeviceTypeIcon = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case 'laptop':
        return <LaptopOutlined />;
      case 'mobile':
        return <WifiOutlined />;
      default:
        return <GlobalOutlined />;
    }
  };

  // Ensure data exists and has the expected structure
  const summary = data?.summary || {
    totalOnlineDays: 0,
    averageHoursPerDay: 0,
    maxHoursOnline: 0
  };

  const dailyData = data?.daily || [];

  return (
    <Card 
      title={
        <Space>
          {getDeviceTypeIcon(deviceDetails?.DeviceType)}
          <span>{`Kişi İstatistikleri: ${hostname}`}</span>
        </Space>
      } 
      style={{ width: '100%', marginBottom: 20 }} 
      loading={loading}
    >
      {deviceDetails && (
        <Row style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="IP Adresi">{deviceDetails.ip_address}</Descriptions.Item>
              <Descriptions.Item label="MAC Adresi">{deviceDetails.mac_address}</Descriptions.Item>
              <Descriptions.Item label="Port">{deviceDetails.Port || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Port Tipi">{deviceDetails.PortType || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="IP Tipi">{deviceDetails.IpType || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Cihaz Tipi">{deviceDetails.DevType || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="IPv4">{deviceDetails.IPv4Enabled ? 'Aktif' : 'Pasif'}</Descriptions.Item>
              <Descriptions.Item label="IPv6">{deviceDetails.IPv6Enabled ? 'Aktif' : 'Pasif'}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      )}

      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
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
              <Tooltip title="Toplam çevrimiçi olduğu gün sayısı">
                <Statistic 
                  title="Toplam Çevrimiçi Gün" 
                  value={summary.totalOnlineDays} 
                  suffix="gün"
                  prefix={<UserOutlined />} 
                />
              </Tooltip>
            </Col>
            <Col span={8}>
              <Tooltip title="Günlük ortalama çevrimiçi kalma süresi">
                <Statistic 
                  title="Ortalama Günlük Çevrimiçi" 
                  value={summary.averageHoursPerDay} 
                  precision={1} 
                  prefix={<FieldTimeOutlined />} 
                  suffix="saat"
                />
              </Tooltip>
            </Col>
            <Col span={8}>
              <Tooltip title="En uzun kesintisiz çevrimiçi kalma süresi">
                <Statistic 
                  title="En Uzun Çevrimiçi Süre" 
                  value={summary.maxHoursOnline} 
                  prefix={<ClockCircleOutlined />} 
                  suffix="saat"
                />
              </Tooltip>
            </Col>
          </Row>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dailyData.slice(-14)} // Last 14 days
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <RechartsTooltip />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="onlineHours" 
                name="Çevrimiçi Saatler" 
                fill="#8884d8" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="right" 
                dataKey="offlineIntervals" 
                name="Çevrimdışı Aralıklar" 
                fill="#82ca9d" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Tabs.TabPane>
        
        <Tabs.TabPane tab="Günlük İstatistikler" key="daily">
          <Table 
            dataSource={dailyData}
            rowKey={(record) => record.date}
            pagination={{ pageSize: 10 }}
            columns={[
              {
                title: "Tarih",
                dataIndex: "date",
                key: "date",
                sorter: (a, b) => new Date(a.date) - new Date(b.date)
              },
              {
                title: "Çevrimiçi Saatler",
                dataIndex: "onlineHours",
                key: "onlineHours",
                render: (hours) => `${hours} saat`,
                sorter: (a, b) => a.onlineHours - b.onlineHours
              },
              {
                title: "Çevrimdışı Aralıklar",
                dataIndex: "offlineIntervals",
                key: "offlineIntervals",
                render: (intervals) => `${intervals} kez`,
                sorter: (a, b) => a.offlineIntervals - b.offlineIntervals
              },
              {
                title: "Durum",
                key: "status",
                render: (_, record) => (
                  <Tag color={record.onlineHours > 0 ? "green" : "red"}>
                    {record.onlineHours > 0 ? "Çevrimiçi" : "Çevrimdışı"}
                  </Tag>
                )
              }
            ]}
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default PersonStatistics; 