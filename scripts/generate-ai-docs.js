#!/usr/bin/env node

/**
 * Script to generate AI-friendly documentation from the event reference data
 * This can be run to update the JSON documentation when event data changes
 */

const fs = require('fs');
const path = require('path');

// Import the actual event data by requiring the compiled JS or using ts-node
async function loadEventData() {
  try {
    // Try to use ts-node to directly import TypeScript
    require('ts-node/register');
    
    // Get both the main event kinds and the AI-enhanced reference
    const { eventKinds } = require('../src/data/eventKinds.ts');
    const { aiEventReference } = require('../src/data/ai-event-reference.ts');
    
    // Create a map of AI-enhanced data
    const aiMap = new Map();
    aiEventReference.forEach(ai => {
      aiMap.set(ai.kind, ai);
    });
    
    // Merge the data: use eventKinds as base, enhance with AI data where available
    const mergedData = eventKinds.map(event => {
      const aiData = aiMap.get(event.kind);
      
      // Generate enhanced data for ALL events
      const enhancedEvent = {
        kind: event.kind,
        name: event.name,
        description: event.description,
        summary: aiData?.summary || generateSummary(event),
        nip: event.nip,
        category: aiData?.category || event.category || 'regular',
        useCases: aiData?.useCases || generateUseCases(event),
        implementationNotes: aiData?.implementationNotes || generateImplementationNotes(event),
        commonGotchas: aiData?.commonGotchas || generateCommonGotchas(event),
        requiredTags: aiData?.requiredTags || extractRequiredTags(event),
        optionalTags: aiData?.optionalTags || extractOptionalTags(event),
        contentSchema: aiData?.contentSchema || generateContentSchema(event),
        basicExample: aiData?.basicExample || generateBasicExample(event),
        advancedExamples: aiData?.advancedExamples,
        relatedKinds: aiData?.relatedKinds || generateRelatedKinds(event)
      };
      
      return enhancedEvent;
    });
    
    return mergedData;
  } catch (error) {
    console.log('ts-node not available, trying alternative method...', error.message);
    // Fallback: try to import from a built version or use static data
    return getStaticEventData();
  }
}

function getStaticEventData() {
  // Fallback static data - this should be updated to match actual data
  console.warn('Using fallback static data - install ts-node for complete data');
  return [
    {
      kind: 0,
      name: "Metadata",
      description: "User profile metadata",
      summary: "User profile metadata (JSON)",
      nip: "NIP-01",
      category: "replaceable",
      useCases: ["User profiles", "Identity verification"],
      implementationNotes: ["Content must be valid JSON", "Commonly used fields: name, about, picture"],
      commonGotchas: ["Invalid JSON will cause parsing errors"],
      requiredTags: [],
      optionalTags: [],
      contentSchema: { type: "json", description: "User metadata as JSON" },
      basicExample: { code: "Basic profile example" },
      relatedKinds: [3]
    },
    // Add more static data as needed...
  ];
}

// Helper functions to generate enhanced AI data for all events
function generateSummary(event) {
  // Create a concise summary from the description
  const desc = event.description;
  if (desc.length <= 60) return desc;
  
  // Extract key phrases and create a shorter summary
  if (desc.includes('Replaceable')) return `Replaceable ${event.name.toLowerCase()} event`;
  if (desc.includes('Addressable')) return `Addressable ${event.name.toLowerCase()} event`;
  if (desc.includes('Deprecated')) return `Deprecated ${event.name.toLowerCase()} event`;
  if (desc.includes('message') || desc.includes('Message')) return `${event.name} for messaging`;
  if (desc.includes('list') || desc.includes('List')) return `${event.name} for list management`;
  
  // Default: take first sentence or 60 chars
  const firstSentence = desc.split('.')[0];
  return firstSentence.length <= 60 ? firstSentence : desc.substring(0, 57) + '...';
}

