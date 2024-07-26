import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import './App.css';
import SystemMonitoringDashboard from './SystemMonitoringDashboard'; // Import the new component

function App() {
  const [connections, setConnections] = useState([]);
  const [ipCheck, setIpCheck] = useState(null);
  const [virusTotalCheck, setVirusTotalCheck] = useState(null);
  const [ip, setIp] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [error, setError] = useState(null);
  const [checkingIP, setCheckingIP] = useState(false);
  const [checkingVirusTotal, setCheckingVirusTotal] = useState(false);
  const [checkingWebCheck, setCheckingWebCheck] = useState(false);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axios.get('/api/connections');
        setConnections(response.data);
      } catch (error) {
        setError('Error fetching connections');
        console.error('Error fetching connections:', error);
      }
    };

    fetchConnections();
  }, []);

  const handleCheckIP = async () => {
    if (checkingIP) return; // Prevent multiple requests if already checking
    setCheckingIP(true);
    try {
      const response = await axios.get(`/api/check-ip/${ip}`);
      setIpCheck(response.data);
      setError(null);
    } catch (error) {
      setError('Error checking IP');
      console.error('Error checking IP:', error);
    } finally {
      setCheckingIP(false);
    }
  };

  const handleCheckVirusTotal = async () => {
    if (checkingVirusTotal) return; // Prevent multiple requests if already checking
    setCheckingVirusTotal(true);
    try {
      const response = await axios.get(`/api/check-ip-virustotal/${ip}`);
      console.log('VirusTotal Response:', response); // Log the raw response
      setVirusTotalCheck(response.data);
      setError(null);
    } catch (error) {
      setError('Error checking IP with VirusTotal');
      console.error('Error checking IP with VirusTotal:', error);
    } finally {
      setCheckingVirusTotal(false);
    }
  };

  const handleCheckWebCheck = async () => {
    if (checkingWebCheck) return; // Prevent multiple requests if already checking
    setCheckingWebCheck(true);
    try {
      setIframeUrl(`https://web-check.xyz/check/${ip}`);
      setError(null);
    } catch (error) {
      setError('Error checking IP with Web-Check');
      console.error('Error checking IP with Web-Check:', error);
    } finally {
      setCheckingWebCheck(false);
    }
  };

  return (
    <Container className="mt-5">
      <SystemMonitoringDashboard />



      <Row className="custom-margin-top mb-4 tables-container">
        <Col>
          <Form className="d-flex">
            <Form.Control
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Enter IP to check"
              className="me-2"
              disabled={checkingIP || checkingVirusTotal || checkingWebCheck}
            />
            <Button onClick={handleCheckIP} className="btn btn-primary me-2" disabled={checkingIP}>
              {checkingIP ? <Spinner animation="border" size="sm" /> : 'Check IP with AbuseIPDB'}
            </Button>
            <Button onClick={handleCheckVirusTotal} className="btn btn-secondary me-2" disabled={checkingVirusTotal}>
              {checkingVirusTotal ? <Spinner animation="border" size="sm" /> : 'Check IP with VirusTotal'}
            </Button>
            <Button onClick={handleCheckWebCheck} className="btn btn-success" disabled={checkingWebCheck}>
              {checkingWebCheck ? <Spinner animation="border" size="sm" /> : 'Check IP with Web-Check'}
            </Button>
          </Form>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {!ipCheck && !checkingIP && (
        <Row>
          <Col md={6} className="mb-4">
            {/* <h2>Network Connections Now - check IP</h2> */}
            <Table striped bordered hover>
              <thead>
                {/* <tr>
                  <th>Protocol</th>
                  <th>Local Address</th>
                  <th>Foreign Address</th>
                  <th>State</th>
                </tr> */}
              </thead>
              <tbody>
                {/* {connections.map((conn, index) => (
                  <tr key={index}>
                    <td>{conn.protocol}</td>
                    <td>{conn.localAddress}</td>
                    <td>{conn.foreignAddress}</td>
                    <td>{conn.state}</td>
                  </tr>
                ))} */}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}

      {iframeUrl && (
        <Row>
          <Col md={12} className="mb-4">
            <h2>Web Check Result</h2>
            <iframe src={iframeUrl} width="100%" height="500" title="Web Check"></iframe>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={6} className="mb-4">
          {ipCheck && (
            <>
              <h2>IP Check Result from AbuseIPDB</h2>
              <Table striped bordered hover>
                <tbody>
                  <tr>
                    <th>IP Address</th>
                    <td>{ipCheck.data.ipAddress}</td>
                  </tr>
                  <tr>
                    <th>Public</th>
                    <td>{ipCheck.data.isPublic ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <th>IP Version</th>
                    <td>{ipCheck.data.ipVersion}</td>
                  </tr>
                  <tr>
                    <th>Whitelisted</th>
                    <td>{ipCheck.data.isWhitelisted ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <th>Abuse Confidence Score</th>
                    <td>{ipCheck.data.abuseConfidenceScore}</td>
                  </tr>
                  <tr>
                    <th>Country Code</th>
                    <td>{ipCheck.data.countryCode}</td>
                  </tr>
                  <tr>
                    <th>Usage Type</th>
                    <td>{ipCheck.data.usageType}</td>
                  </tr>
                  <tr>
                    <th>ISP</th>
                    <td>{ipCheck.data.isp}</td>
                  </tr>
                  <tr>
                    <th>Domain</th>
                    <td>{ipCheck.data.domain}</td>
                  </tr>
                  <tr>
                    <th>Hostnames</th>
                    <td>{ipCheck.data.hostnames.length > 0 ? ipCheck.data.hostnames.join(', ') : 'None'}</td>
                  </tr>
                  <tr>
                    <th>TOR</th>
                    <td>{ipCheck.data.isTor ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <th>Total Reports</th>
                    <td>{ipCheck.data.totalReports}</td>
                  </tr>
                  <tr>
                    <th>Distinct Users</th>
                    <td>{ipCheck.data.numDistinctUsers}</td>
                  </tr>
                  <tr>
                    <th>Last Reported At</th>
                    <td>{new Date(ipCheck.data.lastReportedAt).toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
        </Col>

        <Col md={6} className="mb-4">
          {virusTotalCheck && (
            <>
              <h2>IP Check Result from VirusTotal</h2>
              <Table striped bordered hover>
                <tbody>
                  <tr>
                    <th>IP Address</th>
                    <td>{virusTotalCheck.data.id}</td>
                  </tr>
                  <tr>
                    <th>Country</th>
                    <td>{virusTotalCheck.data.attributes.country}</td>
                  </tr>
                  <tr>
                    <th>Continent</th>
                    <td>{virusTotalCheck.data.attributes.continent}</td>
                  </tr>
                  <tr>
                    <th>Reputation</th>
                    <td>{virusTotalCheck.data.attributes.reputation}</td>
                  </tr>
                  <tr>
                    <th>Whois Information</th>
                    <td><pre>{virusTotalCheck.data.attributes.whois}</pre></td>
                  </tr>
                  <tr>
                    <th>ASN</th>
                    <td>{virusTotalCheck.data.attributes.asn}</td>
                  </tr>
                  <tr>
                    <th>AS Owner</th>
                    <td>{virusTotalCheck.data.attributes.as_owner}</td>
                  </tr>
                  <tr>
                    <th>Network</th>
                    <td>{virusTotalCheck.data.attributes.network}</td>
                  </tr>
                  <tr>
                    <th>JARM</th>
                    <td>{virusTotalCheck.data.attributes.jarm}</td>
                  </tr>
                  <tr>
                    <th>Last Analysis Date</th>
                    <td>{new Date(virusTotalCheck.data.attributes.last_analysis_date * 1000).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Last Modification Date</th>
                    <td>{new Date(virusTotalCheck.data.attributes.last_modification_date * 1000).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Whois Date</th>
                    <td>{new Date(virusTotalCheck.data.attributes.whois_date * 1000).toLocaleString()}</td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;


