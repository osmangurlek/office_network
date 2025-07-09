'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Button, Descriptions, Space, Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, ArrowLeftOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import HistoricalGraph from '@/components/HistoricalGraph';
import PersonStatistics from '@/components/PersonStatistics';

export default function DetailPage() {
  const searchParams = useSearchParams();
  const mac = searchParams.get('mac');
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/devices');
        const data = await response.json();
        const foundDevice = data.devices.find(d => d.mac_address === mac);
        if (foundDevice) {
          setDevice(foundDevice);
        }
      } catch (error) {
        console.error('Error fetching device:', error);
      } finally {
        setLoading(false);
      }
    };

    if (mac) {
      fetchDevice();
      const interval = setInterval(fetchDevice, 15000);
      return () => clearInterval(interval);
    }
  }, [mac]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!device) {
    return <div>Cihaz bulunamadı</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Breadcrumb 
        style={{ marginBottom: '16px' }}
        items={[
          {
            title: (
              <Link href="/">
                <Space>
                  <HomeOutlined />
                  <span>Ana Sayfa</span>
                </Space>
              </Link>
            ),
          },
          {
            title: (
              <Space>
                <UserOutlined />
                <span>{device.hostname}</span>
              </Space>
            ),
          },
        ]}
      />
      
      <Link href="/">
        <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: '16px' }}>
          Listeye Dön
        </Button>
      </Link>
      
      <Card 
        title={`Cihaz Bilgileri: ${device.hostname}`} 
        style={{ marginBottom: '20px' }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="MAC Adresi">{device.mac_address}</Descriptions.Item>
          <Descriptions.Item label="IP Adresi">{device.ip_address}</Descriptions.Item>
          <Descriptions.Item label="Durum">
            {device.status === 'Online' ? 
              <span style={{ color: 'green' }}>Çevrimiçi</span> : 
              <span style={{ color: 'red' }}>Çevrimdışı</span>
            }
          </Descriptions.Item>
          <Descriptions.Item label="Aktiflik Süresi">
            <Space>
              <ClockCircleOutlined />
              {device.time}
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Card>
      
      {/* Historical Graph */}
      <HistoricalGraph />
      
      {/* Person Statistics */}
      <PersonStatistics hostname={device.hostname} />
    </div>
  );
} 