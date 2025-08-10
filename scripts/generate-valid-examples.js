const { generateSecretKey, getPublicKey, finalizeEvent, verifyEvent } = require('nostr-tools');
const fs = require('fs').promises;
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data', 'events');

async function generateValidExamples() {
  console.log('🔨 Generating valid example events...');
  
  // Create test secret keys
  const sk1 = generateSecretKey();
  const pk1 = getPublicKey(sk1);
  
  const sk2 = generateSecretKey();
  const pk2 = getPublicKey(sk2);
  
  const now = Math.floor(Date.now() / 1000);
  
  const validEvents = {};
  
  // Kind 0: User Metadata
  const metadataEvent = finalizeEvent({
    kind: 0,
    tags: [],
    content: JSON.stringify({
      name: "Alice Developer",
      about: "Building the future of decentralized social networks with Nostr 🚀",
      picture: "https://example.com/alice.jpg",
      nip05: "alice@example.com",
      website: "https://alice.dev"
    }),
    created_at: now - 3600
  }, sk1);
  
  console.log('✓ Kind 0 event valid:', verifyEvent(metadataEvent));
  validEvents['0'] = [metadataEvent];
  
  // Kind 1: Text Note
  const textNote1 = finalizeEvent({
    kind: 1,
    tags: [['t', 'nostr'], ['t', 'decentralized']],
    content: "GM! Just published my first app on Nostr. The decentralized future is here! 🚀 #nostr #decentralized",
    created_at: now - 1800
  }, sk1);
  
  const textNote2 = finalizeEvent({
    kind: 1,
    tags: [['t', 'bitcoin'], ['t', 'nostr']],
    content: "Bitcoin and Nostr are the perfect combination for financial and communication sovereignty! 💜⚡",
    created_at: now - 900
  }, sk2);
  
  console.log('✓ Kind 1 events valid:', verifyEvent(textNote1), verifyEvent(textNote2));
  validEvents['1'] = [textNote1, textNote2];
  
  // Kind 3: Contact List
  const sk3 = generateSecretKey();
  const pk3 = getPublicKey(sk3);
  const sk4 = generateSecretKey();
  const pk4 = getPublicKey(sk4);
  
  const contactList = finalizeEvent({
    kind: 3,
    tags: [
      ['p', pk2, 'wss://relay.damus.io/', 'Alice'],
      ['p', pk3, 'wss://nos.lol/', 'Bob'],
      ['p', pk4, 'wss://relay.nostr.band/', 'Carol']
    ],
    content: "",
    created_at: now - 7200
  }, sk1);
  
  console.log('✓ Kind 3 event valid:', verifyEvent(contactList));
  validEvents['3'] = [contactList];
  
  // Kind 6: Repost
  const repost = finalizeEvent({
    kind: 6,
    tags: [
      ['e', textNote1.id],
      ['p', pk1]
    ],
    content: JSON.stringify(textNote1),
    created_at: now - 600
  }, sk2);
  
  console.log('✓ Kind 6 event valid:', verifyEvent(repost));
  validEvents['6'] = [repost];
  
  // Kind 7: Reaction
  const reaction1 = finalizeEvent({
    kind: 7,
    tags: [
      ['e', textNote1.id],
      ['p', pk1]
    ],
    content: "🚀",
    created_at: now - 300
  }, sk2);
  
  const reaction2 = finalizeEvent({
    kind: 7,
    tags: [
      ['e', textNote2.id],
      ['p', pk2]
    ],
    content: "+",
    created_at: now - 150
  }, sk1);
  
  console.log('✓ Kind 7 events valid:', verifyEvent(reaction1), verifyEvent(reaction2));
  validEvents['7'] = [reaction1, reaction2];
  
  // Kind 30023: Long-form Content
  const article = finalizeEvent({
    kind: 30023,
    tags: [
      ['d', 'understanding-nostr-guide'],
      ['title', 'Understanding Nostr: A Beginner\'s Guide'],
      ['published_at', (now - 86400).toString()],
      ['t', 'nostr'],
      ['t', 'guide'],
      ['t', 'beginners']
    ],
    content: "# Understanding Nostr: A Beginner's Guide\\n\\nNostr (Notes and Other Stuff Transmitted by Relays) is a simple, open protocol that enables a truly censorship-resistant and global social network.\\n\\n## What makes Nostr special?\\n\\n1. **Decentralized**: No single point of control\\n2. **Censorship-resistant**: Content lives on multiple relays\\n3. **Identity-based**: Your identity is your cryptographic key pair\\n4. **Interoperable**: Works across different clients and applications\\n\\n## Getting Started\\n\\nTo start using Nostr, you'll need:\\n- A Nostr client (like Damus, Amethyst, or Nostrudel)\\n- A key pair (most clients generate this for you)\\n- Access to Nostr relays\\n\\nWelcome to the future of social media! 🚀",
    created_at: now - 86400
  }, sk1);
  
  console.log('✓ Kind 30023 event valid:', verifyEvent(article));
  validEvents['30023'] = [article];
  
  // Save all events
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'all-events.json'),
    JSON.stringify(validEvents, null, 2)
  );
  
  // Update TypeScript data file
  const dataFileContent = `// This file contains valid example Nostr events generated with nostr-tools
// These events have proper signatures and are structurally correct
export const eventsData: { [key: string]: any[] } = ${JSON.stringify(validEvents, null, 2)};`;
  
  await fs.writeFile(
    path.join(__dirname, '..', 'src', 'data', 'eventsData.ts'),
    dataFileContent
  );
  
  console.log(`🎉 Generated ${Object.keys(validEvents).length} valid event kinds`);
  console.log(`📂 Events saved to: ${OUTPUT_DIR}`);
  console.log('✅ All events verified as valid');
}

generateValidExamples().catch(console.error);