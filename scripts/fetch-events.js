const { SimplePool, verifyEvent } = require('nostr-tools');
const fs = require('fs').promises;
const path = require('path');

const RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.nostr.band'
];
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data', 'events');

// Event kinds we want to collect examples for - starting with most common ones
const EVENT_KINDS = [1, 0, 3, 7, 6, 9735];

async function fetchEventsFromRelay() {
  console.log(`🔍 Connecting to relays: ${RELAYS.join(', ')}...`);
  
  const pool = new SimplePool();
  const allFoundEvents = new Map(); // kind -> events[]
  
  try {
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    for (const kind of EVENT_KINDS) {
      console.log(`📡 Fetching events for kind ${kind}...`);
      
      const filters = [{ 
        kinds: [kind], 
        limit: 5
        // Remove the 'since' filter to get any events, not just recent ones
      }];
      
      try {
        // Use Promise with timeout to avoid hanging
        const kindEvents = await Promise.race([
          pool.querySync(RELAYS, filters),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
        ]);
        
        console.log(`   Raw events received: ${kindEvents ? kindEvents.length : 0}`);
        
        if (kindEvents && kindEvents.length > 0) {
          // Verify events are actually valid
          const validEvents = kindEvents.filter(event => {
            try {
              return verifyEvent(event);
            } catch {
              return false;
            }
          }).slice(0, 3); // Take only first 3 valid events
          
          if (validEvents.length > 0) {
            // Anonymize sensitive data while keeping events valid
            const anonymizedEvents = validEvents.map(event => {
              const anonymized = { ...event };
              
              // For DMs, replace content but keep structure valid
              if (kind === 4) {
                anonymized.content = 'BASE64_ENCRYPTED_CONTENT_PLACEHOLDER';
              }
              // Partially anonymize pubkey but keep it valid hex
              anonymized.pubkey = event.pubkey.substring(0, 8) + '0'.repeat(56);
              
              return anonymized;
            });
            
            allFoundEvents.set(kind, anonymizedEvents);
            console.log(`✅ Found ${anonymizedEvents.length} valid events for kind ${kind}`);
            
            // Save individual kind file
            await fs.writeFile(
              path.join(OUTPUT_DIR, `kind-${kind}.json`),
              JSON.stringify(anonymizedEvents, null, 2)
            );
          } else {
            console.log(`⚠️  Found ${kindEvents.length} events for kind ${kind} but none were valid`);
          }
        } else {
          console.log(`❌ No events found for kind ${kind}`);
        }
      } catch (error) {
        console.log(`⚠️  Error fetching kind ${kind}:`, error.message);
      }
      
      // Small delay to be respectful to relays
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Save combined events file
    const allEvents = Object.fromEntries(allFoundEvents);
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'all-events.json'),
      JSON.stringify(allEvents, null, 2)
    );
    
    console.log(`🎉 Successfully collected events for ${allFoundEvents.size} event kinds`);
    console.log(`📂 Events saved to: ${OUTPUT_DIR}`);
    
    // Update the TypeScript data file with real events
    await updateTypeScriptDataFile(allEvents);
    
  } catch (error) {
    console.error('❌ Error fetching events:', error);
  } finally {
    pool.close(RELAYS);
  }
}

async function updateTypeScriptDataFile(realEvents) {
  console.log('📝 Updating TypeScript data file with real events...');
  
  const dataFileContent = `// This file contains real Nostr events fetched from relays
// Events are anonymized for privacy but maintain structural validity
export const eventsData: { [key: string]: any[] } = ${JSON.stringify(realEvents, null, 2)};`;
  
  await fs.writeFile(
    path.join(__dirname, '..', 'src', 'data', 'eventsData.ts'),
    dataFileContent
  );
  
  console.log('✅ Updated eventsData.ts with real events');
}

// Run the script
fetchEventsFromRelay().catch(console.error);