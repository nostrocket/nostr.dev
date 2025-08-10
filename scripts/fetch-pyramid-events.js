const { SimplePool, verifyEvent } = require('nostr-tools');
const fs = require('fs').promises;
const path = require('path');

const PYRAMID_RELAY = 'wss://pyramid.fiatjaf.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data', 'events');

// Event kinds to search for on pyramid relay - trying more common ones
const EVENT_KINDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 40, 41, 42];

async function fetchRealEventsFromPyramid() {
  console.log(`🔍 Connecting to ${PYRAMID_RELAY}...`);
  
  const pool = new SimplePool();
  const realEvents = {};
  
  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // First, let's test if pyramid has ANY events at all
    console.log('🔍 Testing if pyramid has any events...');
    let hasAnyEvents = false;
    
    try {
      const testEvents = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Test timeout')), 10000);
        let foundAny = [];
        
        const sub = pool.subscribeMany([PYRAMID_RELAY], [{ limit: 5 }], {
          onevent: (event) => {
            console.log(`   📩 Found event kind ${event.kind}: ${event.id.substring(0, 8)}...`);
            foundAny.push(event);
            hasAnyEvents = true;
          },
          oneose: () => {
            clearTimeout(timeout);
            sub.close();
            resolve(foundAny);
          }
        });
      });
      
      if (hasAnyEvents) {
        console.log(`✅ Pyramid relay has events! Found ${testEvents.length} in test query`);
      } else {
        console.log('❌ Pyramid relay appears to have no events');
      }
    } catch (error) {
      console.log('❌ Test query failed:', error.message);
    }
    
    // Try different search strategies
    const searchStrategies = [
      // Strategy 1: Recent events (wider time range)
      { since: Math.floor(Date.now() / 1000) - (90 * 24 * 60 * 60), name: "last 90 days" },
      // Strategy 2: Any time, small limit
      { limit: 20, name: "any time (small)" },
      // Strategy 3: Any time, larger limit  
      { limit: 100, name: "any time (larger)" },
      // Strategy 4: No filters except kind
      { name: "no time filter" }
    ];
    
    for (const kind of EVENT_KINDS) {
      try {
        console.log(`📡 Searching for kind ${kind} events on pyramid relay...`);
        
        let foundEvents = [];
        
        for (const strategy of searchStrategies) {
          if (foundEvents.length > 0) break; // Skip other strategies if we found events
          
          const filters = { 
            kinds: [kind], 
            ...strategy
          };
          
          try {
            console.log(`   Trying strategy: ${strategy.name} with filter:`, JSON.stringify(filters));
            
            // Use subscription-based approach with timeout
            const events = await new Promise((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error(`Timeout after 15s for strategy: ${strategy.name}`));
              }, 15000);

              const sub = pool.subscribeMany([PYRAMID_RELAY], [filters], {
                onevent: (event) => {
                  console.log(`   📩 Received event ${event.id.substring(0, 8)}... (kind ${event.kind})`);
                  foundEvents.push(event);
                },
                oneose: () => {
                  clearTimeout(timeout);
                  console.log(`   🏁 EOSE received for strategy: ${strategy.name}, found ${foundEvents.length} events`);
                  sub.close();
                  resolve(foundEvents);
                },
                onclose: () => {
                  clearTimeout(timeout);
                  resolve(foundEvents);
                }
              });
            });
            
            if (foundEvents.length > 0) {
              console.log(`   Found ${foundEvents.length} events with strategy: ${strategy.name}`);
              break;
            } else {
              console.log(`   Strategy "${strategy.name}" returned 0 events`);
            }
          } catch (error) {
            console.log(`   Strategy "${strategy.name}" failed: ${error.message}`);
          }
        }
        
        const events = foundEvents;
          
        console.log(`   Found ${events ? events.length : 0} raw events`);
        
        if (events && events.length > 0) {
          // Verify events are actually valid
          const validEvents = [];
          
          for (const event of events) {
            try {
              const isValid = verifyEvent(event);
              if (isValid) {
                validEvents.push(event);
                console.log(`   ✅ Valid event: ${event.id.substring(0, 8)}... (kind ${event.kind})`);
              } else {
                console.log(`   ❌ Invalid event: ${event.id.substring(0, 8)}...`);
              }
            } catch (error) {
              console.log(`   ❌ Event verification failed: ${error.message}`);
            }
          }
          
          if (validEvents.length > 0) {
            realEvents[kind] = validEvents.slice(0, 3); // Keep only first 3 valid events
            console.log(`✅ Found ${validEvents.length} valid events for kind ${kind}`);
          } else {
            console.log(`⚠️  Found ${events.length} events for kind ${kind} but none were valid`);
          }
        } else {
          console.log(`❌ No events found for kind ${kind} on pyramid relay`);
        }
      } catch (error) {
        console.log(`⚠️  Error searching kind ${kind}: ${error.message}`);
      }
      
      // Be respectful to the relay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Save only real events found on pyramid relay
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'pyramid-events.json'),
      JSON.stringify(realEvents, null, 2)
    );
    
    // Update the TypeScript data file with ONLY real pyramid events
    await updateTypeScriptDataFile(realEvents);
    
    const totalEvents = Object.values(realEvents).reduce((sum, events) => sum + events.length, 0);
    console.log(`🎉 Successfully collected ${totalEvents} REAL events from pyramid relay`);
    console.log(`📊 Event kinds found: ${Object.keys(realEvents).join(', ')}`);
    console.log(`📂 Events saved to: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Error connecting to pyramid relay:', error);
    
    // If we can't connect to pyramid, create empty data file
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'pyramid-events.json'),
      JSON.stringify({}, null, 2)
    );
    
    await updateTypeScriptDataFile({});
    console.log('⚠️  No events collected - pyramid relay unavailable');
    
  } finally {
    pool.close([PYRAMID_RELAY]);
  }
}

async function updateTypeScriptDataFile(realEvents) {
  console.log('📝 Updating TypeScript data file with REAL pyramid events...');
  
  const dataFileContent = `// This file contains ONLY real events from pyramid.fiatjaf.com relay
// NO synthetic or generated events - only authentic Nostr data
export const eventsData: { [key: string]: any[] } = ${JSON.stringify(realEvents, null, 2)};`;
  
  await fs.writeFile(
    path.join(__dirname, '..', 'src', 'data', 'eventsData.ts'),
    dataFileContent
  );
  
  console.log('✅ Updated eventsData.ts with real pyramid events only');
}

// Run the script
fetchRealEventsFromPyramid().catch(console.error);