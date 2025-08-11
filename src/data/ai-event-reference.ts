/**
 * AI-Optimized Nostr Event Reference
 * 
 * This file provides a comprehensive, machine-readable reference for AI agents
 * to understand and implement Nostr event kinds. It consolidates event definitions,
 * implementation patterns, and real-world usage examples.
 */

import { EventKind, NostrEvent } from '@/types';

export interface AIEventReference {
  kind: number;
  name: string;
  description: string;
  nip: string;
  category: 'regular' | 'replaceable' | 'ephemeral' | 'addressable';
  
  // Enhanced AI-friendly fields
  summary: string; // One-line summary for quick understanding
  useCases: string[]; // Common use cases
  implementationNotes: string[]; // Important implementation details
  commonGotchas: string[]; // Common mistakes to avoid
  
  // Schema definitions
  requiredTags: TagSchema[];
  optionalTags: TagSchema[];
  contentSchema?: {
    type: 'text' | 'json' | 'empty' | 'encrypted';
    description: string;
    examples?: string[];
  };
  
  // Implementation examples
  basicExample: CodeExample;
  advancedExamples?: CodeExample[];
  
  // Relationships
  relatedKinds?: number[]; // Related event kinds
  supersedes?: number[]; // Event kinds this replaces
  supersededBy?: number[]; // Event kinds that replace this
}

export interface TagSchema {
  name: string;
  description: string;
  format?: string; // e.g., "hex pubkey", "unix timestamp", "url"
  examples?: string[];
  validation?: string; // Regex pattern or validation rule
}

export interface CodeExample {
  library: 'ndk' | 'nostr-tools' | 'generic';
  title: string;
  description: string;
  code: string;
  notes?: string[];
}

