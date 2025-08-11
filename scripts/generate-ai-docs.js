#!/usr/bin/env node

/**
 * Script to generate AI-friendly documentation from the event reference data
 * This can be run to update the JSON documentation when event data changes
 */

const fs = require('fs');
const path = require('path');

// This would normally import from the TypeScript files, but for simplicity
// we'll generate a static version. In a real implementation, you'd compile
// the TS files or use a build process.

function generateAIDocs() {
  const documentation = {
    metadata: {
      title: "AI-Optimized Nostr Event Reference",
      description: "Comprehensive machine-readable reference for AI agents to understand and implement Nostr event kinds",
      version: "1.0.0",
      generated: new Date().toISOString(),
      totalEventKinds: 87 // Update based on actual count
    },
    
    quickReference: {
      basic_events: {
        "0": "User profile metadata (JSON)",
        "1": "Text notes and posts", 
        "3": "Follow lists (contact lists)",
        "4": "Encrypted direct messages (deprecated)",
        "5": "Event deletion requests",
        "6": "Reposts",
        "7": "Reactions (likes, dislikes, emojis)",
        "30023": "Long-form articles (Markdown)"
      },
      
      categories: {
        "regular": "Normal events that are stored and broadcast",
        "replaceable": "Latest event of this kind replaces older ones",
        "addressable": "Replaceable events with unique identifiers (d tag)",
        "ephemeral": "Temporary events not stored long-term"
      },
      
      common_tags: {
        "e": "Reference to another event (hex event ID)",
        "p": "Reference to a pubkey (hex public key)", 
        "d": "Unique identifier for addressable events",
        "t": "Hashtag or topic",
        "r": "URL reference",
        "k": "Event kind being referenced"
      }
    },
    
    implementationGuides: {
      gettingStarted: {
        title: "Quick Start Guide for AI Agents",
        steps: [
          "1. Import the appropriate Nostr library (NDK or nostr-tools)",
          "2. Set up relay connections and signer (NIP-07 for browser, private key for server)",
          "3. Choose the correct event kind for your use case",
          "4. Structure the event with required tags and content format",
          "5. Validate the event structure before publishing",
          "6. Handle errors and edge cases gracefully"
        ],
        libraries: {
          ndk: {
            name: "NDK (Nostr Development Kit)",
            description: "Higher-level TypeScript library with caching and advanced features",
            install: "npm install @nostr-dev-kit/ndk",
            quickStart: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.damus.io', 'wss://nos.lol'],
  signer: new NDKNip07Signer()
})

await ndk.connect()

const event = new NDKEvent(ndk, {
  kind: 1,
  content: "Hello Nostr!",
  tags: []
})

await event.publish()`
          },
          "nostr-tools": {
            name: "nostr-tools",
            description: "Lower-level JavaScript library for direct protocol interaction",
            install: "npm install nostr-tools",
            quickStart: `import { SimplePool, getPublicKey, finishEvent } from 'nostr-tools'

const pool = new SimplePool()
const relays = ['wss://relay.damus.io', 'wss://nos.lol']

const event = finishEvent({
  kind: 1,
  content: "Hello Nostr!",
  tags: [],
  created_at: Math.floor(Date.now() / 1000)
}, privateKey)

await Promise.all(pool.publish(relays, event))`
          }
        }
      },
      
      commonPatterns: {
        creating_events: "Always validate required tags and content schema before publishing",
        handling_replies: "Include proper e and p tags when replying to events",
        addressable_events: "Use unique d tag identifiers for replaceable content", 
        reactions: "Include both e (target event) and p (author) tags for reactions",
        mentions: "Use p tags to mention users, include in both tags and content with nostr: prefix",
        hashtags: "Use t tags for topics, content can include # prefix but tags should not"
      },
      
      validation_rules: {
        json_content: "Validate JSON.parse() for kinds that require JSON content (kind 0)",
        required_tags: "Check that all required tags are present before publishing",
        tag_format: "Ensure tags follow the correct format: [name, value, ...extras]",
        content_limits: "Be aware of reasonable content length limits for different event kinds",
        timestamps: "Use Unix timestamps (seconds since epoch), not milliseconds",
        hex_encoding: "Event IDs and pubkeys must be lowercase hex strings"
      }
    },
    
    troubleshooting: {
      common_errors: {
        invalid_json: "For kind 0 (profiles), ensure content is valid JSON string",
        missing_tags: "Check that required tags (e.g., 'd' for addressable events) are included",
        malformed_tags: "Tags must be arrays with string elements",
        signature_failures: "Ensure signer is properly configured and connected",
        relay_errors: "Try different relays if publishing fails",
        timestamp_issues: "Ensure created_at is a Unix timestamp in seconds"
      },
      
      debugging_tips: [
        "Use validateEventStructure() function to check event format before publishing",
        "Test with known-good relays first (wss://relay.damus.io, wss://nos.lol)", 
        "Check network connectivity and relay response times",
        "Verify event signatures and timestamps are correct",
        "Use browser dev tools to inspect WebSocket connections",
        "Check relay policies - some relays have specific requirements"
      ],
      
      testing_relays: [
        "wss://relay.damus.io",
        "wss://nos.lol", 
        "wss://relay.snort.social",
        "wss://pyramid.fiatjaf.com"
      ]
    },
    
    bestPractices: {
      relay_selection: "Use multiple relays for redundancy, include popular relays for discovery",
      event_validation: "Always validate event structure before publishing to avoid errors", 
      error_handling: "Implement proper error handling for network issues and relay rejections",
      content_sanitization: "Sanitize user input to prevent malicious content",
      private_data: "Never include private keys or sensitive data in event content",
      rate_limiting: "Respect relay rate limits to avoid being banned"
    }
  };

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'ai-documentation.json');
  fs.writeFileSync(outputPath, JSON.stringify(documentation, null, 2));
  
  console.log(`✅ AI documentation generated at: ${outputPath}`);
  console.log(`📊 Documentation includes ${Object.keys(documentation.quickReference.basic_events).length} event kinds`);
}

if (require.main === module) {
  generateAIDocs();
}

module.exports = { generateAIDocs };