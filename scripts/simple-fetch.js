// Simple client-side WebSocket script to fetch Nostr events
// Run this in the browser console or as part of a web page

const PYRAMID_RELAY = 'wss://pyramid.fiatjaf.com';

function fetchEventsSimple() {
  console.log(`🔍 Connecting to ${PYRAMID_RELAY}...`);
  
  const ws = new WebSocket(PYRAMID_RELAY);
  const events = [];
  
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      ws.close();
      console.log(`⏰ Timeout after 30 seconds`);
      resolve(events);
    }, 30000);
    
    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      
      // Send a simple REQ message to get recent events
      const reqMessage = [
        "REQ",
        "test-sub", 
        { "limit": 10 }
      ];
      
      console.log('📤 Sending request:', JSON.stringify(reqMessage));
      ws.send(JSON.stringify(reqMessage));
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('📥 Received:', message[0]);
        
        if (message[0] === 'EVENT') {
          const nostrEvent = message[2];
          console.log(`📩 Event: kind ${nostrEvent.kind}, id ${nostrEvent.id.substring(0, 8)}...`);
          events.push(nostrEvent);
        } else if (message[0] === 'EOSE') {
          console.log('🏁 End of stored events');
          clearTimeout(timeout);
          ws.close();
          resolve(events);
        }
      } catch (error) {
        console.log('❌ Error parsing message:', error.message);
      }
    };
    
    ws.onerror = (error) => {
      console.log('❌ WebSocket error:', error);
      clearTimeout(timeout);
      reject(error);
    };
    
    ws.onclose = () => {
      console.log('🔌 WebSocket closed');
      clearTimeout(timeout);
      resolve(events);
    };
  });
}

// For browser usage - call this function
// fetchEventsSimple().then(events => console.log('Got events:', events));

// For testing in browser console, auto-run:
if (typeof window !== 'undefined') {
  // Running in browser
  fetchEventsSimple()
    .then((events) => {
      console.log(`🎉 Successfully fetched ${events.length} events`);
      if (events.length > 0) {
        console.log('📋 Event summary:');
        events.forEach((event, i) => {
          console.log(`  ${i + 1}. Kind ${event.kind}: ${event.id.substring(0, 8)}...`);
        });
      }
      return events;
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
    });
} else {
  // Export for module usage
  if (typeof module !== 'undefined') {
    module.exports = { fetchEventsSimple };
  }
}