// Comprehensive AI Event Reference Database
export const aiEventReference: AIEventReference[] = [
  {
    kind: 0,
    name: 'User Metadata',
    description: 'Replaceable event containing user profile metadata as a stringified JSON object with name, about, and picture fields.',
    nip: 'NIP-01',
    category: 'replaceable',
    summary: 'User profile data (name, bio, picture) stored as JSON in content',
    
    useCases: [
      'Setting up user profile',
      'Updating profile information',
      'Displaying user cards in clients'
    ],
    
    implementationNotes: [
      'Content must be valid JSON',
      'This event type is replaceable - newer events override older ones',
      'Profile data is public and cached by relays',
      'Standard fields: name, about, picture, nip05, website, banner'
    ],
    
    commonGotchas: [
      'Forgetting to JSON.stringify the profile object',
      'Including private data in public profile',
      'Not validating JSON structure before publishing'
    ],
    
    requiredTags: [],
    optionalTags: [],
    
    contentSchema: {
      type: 'json',
      description: 'JSON object with profile fields',
      examples: [
        '{"name":"Alice","about":"Bitcoin enthusiast","picture":"https://example.com/alice.jpg"}',
        '{"name":"Bob","about":"Nostr developer","website":"https://bob.dev","nip05":"bob@example.com"}'
      ]
    },
    
    basicExample: {
      library: 'ndk',
      title: 'Basic Profile Update',
      description: 'Update user profile with NDK',
      code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.damus.io'],
  signer: new NDKNip07Signer()
})

await ndk.connect()

const profileData = {
  name: "Alice",
  about: "Bitcoin enthusiast", 
  picture: "https://example.com/alice.jpg"
}

const event = new NDKEvent(ndk, {
  kind: 0,
  content: JSON.stringify(profileData),
  tags: []
})

await event.publish()`
    },
    
    relatedKinds: [3, 10002] // Follows, Relay List
  },

  {
    kind: 1,
    name: 'Short Text Note',
    description: 'Regular event representing the fundamental building block of Nostr, containing short-form text content like social media posts.',
    nip: 'NIP-01',
    category: 'regular',
    summary: 'Basic text post - the main content type on Nostr',
    
    useCases: [
      'Social media posts',
      'Status updates',
      'Short messages and thoughts',
      'Replies to other notes'
    ],
    
    implementationNotes: [
      'Content is plain text (supports mentions and hashtags)',
      'Use e tags to reference other events (replies)',
      'Use p tags to mention users',
      'Use t tags for hashtags'
    ],
    
    commonGotchas: [
      'Not including proper e/p tags for replies',
      'Exceeding reasonable length limits (varies by client)',
      'Forgetting to handle mentions and hashtags properly'
    ],
    
    requiredTags: [],
    optionalTags: [
      {
        name: 'e',
        description: 'Reference to another event (for replies/mentions)',
        format: 'hex event id',
        examples: ['["e", "abc123...", "wss://relay.example.com"]']
      },
      {
        name: 'p', 
        description: 'Mention of a pubkey',
        format: 'hex pubkey',
        examples: ['["p", "def456..."]']
      },
      {
        name: 't',
        description: 'Hashtag',
        format: 'lowercase string',
        examples: ['["t", "bitcoin"]', '["t", "nostr"]']
      }
    ],
    
    contentSchema: {
      type: 'text',
      description: 'Plain text content with optional nostr: references',
      examples: [
        'Hello Nostr! 👋',
        'GM everyone! #nostr #bitcoin',
        'Great post! nostr:note1abc123...'
      ]
    },
    
    basicExample: {
      library: 'ndk',
      title: 'Basic Text Note',
      description: 'Publish a simple text note',
      code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.damus.io'],
  signer: new NDKNip07Signer()
})

await ndk.connect()

const event = new NDKEvent(ndk, {
  kind: 1,
  content: "Hello Nostr! 👋",
  tags: [
    ['t', 'nostr'],
    ['t', 'introduction']
  ]
})

await event.publish()`
    },
    
    advancedExamples: [
      {
        library: 'ndk',
        title: 'Reply with Mentions',
        description: 'Reply to an event with user mentions',
        code: `const replyEvent = new NDKEvent(ndk, {
  kind: 1,
  content: "Great point! Thanks for sharing nostr:npub1abc...",
  tags: [
    ['e', originalEventId, 'wss://relay.damus.io', 'reply'],
    ['p', originalAuthorPubkey],
    ['p', mentionedUserPubkey]
  ]
})

await replyEvent.publish()`
      }
    ],
    
    relatedKinds: [6, 7, 16] // Repost, Reaction, Generic Repost
  },

  {
    kind: 3,
    name: 'Follows',
    description: 'Replaceable contact list event containing p tags for followed pubkeys with optional relay hints and local petnames.',
    nip: 'NIP-02',
    category: 'replaceable',
    summary: 'User\'s follow list - who they follow on Nostr',
    
    useCases: [
      'Managing follow list',
      'Social graph discovery',
      'Feed curation',
      'Contact list backup'
    ],
    
    implementationNotes: [
      'Each followed user gets a p tag: ["p", pubkey, relay, petname]',
      'Content typically empty or contains additional metadata',
      'Replaceable event - newer versions override older ones',
      'Relay hints help with discovery'
    ],
    
    commonGotchas: [
      'Not including relay hints (reduces discoverability)',
      'Malformed p tag structure',
      'Including private information in petnames'
    ],
    
    requiredTags: [
      {
        name: 'p',
        description: 'Followed pubkey with optional relay and petname',
        format: '["p", "hex_pubkey", "relay_url", "petname"]',
        examples: [
          '["p", "abc123...", "wss://relay.damus.io", "alice"]',
          '["p", "def456...", "", "bob"]'
        ]
      }
    ],
    optionalTags: [],
    
    contentSchema: {
      type: 'empty',
      description: 'Usually empty, may contain additional metadata'
    },
    
    basicExample: {
      library: 'ndk',
      title: 'Update Follow List',
      description: 'Manage your follow list with NDK',
      code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.damus.io'],
  signer: new NDKNip07Signer()
})

await ndk.connect()

