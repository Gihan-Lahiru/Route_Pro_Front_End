import React, { useState } from 'react';
import axios from 'axios';

const BackendTestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const testBackendConnections = async () => {
    setTesting(true);
    const results = {};

    // Test 1: Basic connectivity
    try {
      const response = await fetch('http://localhost/RoutePro-backend(02)/public/api/routes/routes.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      results.routesEndpoint = {
        status: response.status,
        success: response.ok,
        data: await response.text()
      };
    } catch (error) {
      results.routesEndpoint = {
        success: false,
        error: error.message
      };
    }

    // Test 2: Trips endpoint
    try {
      const response = await fetch('http://localhost/RoutePro-backend(02)/public/api/trips/trips.php', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      results.tripsEndpoint = {
        status: response.status,
        success: response.ok,
        data: await response.text()
      };
    } catch (error) {
      results.tripsEndpoint = {
        success: false,
        error: error.message
      };
    }

    // Test 3: Check localStorage data
    results.localStorage = {
      user_id: localStorage.getItem('user_id'),
      userEmail: localStorage.getItem('userEmail'),
      userRole: localStorage.getItem('userRole'),
      routeData: localStorage.getItem('routeData')
    };

    setTestResults(results);
    setTesting(false);
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px', 
      borderRadius: '5px',
      maxWidth: '400px',
      maxHeight: '80vh',
      overflow: 'auto',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <h4>Backend Debug Panel</h4>
      <button 
        onClick={testBackendConnections} 
        disabled={testing}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        {testing ? 'Testing...' : 'Test Backend'}
      </button>
      
      {Object.keys(testResults).length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <h5>Test Results:</h5>
          <pre style={{ 
            fontSize: '10px', 
            background: '#f5f5f5', 
            padding: '5px', 
            borderRadius: '3px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default BackendTestComponent;