function generateUseCases(event) {
  const useCases = [];
  const name = event.name.toLowerCase();
  const desc = event.description.toLowerCase();
  
  // Generate use cases based on event type and description
  if (name.includes('metadata') || name.includes('profile')) {
    useCases.push('User profile management', 'Identity verification', 'Social discovery');
  } else if (name.includes('message') || name.includes('chat')) {
    useCases.push('Private communication', 'Group discussions', 'Real-time messaging');
  } else if (name.includes('list') || desc.includes('list')) {
    useCases.push('Data organization', 'User preferences', 'Content curation');
  } else if (name.includes('reaction') || name.includes('like')) {
    useCases.push('Social engagement', 'Content feedback', 'User interaction');
  } else if (name.includes('event') && desc.includes('calendar')) {
    useCases.push('Event planning', 'Schedule management', 'Social coordination');
  } else if (desc.includes('delete') || desc.includes('removal')) {
    useCases.push('Content moderation', 'Privacy protection', 'Error correction');
  } else if (desc.includes('badge') || desc.includes('award')) {
    useCases.push('Recognition systems', 'Achievements', 'Community rewards');
  } else if (desc.includes('file') || desc.includes('media')) {
    useCases.push('Media sharing', 'File distribution', 'Content storage');
  } else if (desc.includes('report') || desc.includes('reporting')) {
    useCases.push('Content moderation', 'Community safety', 'Abuse reporting');
  } else if (desc.includes('payment') || desc.includes('zap')) {
    useCases.push('Micropayments', 'Content monetization', 'Value for value');
  } else {
    // Default use cases
    useCases.push(`${event.name} functionality`, 'Protocol compliance', 'Client integration');
  }
  
  return useCases.slice(0, 4); // Limit to 4 use cases
}

function generateImplementationNotes(event) {
  const notes = [];
  const category = event.category;
  const desc = event.description;
  
  // Category-specific notes
  if (category === 'replaceable') {
    notes.push('This is a replaceable event - newer events override older ones');
    notes.push('Only the most recent event of this kind per pubkey is kept');
  } else if (category === 'addressable') {
    notes.push('This is an addressable event - use a unique d tag identifier');
    notes.push('Addressable via coordinate: kind:pubkey:d_tag_value');
  } else if (category === 'ephemeral') {
    notes.push('This is an ephemeral event - not stored long-term by relays');
    notes.push('Intended for real-time communication only');
  }
  
  // Content-specific notes
  if (desc.includes('JSON')) {
    notes.push('Content must be valid JSON');
    notes.push('Validate JSON.parse() before publishing');
  } else if (desc.includes('Markdown')) {
    notes.push('Content supports Markdown formatting');
    notes.push('Ensure proper Markdown rendering in clients');
  } else if (desc.includes('encrypted')) {
    notes.push('Content is encrypted for privacy');
    notes.push('Requires proper key management');
  }
  
  // Tag-specific notes
  if (event.tags && event.tags.length > 0) {
    const requiredTags = event.tags.filter(tag => tag.required);
    const optionalTags = event.tags.filter(tag => !tag.required);
    
    if (requiredTags.length > 0) {
      notes.push(`Required tags: ${requiredTags.map(t => t.name).join(', ')}`);
    }
    if (optionalTags.length > 0) {
      notes.push(`Optional tags: ${optionalTags.map(t => t.name).join(', ')}`);
    }
  }
  
  // Deprecation warning
  if (desc.includes('Deprecated') || desc.includes('deprecated')) {
    notes.push('⚠️ This event type is deprecated - avoid using in new applications');
  }
  
  return notes.length > 0 ? notes : [`Implement according to ${event.nip} specification`, 'Follow standard Nostr event structure'];
}

function generateCommonGotchas(event) {
  const gotchas = [];
  const desc = event.description;
  const category = event.category;
  
  // Category-specific gotchas
  if (category === 'replaceable') {
    gotchas.push('Not understanding that newer events replace older ones');
    gotchas.push('Publishing multiple events without intending replacement');
  } else if (category === 'addressable') {
    gotchas.push('Missing or duplicate d tag identifiers');
    gotchas.push('Not understanding coordinate-based addressing');
  }
  
  // Content-specific gotchas
  if (desc.includes('JSON')) {
    gotchas.push('Invalid JSON syntax causing parsing errors');
    gotchas.push('Not properly escaping JSON content');
  } else if (desc.includes('tag')) {
    gotchas.push('Malformed tag structure or missing required tags');
    gotchas.push('Incorrect tag ordering or format');
  }
  
  // Deprecation gotcha
  if (desc.includes('Deprecated') || desc.includes('deprecated')) {
    gotchas.push('Using deprecated event types in new applications');
  }
  
  // General gotchas
  gotchas.push('Not validating event structure before publishing');
  gotchas.push('Ignoring relay-specific requirements or limits');
  
  return gotchas.slice(0, 4); // Limit to 4 gotchas
}

