'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Button, Descriptions, Space, Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import HistoricalGraph from '@/components/HistoricalGraph';
import PersonStatistics from '@/components/PersonStatistics';

export default function DetailPage() {
  const searchParams = useSearchParams();
  const mac = searchParams.get('mac');
  const [device, setDevice] = useState(null);
  
  useEffect(() => {
    // For dummy data, we'll create a mock device
    // In a real application, you would fetch the device based on MAC address
    setDevice({
      mac_address: mac || '00:1B:44:11:3A:B7',
      ip_address: '192.168.1.105',
      hostname: 'Ahmet Yılmaz',
      status: 'Online',
      department: 'Muhasebe',
      lastSeen: new Date().toLocaleString('tr-TR'),
      firstSeen: '01.01.2024 08:30',
      deviceType: 'Laptop',
      os: 'Windows 11',
    });
  }, [mac]);
  
  if (!device) {
    return <div>Yükleniyor...</div>;
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
          <Descriptions.Item label="Departman">{device.department}</Descriptions.Item>
          <Descriptions.Item label="Durum">
            {device.status === 'Online' ? 
              <span style={{ color: 'green' }}>Çevrimiçi</span> : 
              <span style={{ color: 'red' }}>Çevrimdışı</span>
            }
          </Descriptions.Item>
          <Descriptions.Item label="Son Görülme">{device.lastSeen}</Descriptions.Item>
          <Descriptions.Item label="İlk Kaydedilme">{device.firstSeen}</Descriptions.Item>
          <Descriptions.Item label="Cihaz Tipi">{device.deviceType}</Descriptions.Item>
          <Descriptions.Item label="İşletim Sistemi">{device.os}</Descriptions.Item>
        </Descriptions>
      </Card>
      
      {/* Historical Graph */}
      <HistoricalGraph />
      
      {/* Person Statistics */}
      <PersonStatistics personId={device.mac_address} />
    </div>
  );
} 