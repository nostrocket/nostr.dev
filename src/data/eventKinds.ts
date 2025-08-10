import { EventKind } from '@/types';

export const eventKinds = [
  {
    kind: 0,
    name: 'User Metadata',
    description: 'User profile information including name, about, and picture',
    nip: 'NIP-01',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 1,
    name: 'Short Text Note',
    description: 'Short text note, the basic social media post',
    nip: 'NIP-01',
    category: 'regular',
    tags: []
  },
  {
    kind: 3,
    name: 'Follows',
    description: 'Contact list, follow list',
    nip: 'NIP-02',
    category: 'replaceable',
    tags: [
      { name: 'p', description: 'pubkey being followed', required: false }
    ]
  },
  {
    kind: 4,
    name: 'Encrypted Direct Messages',
    description: 'Encrypted direct message',
    nip: 'NIP-04',
    category: 'regular',
    tags: [
      { name: 'p', description: 'recipient pubkey', required: true }
    ]
  },
  {
    kind: 5,
    name: 'Event Deletion Request',
    description: 'Event deletion request',
    nip: 'NIP-09',
    category: 'regular',
    tags: [
      { name: 'e', description: 'event id to delete', required: true }
    ]
  },
  {
    kind: 6,
    name: 'Repost',
    description: 'Repost of another event',
    nip: 'NIP-18',
    category: 'regular',
    tags: [
      { name: 'e', description: 'event being reposted', required: true },
      { name: 'p', description: 'pubkey of reposted event', required: true }
    ]
  },
  {
    kind: 7,
    name: 'Reaction',
    description: 'Reaction to another event (like, dislike, emoji)',
    nip: 'NIP-25',
    category: 'regular',
    tags: [
      { name: 'e', description: 'event being reacted to', required: true },
      { name: 'p', description: 'pubkey of reacted event', required: true }
    ]
  },
  {
    kind: 8,
    name: 'Badge Award',
    description: 'Badge award',
    nip: 'NIP-58',
    category: 'regular',
    tags: []
  },
  {
    kind: 9,
    name: 'Chat Message',
    description: 'Generic chat message',
    nip: 'NIP-29',
    category: 'regular',
    tags: []
  },
  {
    kind: 11,
    name: 'Thread',
    description: 'Thread response',
    nip: 'NIP-10',
    category: 'regular',
    tags: []
  },
  {
    kind: 13,
    name: 'Seal',
    description: 'Sealed event for private messaging',
    nip: 'NIP-59',
    category: 'regular',
    tags: []
  },
  {
    kind: 14,
    name: 'Direct Message',
    description: 'Direct message using gift wrap',
    nip: 'NIP-17',
    category: 'regular',
    tags: []
  },
  {
    kind: 16,
    name: 'Generic Repost',
    description: 'Generic repost',
    nip: 'NIP-18',
    category: 'regular',
    tags: []
  },
  {
    kind: 40,
    name: 'Channel Creation',
    description: 'Channel creation',
    nip: 'NIP-28',
    category: 'regular',
    tags: []
  },
  {
    kind: 41,
    name: 'Channel Metadata',
    description: 'Channel metadata update',
    nip: 'NIP-28',
    category: 'regular',
    tags: []
  },
  {
    kind: 42,
    name: 'Channel Message',
    description: 'Channel message',
    nip: 'NIP-28',
    category: 'regular',
    tags: []
  },
  {
    kind: 43,
    name: 'Channel Hide Message',
    description: 'Hide message in channel',
    nip: 'NIP-28',
    category: 'regular',
    tags: []
  },
  {
    kind: 44,
    name: 'Channel Mute User',
    description: 'Mute user in channel',
    nip: 'NIP-28',
    category: 'regular',
    tags: []
  },
  {
    kind: 1063,
    name: 'File Metadata',
    description: 'File metadata',
    nip: 'NIP-94',
    category: 'regular',
    tags: []
  },
  {
    kind: 1311,
    name: 'Live Chat Message',
    description: 'Live chat message',
    nip: 'NIP-53',
    category: 'regular',
    tags: []
  },
  {
    kind: 1984,
    name: 'Reporting',
    description: 'Reporting content or users',
    nip: 'NIP-56',
    category: 'regular',
    tags: []
  },
  {
    kind: 1985,
    name: 'Label',
    description: 'Content labeling',
    nip: 'NIP-32',
    category: 'regular',
    tags: []
  },
  {
    kind: 9734,
    name: 'Zap Request',
    description: 'Zap request for Lightning payments',
    nip: 'NIP-57',
    category: 'regular',
    tags: []
  },
  {
    kind: 9735,
    name: 'Zap',
    description: 'Zap receipt for Lightning payments',
    nip: 'NIP-57',
    category: 'regular',
    tags: []
  },
  {
    kind: 10000,
    name: 'Mute List',
    description: 'Mute list',
    nip: 'NIP-51',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 10001,
    name: 'Pin List',
    description: 'Pin list',
    nip: 'NIP-51',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 10002,
    name: 'Relay List Metadata',
    description: 'Relay list metadata',
    nip: 'NIP-65',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 30000,
    name: 'Categorized People',
    description: 'Categorized people list',
    nip: 'NIP-51',
    category: 'addressable',
    tags: []
  },
  {
    kind: 30001,
    name: 'Categorized Bookmarks',
    description: 'Categorized bookmarks list',
    nip: 'NIP-51',
    category: 'addressable',
    tags: []
  },
  {
    kind: 30023,
    name: 'Long-form Content',
    description: 'Long-form text content, articles, blog posts',
    nip: 'NIP-23',
    category: 'addressable',
    tags: [
      { name: 'd', description: 'identifier', required: true },
      { name: 'title', description: 'article title', required: false },
      { name: 'published_at', description: 'unix timestamp', required: false }
    ]
  },
  {
    kind: 30024,
    name: 'Draft Long-form Content',
    description: 'Draft long-form content',
    nip: 'NIP-23',
    category: 'addressable',
    tags: []
  },
  {
    kind: 30402,
    name: 'Classified Listing',
    description: 'Classified listing',
    nip: 'NIP-99',
    category: 'addressable',
    tags: []
  },
  {
    kind: 30403,
    name: 'Draft Classified Listing',
    description: 'Draft classified listing',
    nip: 'NIP-99',
    category: 'addressable',
    tags: []
  },
  {
    kind: 31922,
    name: 'Date-Based Calendar Event',
    description: 'Date-based calendar event',
    nip: 'NIP-52',
    category: 'addressable',
    tags: []
  },
  {
    kind: 31923,
    name: 'Time-Based Calendar Event',
    description: 'Time-based calendar event',
    nip: 'NIP-52',
    category: 'addressable',
    tags: []
  },
  {
    kind: 31924,
    name: 'Calendar',
    description: 'Calendar',
    nip: 'NIP-52',
    category: 'addressable',
    tags: []
  },
  {
    kind: 31925,
    name: 'Calendar Event RSVP',
    description: 'Calendar event RSVP',
    nip: 'NIP-52',
    category: 'addressable',
    tags: []
  }
].sort((a, b) => a.kind - b.kind) as EventKind[];