const followList = [
  ['p', 'abc123...', 'wss://relay.damus.io', 'alice'],
  ['p', 'def456...', 'wss://nos.lol', 'bob']
]

const event = new NDKEvent(ndk, {
  kind: 3,
  content: "",
  tags: followList
})

await event.publish()`
    },
    
    relatedKinds: [0, 10000, 10002] // User Metadata, Mute List, Relay List
  },

  {
    kind: 7,
    name: 'Reaction',
    description: 'Reaction event with content "+" for like, "-" for dislike, or emoji, targeting another event via e and p tags.',
    nip: 'NIP-25',
    category: 'regular',
    summary: 'Like, dislike, or emoji reaction to events',
    
    useCases: [
      'Liking posts (+ or empty content)',
      'Disliking posts (- content)',
      'Emoji reactions (🔥, ❤️, etc.)',
      'Engagement metrics'
    ],
    
    implementationNotes: [
      'Content: "+" or empty = like, "-" = dislike, emoji = custom reaction',
      'Must include e tag referencing target event',
      'Should include p tag for event author',
      'k tag indicates kind of event being reacted to'
    ],
    
    commonGotchas: [
      'Missing required e and p tags',
      'Not handling duplicate reactions properly',
      'Using non-standard reaction content formats'
    ],
    
    requiredTags: [
      {
        name: 'e',
        description: 'Event being reacted to',
        format: 'hex event id with optional relay hint',
        examples: ['["e", "abc123...", "wss://relay.damus.io"]']
      },
      {
        name: 'p',
        description: 'Pubkey of event author being reacted to',
        format: 'hex pubkey',
        examples: ['["p", "def456..."]']
      }
    ],
    
    optionalTags: [
      {
        name: 'k',
        description: 'Kind of event being reacted to',
        format: 'event kind number as string',
        examples: ['["k", "1"]']
      }
    ],
    
    contentSchema: {
      type: 'text',
      description: 'Reaction indicator: "+", "-", or emoji',
      examples: ['+', '-', '🔥', '❤️', '🚀', '👍']
    },
    
    basicExample: {
      library: 'ndk',
      title: 'Like a Post',
      description: 'React to an event with a like',
      code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.damus.io'],
  signer: new NDKNip07Signer()
})

await ndk.connect()

const event = new NDKEvent(ndk, {
  kind: 7,
  content: "+", // Like reaction
  tags: [
    ['e', targetEventId, 'wss://relay.damus.io'],
    ['p', targetAuthorPubkey],
    ['k', '1'] // Reacting to a text note
  ]
})

await event.publish()`
    },
    
    advancedExamples: [
      {
        library: 'ndk',
        title: 'Custom Emoji Reaction',
        description: 'React with custom emoji',
        code: `const reactionEvent = new NDKEvent(ndk, {
  kind: 7,
  content: "🔥", // Fire emoji reaction
  tags: [
    ['e', targetEventId],
    ['p', targetAuthorPubkey],
    ['k', '1']
  ]
})

await reactionEvent.publish()`
      }
    ],
    
    relatedKinds: [1, 6, 16] // Text Note, Repost, Generic Repost
  },

  {
    kind: 30023,
    name: 'Long-form Content',
    description: 'Addressable event for long-form Markdown content like articles and blog posts with optional metadata tags.',
    nip: 'NIP-23',
    category: 'addressable',
    summary: 'Long-form articles and blog posts with Markdown support',
    
    useCases: [
      'Blog posts and articles',
      'Documentation and guides',
      'Long-form content publishing',
      'Censorship-resistant publishing'
    ],
    
    implementationNotes: [
      'Content is Markdown formatted text',
      'd tag provides unique identifier for replaceability',
      'title, published_at, and summary tags provide metadata',
      'Addressable via coordinate: kind:pubkey:identifier',
      'Supports image, hashtag, and reference tags'
    ],
    
    commonGotchas: [
      'Missing required d tag identifier',
      'Not handling Markdown rendering properly',
      'Forgetting to set published_at timestamp',
      'Overwriting articles with same d tag accidentally'
    ],
    
    requiredTags: [
      {
        name: 'd',
        description: 'Unique identifier for this article (enables replaceability)',
        format: 'unique string identifier',
        examples: ['["d", "my-first-article"]', '["d", "bitcoin-guide-2024"]']
      }
    ],
    
    optionalTags: [
      {
        name: 'title',
        description: 'Article title',
        format: 'text string',
        examples: ['["title", "My First Nostr Article"]']
      },
      {
        name: 'published_at',
        description: 'Publication timestamp',
        format: 'unix timestamp as string',
        examples: ['["published_at", "1703980800"]']
      },
      {
        name: 'summary',
        description: 'Article summary/description',
        format: 'text string',
        examples: ['["summary", "An introduction to Nostr development"]']
      },
      {
        name: 'image',
        description: 'Cover image URL',
        format: 'URL string',
        examples: ['["image", "https://example.com/cover.jpg"]']
      },
      {
        name: 't',
        description: 'Hashtag/topic',
        format: 'lowercase string',
        examples: ['["t", "nostr"]', '["t", "bitcoin"]']
      }
    ],
    
    contentSchema: {
      type: 'text',
      description: 'Markdown formatted long-form content',
      examples: [
        '# My Article\n\nThis is **bold** text with [links](https://example.com).',
        '## Introduction\n\nLong-form content on Nostr enables censorship-resistant publishing.\n\n### Features\n\n- Markdown support\n- Addressable events\n- Rich metadata'
      ]
    },
    
    basicExample: {
      library: 'ndk',
      title: 'Publish Article',
      description: 'Publish a long-form article with metadata',
      code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.damus.io'],
  signer: new NDKNip07Signer()
})

