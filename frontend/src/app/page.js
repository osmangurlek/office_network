'use client';
import { useState, useEffect } from 'react';
import { Space, Table, Tag, Button } from 'antd';
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
      }
    };

    fetchDevices();
    const interval = setInterval(fetchDevices, 15000);
    return () => clearInterval(interval);
  }, []);

  console.log('Current devices:', devices);

  return (
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
            {status === 'true' ? (
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
              <Button type="primary">Detay</Button>
            </Space>
          )}
        />
    </Table>
  );
}
