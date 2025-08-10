const { verifyEvent } = require('nostr-tools');
const eventsData = require('../src/data/events/all-events.json');

console.log('🔍 Verifying all events in eventsData...\n');

let totalEvents = 0;
let validEvents = 0;

for (const [kind, events] of Object.entries(eventsData)) {
  console.log(`📋 Kind ${kind}:`);
  
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    totalEvents++;
    
    try {
      const isValid = verifyEvent(event);
      if (isValid) {
        validEvents++;
        console.log(`  ✅ Event ${i + 1}: VALID`);
        console.log(`     ID: ${event.id}`);
        console.log(`     Pubkey: ${event.pubkey.substring(0, 16)}...`);
        console.log(`     Content preview: ${event.content.substring(0, 50)}${event.content.length > 50 ? '...' : ''}`);
      } else {
        console.log(`  ❌ Event ${i + 1}: INVALID`);
      }
    } catch (error) {
      console.log(`  ❌ Event ${i + 1}: INVALID (${error.message})`);
    }
  }
  console.log('');
}

console.log(`📊 Verification Summary:`);
console.log(`   Total events: ${totalEvents}`);
console.log(`   Valid events: ${validEvents}`);
console.log(`   Invalid events: ${totalEvents - validEvents}`);
console.log(`   Success rate: ${totalEvents > 0 ? Math.round((validEvents / totalEvents) * 100) : 0}%`);

if (validEvents === totalEvents) {
  console.log(`\n🎉 All events are valid! Ready for production.`);
} else {
  console.log(`\n⚠️  Some events are invalid and need to be fixed.`);
  process.exit(1);
}