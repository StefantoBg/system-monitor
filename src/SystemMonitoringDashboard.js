import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';

function SystemMonitoringDashboard() {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [diskUsage, setDiskUsage] = useState(0);
  const [networkTraffic, setNetworkTraffic] = useState({ in: 0, out: 0 });
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const fetchCpuUsage = () => {
      setCpuUsage(Math.random() * 100); // Simulated value
    };

    const fetchMemoryUsage = () => {
      const totalMem = 16 * 1024 * 1024 * 1024; // 16 GB
      const freeMem = Math.random() * totalMem;
      const usedMem = totalMem - freeMem;
      setMemoryUsage((usedMem / totalMem) * 100);
    };

    const fetchDiskUsage = async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Math.random() * 100);
        }, 1000);
      });
    };

    const fetchNetworkTraffic = async () => {
      try {
        const response = await axios.get('/api/network-traffic');
        setNetworkTraffic(response.data);
      } catch (error) {
        console.error('Error fetching network traffic:', error);
      }
    };

    const fetchConnections = async () => {
      try {
        const response = await axios.get('/api/connections');
        setConnections(response.data);
      } catch (error) {
        console.error('Error fetching network connections:', error);
      }
    };

    const updateDashboard = async () => {
      fetchCpuUsage();
      fetchMemoryUsage();
      const diskUsageResult = await fetchDiskUsage();
      setDiskUsage(diskUsageResult);
      await fetchNetworkTraffic();
      await fetchConnections();
    };

    const intervalId = setInterval(() => {
      updateDashboard();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {/* Top Navbar */}
      <h1 className="text-center mb-4">Live local Network and System Monitoring</h1>

      <Container className="mt-4">
        <Row className="mb-4">
          {/* Metrics Display */}
          <Col md={3} className="mb-3">
            <div className="p-3 border rounded bg-light">
              <h4>CPU Usage</h4>
              <p>{cpuUsage.toFixed(2)}%</p>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="p-3 border rounded bg-light">
              <h4>Memory Usage</h4>
              <p>{memoryUsage.toFixed(2)}%</p>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="p-3 border rounded bg-light">
              <h4>Disk Usage</h4>
              <p>{diskUsage.toFixed(2)}%</p>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="p-3 border rounded bg-light">
              <h4>Network Traffic</h4>
              <p>In: {networkTraffic.in.toFixed(2)} KB/s</p>
              <p>Out: {networkTraffic.out.toFixed(2)} KB/s</p>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Network Connections Table */}
          <Col md={12}>
            <div className="p-3 border rounded bg-light">
              <h3>Network Connections</h3>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Protocol</th>
                    <th>Local Address</th>
                    <th>Foreign Address</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {connections.map((conn, index) => (
                    <tr key={index}>
                      <td>{conn.protocol}</td>
                      <td>{conn.localAddress}</td>
                      <td>{conn.foreignAddress}</td>
                      <td>{conn.state}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SystemMonitoringDashboard;
