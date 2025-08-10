const WebSocket = require('ws');

const PYRAMID_RELAY = 'wss://pyramid.fiatjaf.com';

async function testPyramidConnection() {
  console.log(`🔍 Testing connection to ${PYRAMID_RELAY}...`);
  
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(PYRAMID_RELAY);
    const timeout = setTimeout(() => {
      ws.terminate();
      reject(new Error('Connection timeout after 10s'));
    }, 10000);

    ws.on('open', () => {
      clearTimeout(timeout);
      console.log('✅ Successfully connected to pyramid relay');
      
      // Send a simple REQ to see if relay responds
      const reqMessage = JSON.stringify(['REQ', 'test-sub', { kinds: [1], limit: 1 }]);
      ws.send(reqMessage);
      console.log('📡 Sent test REQ message');
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('📨 Received message:', message);
        
        if (message[0] === 'EOSE') {
          console.log('✅ Received EOSE (End of Stored Events)');
          ws.close();
          resolve('Connected and received EOSE');
        } else if (message[0] === 'EVENT') {
          console.log('🎉 Received an actual event!');
          ws.close();
          resolve('Connected and received events');
        }
      } catch (error) {
        console.log('❌ Error parsing message:', error.message);
      }
    });

    ws.on('error', (error) => {
      clearTimeout(timeout);
      console.log('❌ WebSocket error:', error.message);
      reject(error);
    });

    ws.on('close', (code, reason) => {
      clearTimeout(timeout);
      console.log(`🔌 Connection closed (code: ${code}, reason: ${reason})`);
      resolve(`Connection closed: ${code}`);
    });
  });
}

testPyramidConnection()
  .then(result => {
    console.log('Test result:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Test failed:', error.message);
    process.exit(1);
  });