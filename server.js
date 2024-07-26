const express = require('express');
const os = require('os');
const { exec } = require('child_process');
const { checkIP } = require('./abuseipdb');
const { checkIPWithVirusTotal } = require('./virustotal');

const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());

app.get('/api/check-ip-virustotal/:ip', async (req, res) => {
    console.log(`Checking IP with VirusTotal: ${req.params.ip}`); // Log request
    try {
        const ipInfo = await checkIPWithVirusTotal(req.params.ip);
        res.json(ipInfo);
        // console.log(ipInfo)
    } catch (error) {
        console.error('Error:', error.message); // Log error
        res.status(500).json({ error: error.toString() });
    }
});

app.get('/api/check-ip/:ip', async (req, res) => {
    console.log(`Checking IP with AbuseIPDB: ${req.params.ip}`); // Log request
    try {
        const ipInfo = await checkIP(req.params.ip);
        res.json(ipInfo);
    } catch (error) {
        console.error('Error:', error.message); // Log error
        res.status(500).json({ error: error.toString() });
    }
});

app.get('/api/network-traffic', (req, res) => {
    // For demonstration purposes, simulate network traffic data
    // In a real application, you would use actual system monitoring tools or libraries
    const networkTraffic = {
      in: Math.random() * 1000, // Simulated inbound traffic
      out: Math.random() * 1000 // Simulated outbound traffic
    };
    
    res.json(networkTraffic);
  });

const getNetworkConnections = () => {
    const platform = os.platform();
    let command;

    switch (platform) {
        case 'win32':
            command = 'netstat -an | findstr "ESTABLISHED" | findstr /V "127.0.0.1"';
            break;
        case 'darwin':
        case 'linux':
            command = 'netstat -an | grep "ESTABLISHED" | grep -v "127.0.0.1"';
            break;
        default:
            return Promise.reject(new Error('Unsupported platform'));
    }

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${stderr}`);
            } else {
                // Convert output to JSON
                const lines = stdout.trim().split('\n');
                const results = lines.map(line => {
                    const columns = line.trim().split(/\s+/);
                    
                    // Handle different formats based on platform
                    let protocol, localAddress, foreignAddress, state;

                    if (platform === 'win32') {
                        // Example format for Windows: TCP    0.0.0.0:80       0.0.0.0:0         ESTABLISHED
                        if (columns.length === 4) {
                            [protocol, localAddress, foreignAddress, state] = columns;
                        }
                    } else {
                        // Example format for Unix-based systems: tcp4       0.0.0.0:80       *:*   LISTEN
                        if (columns.length >= 5) {
                            [protocol, localAddress, foreignAddress, , state] = columns;
                        }
                    }

                    return { protocol: protocol || 'N/A', localAddress: localAddress || 'N/A', foreignAddress: foreignAddress || 'N/A', state: state || 'N/A' };
                });
                resolve(results);
            }
        });
    });
};



app.get('/api/connections', async (req, res) => {
    try {
        const connections = await getNetworkConnections();
        res.json(connections);
        // console.log(connections)
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
