'use client';
import { useState, useEffect } from 'react';
import { Space, Table, Tag, Button, Card, Row, Col } from 'antd';
import Link from 'next/link';
import { UserOutlined, BarChartOutlined } from '@ant-design/icons';
import HistoricalGraph from '@/components/HistoricalGraph';

const { Column } = Table;

export default function Home() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/devices');
        const data = await response.json();
        setDevices(data.devices);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 15000);
    return () => clearInterval(interval);
  }, []);

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
        <Table 
          dataSource={devices}
          rowKey={(record) => record.mac_address}
          columns={[
            {
              title: "MAC Adresi",
              dataIndex: "mac_address",
              key: "mac_address"
            },
            {
              title: "IP Adresi",
              dataIndex: "ip_address",
              key: "ip_address"
            },
            {
              title: "Çalışan Adı",
              dataIndex: "hostname",
              key: "hostname"
            },
            {
              title: "Durum",
              dataIndex: "status",
              key: "status",
              render: (status) => (
                <>
                  {status === 'Online' ? (
                    <Tag color="green">Çevrimiçi</Tag>
                  ) : (
                    <Tag color="red">Çevrimdışı</Tag>
                  )}
                </>
              )
            },
            {
              title: "İşlem",
              key: "action",
              render: (_, record) => (
                <Space size="middle">
                  <Link href={`/detail?mac=${record.mac_address}`}>
                    <Button type="primary" icon={<BarChartOutlined />}>
                      İstatistikler
                    </Button>
                  </Link>
                </Space>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
}