function extractRequiredTags(event) {
  if (!event.tags) return [];
  
  return event.tags
    .filter(tag => tag.required)
    .map(tag => ({
      name: tag.name,
      description: tag.description,
      format: generateTagFormat(tag.name),
      examples: generateTagExamples(tag.name)
    }));
}

function extractOptionalTags(event) {
  if (!event.tags) return [];
  
  return event.tags
    .filter(tag => !tag.required)
    .map(tag => ({
      name: tag.name,
      description: tag.description,
      format: generateTagFormat(tag.name),
      examples: generateTagExamples(tag.name)
    }));
}

function generateTagFormat(tagName) {
  const formats = {
    'e': 'hex event id',
    'p': 'hex pubkey',
    'd': 'unique identifier string',
    't': 'lowercase hashtag',
    'r': 'URL string',
    'k': 'event kind number as string',
    'title': 'title text',
    'summary': 'description text',
    'published_at': 'unix timestamp as string',
    'image': 'image URL',
    'url': 'URL string',
    'name': 'name string',
    'description': 'description text'
  };
  
  return formats[tagName] || 'string value';
}

function generateTagExamples(tagName) {
  const examples = {
    'e': ['["e", "abc123..."]', '["e", "def456...", "wss://relay.example.com"]'],
    'p': ['["p", "pubkey123..."]'],
    'd': ['["d", "unique-identifier"]', '["d", "my-post-2024"]'],
    't': ['["t", "bitcoin"]', '["t", "nostr"]'],
    'r': ['["r", "https://example.com"]'],
    'k': ['["k", "1"]', '["k", "30023"]'],
    'title': ['["title", "My Article Title"]'],
    'summary': ['["summary", "Brief description"]'],
    'published_at': ['["published_at", "1703980800"]'],
    'image': ['["image", "https://example.com/image.jpg"]']
  };
  
  return examples[tagName] || [`["${tagName}", "example-value"]`];
}

function generateContentSchema(event) {
  const desc = event.description.toLowerCase();
  
  if (desc.includes('json')) {
    return {
      type: 'json',
      description: 'JSON object with structured data',
      examples: ['{"key": "value"}', '{"name": "Alice", "about": "Developer"}']
    };
  } else if (desc.includes('markdown')) {
    return {
      type: 'text',
      description: 'Markdown formatted text content',
      examples: ['# Heading\n\nParagraph with **bold** text', '## Introduction\n\nLong-form content...']
    };
  } else if (desc.includes('empty') || event.name.toLowerCase().includes('list')) {
    return {
      type: 'empty',
      description: 'Usually empty, metadata is in tags',
      examples: ['', 'Optional additional metadata']
    };
  } else if (desc.includes('encrypted')) {
    return {
      type: 'encrypted',
      description: 'Encrypted content for privacy',
      examples: ['<encrypted-data>']
    };
  } else {
    return {
      type: 'text',
      description: 'Plain text content',
      examples: [event.name === 'Short Text Note' ? 'Hello Nostr! 👋' : `${event.name} content`, 'Example text content']
    };
  }
}