await ndk.connect()

const articleContent = \`# My First Nostr Article

This is a **long-form article** published on Nostr using kind 30023.

## Features

- Markdown formatting
- Addressable events  
- Rich metadata support

You can reference other events: nostr:note1abc123...\`

const event = new NDKEvent(ndk, {
  kind: 30023,
  content: articleContent,
  tags: [
    ['d', 'my-first-article-' + Date.now()], // Required unique ID
    ['title', 'My First Nostr Article'],
    ['published_at', Math.floor(Date.now() / 1000).toString()],
    ['summary', 'Introduction to long-form content on Nostr'],
    ['t', 'nostr'],
    ['t', 'article']
  ]
})

await event.publish()`
    },
    
    relatedKinds: [1, 30024] // Text Note, Draft Long-form Content
  }
];

// Utility functions for AI agents
export function getEventByKind(kind: number): AIEventReference | undefined {
  return aiEventReference.find(ref => ref.kind === kind);
}

export function searchEventsByUsage(query: string): AIEventReference[] {
  const searchTerm = query.toLowerCase();
  return aiEventReference.filter(ref => 
    ref.useCases.some(useCase => useCase.toLowerCase().includes(searchTerm)) ||
    ref.summary.toLowerCase().includes(searchTerm) ||
    ref.name.toLowerCase().includes(searchTerm)
  );
}

export function getEventsByCategory(category: 'regular' | 'replaceable' | 'ephemeral' | 'addressable'): AIEventReference[] {
  return aiEventReference.filter(ref => ref.category === category);
}

export function getRelatedEvents(kind: number): AIEventReference[] {
  const event = getEventByKind(kind);
  if (!event?.relatedKinds) return [];
  
  return aiEventReference.filter(ref => 
    event.relatedKinds!.includes(ref.kind)
  );
}

export function getAllImplementationNotes(): Array<{kind: number, name: string, notes: string[]}> {
  return aiEventReference.map(ref => ({
    kind: ref.kind,
    name: ref.name,
    notes: ref.implementationNotes
  }));
}

export function getCommonGotchas(): Array<{kind: number, name: string, gotchas: string[]}> {
  return aiEventReference.map(ref => ({
    kind: ref.kind,
    name: ref.name, 
    gotchas: ref.commonGotchas
  }));
}