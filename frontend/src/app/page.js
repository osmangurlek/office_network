'use client';
import { useState, useEffect } from 'react';
import { Space, Table, Tag, Button, Card, Row, Col } from 'antd';
import Link from 'next/link';
import { UserOutlined, BarChartOutlined } from '@ant-design/icons';
import HistoricalGraph from '@/components/HistoricalGraph';

const { Column } = Table;

export default function Home() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('http://localhost:8000/devices');
        const data = await response.json();
        console.log('Backend response:', data);
        setDevices(data.devices || data);
      } catch (error) {
        console.error('Error fetching devices:', error);
        // Use dummy data if API fails
        setDevices([
          { 
            key: '1', 
            mac_address: '00:1B:44:11:3A:B7', 
            ip_address: '192.168.1.105', 
            hostname: 'Ahmet Yılmaz', 
            status: 'Online',
            department: 'Muhasebe'
          },
          { 
            key: '2', 
            mac_address: '00:1B:44:22:5C:D9', 
            ip_address: '192.168.1.106', 
            hostname: 'Fatma Demir', 
            status: 'Offline',
            department: 'İnsan Kaynakları'
          },
          { 
            key: '3', 
            mac_address: '00:1B:44:33:7E:F1', 
            ip_address: '192.168.1.107', 
            hostname: 'Mehmet Kaya', 
            status: 'Online',
            department: 'Satış'
          },
          { 
            key: '4', 
            mac_address: '00:1B:44:44:9G:H3', 
            ip_address: '192.168.1.108', 
            hostname: 'Ayşe Yıldız', 
            status: 'Online',
            department: 'Pazarlama'
          },
          { 
            key: '5', 
            mac_address: '00:1B:44:55:1I:J5', 
            ip_address: '192.168.1.109', 
            hostname: 'Ali Çelik', 
            status: 'Offline',
            department: 'Teknik'
          },
        ]);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 15000);
    return () => clearInterval(interval);
  }, []);

  console.log('Current devices:', devices);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Ofis Ağ İzleme Paneli</h1>
      
      {/* Add the historical graph at the top of the page */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={24}>
          <HistoricalGraph />
        </Col>
      </Row>
      
      <Card title="Cihaz Listesi" style={{ marginBottom: '20px' }}>
        <Table dataSource={devices}>
          <Column title="MAC Adresi" dataIndex="mac_address" key="mac_address" />
          <Column title="IP Adresi" dataIndex="ip_address" key="ip_address" />
          <Column title="Çalışan Adı" dataIndex="hostname" key="hostname" />
          <Column 
            title="Durum" 
            dataIndex="status" 
            key="status" 
            render={(status) => (
              <>
                {status === 'Online' ? (
                  <Tag color="green">Çevrimiçi</Tag>
                ) : (
                  <Tag color="red">Çevrimdışı</Tag>
                )}
              </>
            )}
          />
          <Column 
            title="İşlem"
            key="action"
            render={(_, record) => (
              <Space size="middle">
                <Link href={`/detail?mac=${record.mac_address}`}>
                  <Button type="primary" icon={<BarChartOutlined />}>
                    İstatistikler
                  </Button>
                </Link>
              </Space>
            )}
          />
        </Table>
      </Card>
    </div>
  );
}