function generateBasicExample(event) {
  const isAddressable = event.category === 'addressable';
  const isReplaceable = event.category === 'replaceable';
  const hasRequiredTags = event.tags && event.tags.some(tag => tag.required);
  
  let tags = '[]';
  let content = '""';
  
  // Generate appropriate content
  if (event.description.includes('JSON')) {
    content = 'JSON.stringify({name: "Alice", about: "Nostr user"})';
  } else if (event.name.includes('Note') || event.name.includes('Message')) {
    content = `"Hello from ${event.name}!"`;
  } else if (event.description.includes('Markdown')) {
    content = '"# Article Title\\n\\nContent here..."';
  }
  
  // Generate appropriate tags
  const tagParts = [];
  if (isAddressable) {
    tagParts.push("['d', 'unique-identifier']");
  }
  if (hasRequiredTags) {
    event.tags.filter(tag => tag.required).forEach(tag => {
      if (tag.name === 'p') tagParts.push("['p', 'target-pubkey']");
      else if (tag.name === 'e') tagParts.push("['e', 'target-event-id']");
      else tagParts.push(`['${tag.name}', 'value']`);
    });
  }
  if (tagParts.length > 0) {
    tags = `[\\n    ${tagParts.join(',\\n    ')}\\n  ]`;
  }
  
  return {
    library: 'ndk',
    title: `Create ${event.name}`,
    description: `Example of creating a ${event.name} event`,
    code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.damus.io'],
  signer: new NDKNip07Signer()
})

await ndk.connect()

const event = new NDKEvent(ndk, {
  kind: ${event.kind},
  content: ${content},
  tags: ${tags}
})

await event.publish()`
  };
}

function generateRelatedKinds(event) {
  const related = [];
  const kind = event.kind;
  const name = event.name.toLowerCase();
  const desc = event.description.toLowerCase();
  
  // Common relationships
  if (name.includes('metadata') || name.includes('profile')) {
    related.push(3); // Follows
  } else if (name.includes('note') || name.includes('text')) {
    related.push(6, 7, 16); // Repost, Reaction, Generic Repost
  } else if (name.includes('message')) {
    related.push(4, 14); // Other message types
  } else if (name.includes('list')) {
    related.push(10000, 10001, 10002); // Other list types
  } else if (desc.includes('calendar') || desc.includes('event')) {
    related.push(31922, 31923, 31924); // Calendar events
  }
  
  // Remove self-reference and limit to 5
  return related.filter(k => k !== kind).slice(0, 5);
}

async function generateAIDocs() {
  const eventData = await loadEventData();
  
  // Generate quick reference from actual event data
  const basicEvents = {};
  const categoryStats = { regular: 0, replaceable: 0, addressable: 0, ephemeral: 0 };
  
  eventData.forEach(event => {
    // Add important events to quick reference
    if ([0, 1, 3, 4, 5, 6, 7, 30023].includes(event.kind)) {
      basicEvents[event.kind.toString()] = event.summary || event.description;
    }
    
    // Count categories
    if (categoryStats.hasOwnProperty(event.category)) {
      categoryStats[event.category]++;
    }
  });
  
  // Generate complete event reference
  const completeReference = eventData.map(event => {
    const result = {
      kind: event.kind,
      name: event.name,
      description: event.description,
      summary: event.summary,
      nip: event.nip,
      category: event.category,
      useCases: event.useCases || [],
      implementationNotes: event.implementationNotes || [],
      commonGotchas: event.commonGotchas || [],
      requiredTags: event.requiredTags || [],
      optionalTags: event.optionalTags || [],
      contentSchema: event.contentSchema,
      basicExample: event.basicExample,
      advancedExamples: event.advancedExamples,
      relatedKinds: event.relatedKinds
    };
    
    return result;
  });

  const documentation = {
    metadata: {
      title: "AI-Optimized Nostr Event Reference",
      description: "Comprehensive machine-readable reference for AI agents to understand and implement Nostr event kinds",
      version: "1.0.0",
      generated: new Date().toISOString(),
      totalEventKinds: eventData.length,
      categoryBreakdown: categoryStats
    },
    
    // Complete event reference with all data
    eventReference: completeReference,
    
    quickReference: {
      basic_events: basicEvents,
      
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
  console.log(`📊 Documentation includes ${documentation.metadata.totalEventKinds} total event kinds`);
  console.log(`📋 Category breakdown:`, documentation.metadata.categoryBreakdown);
}

if (require.main === module) {
  generateAIDocs().catch(console.error);
}

module.exports = { generateAIDocs };