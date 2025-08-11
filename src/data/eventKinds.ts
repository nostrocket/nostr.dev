import { EventKind } from '@/types';

export const eventKinds = [
  {
    kind: 0,
    name: 'User Metadata',
    description: 'Replaceable event containing user profile metadata as a stringified JSON object with name, about, and picture fields.',
    nip: 'NIP-01',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 1,
    name: 'Short Text Note',
    description: 'Regular event representing the fundamental building block of Nostr, containing short-form text content like social media posts.',
    nip: 'NIP-01',
    category: 'regular',
    tags: []
  },
  {
    kind: 3,
    name: 'Follows',
    description: 'Replaceable contact list event containing p tags for followed pubkeys with optional relay hints and local petnames.',
    nip: 'NIP-02',
    category: 'replaceable',
    tags: [
      { name: 'p', description: 'pubkey being followed', required: false }
    ]
  },
  {
    kind: 4,
    name: 'Encrypted Direct Messages',
    description: 'Deprecated encrypted direct message event using shared secret encryption between sender and recipient pubkeys.',
    nip: 'NIP-04',
    category: 'regular',
    tags: [
      { name: 'p', description: 'recipient pubkey', required: true }
    ]
  },
  {
    kind: 5,
    name: 'Event Deletion Request',
    description: 'Event requesting deletion of previously published events by specifying their IDs in e tags.',
    nip: 'NIP-09',
    category: 'regular',
    tags: [
      { name: 'e', description: 'event id to delete', required: true }
    ]
  },
  {
    kind: 6,
    name: 'Repost',
    description: 'Event that reposts another event by including the original event JSON in content and referencing it with e and p tags.',
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
    description: 'Reaction event with content "+" for like, "-" for dislike, or emoji, targeting another event via e and p tags.',
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
    description: 'Event awarding a badge to a pubkey, referencing the badge definition and recipient.',
    nip: 'NIP-58',
    category: 'regular',
    tags: []
  },
  {
    kind: 9,
    name: 'Chat Message',
    description: 'Message sent to a group chat with moderation and access control managed by group admins.',
    nip: 'NIP-29',
    category: 'regular',
    tags: []
  },
  {
    kind: 2,
    name: 'Recommend Relay',
    description: 'Deprecated event type that was used to recommend relay servers to other users.',
    nip: 'NIP-01',
    category: 'regular',
    tags: []
  },
  {
    kind: 10,
    name: 'Group Chat Threaded Reply',
    description: 'Group chat threaded reply (deprecated)',
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
    kind: 12,
    name: 'Group Thread Reply',
    description: 'Group thread reply (deprecated)',
    nip: 'NIP-29',
    category: 'regular',
    tags: []
  },
  {
    kind: 13,
    name: 'Seal',
    description: 'Sealed event containing encrypted content as part of the gift wrap private messaging protocol.',
    nip: 'NIP-59',
    category: 'regular',
    tags: []
  },
  {
    kind: 14,
    name: 'Direct Message',
    description: 'Private direct message event using the gift wrap protocol with enhanced privacy and metadata protection.',
    nip: 'NIP-17',
    category: 'regular',
    tags: []
  },
  {
    kind: 15,
    name: 'File Message',
    description: 'File message',
    nip: 'NIP-17',
    category: 'regular',
    tags: []
  },
  {
    kind: 16,
    name: 'Generic Repost',
    description: 'Generic repost event that can reference any kind of event with optional additional commentary.',
    nip: 'NIP-18',
    category: 'regular',
    tags: []
  },
  {
    kind: 17,
    name: 'Reaction to Website',
    description: 'Reaction to a website',
    nip: 'NIP-25',
    category: 'regular',
    tags: []
  },
  {
    kind: 20,
    name: 'Picture',
    description: 'Picture event',
    nip: 'NIP-68',
    category: 'regular',
    tags: []
  },
  {
    kind: 21,
    name: 'Video Event',
    description: 'Event containing video content metadata including URL, thumbnail, duration, and other video properties.',
    nip: 'NIP-71',
    category: 'regular',
    tags: []
  },
  {
    kind: 22,
    name: 'Short-form Portrait Video',
    description: 'Short-form portrait video event',
    nip: 'NIP-71',
    category: 'regular',
    tags: []
  },
  {
    kind: 30,
    name: 'Internal Reference',
    description: 'Internal reference',
    nip: 'NKBIP-03',
    category: 'regular',
    tags: []
  },
  {
    kind: 31,
    name: 'External Web Reference',
    description: 'External web reference',
    nip: 'NKBIP-03',
    category: 'regular',
    tags: []
  },
  {
    kind: 32,
    name: 'Hardcopy Reference',
    description: 'Hardcopy reference',
    nip: 'NKBIP-03',
    category: 'regular',
    tags: []
  },
  {
    kind: 33,
    name: 'Prompt Reference',
    description: 'Prompt reference',
    nip: 'NKBIP-03',
    category: 'regular',
    tags: []
  },
  {
    kind: 40,
    name: 'Channel Creation',
    description: 'Event that creates a new public channel with metadata like name, about, and picture.',
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
    description: 'Message posted to a public channel, referencing the channel creation event.',
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
    kind: 818,
    name: 'Merge Requests',
    description: 'Merge requests',
    nip: 'NIP-54',
    category: 'regular',
    tags: []
  },
  {
    kind: 1018,
    name: 'Poll Response',
    description: 'Poll response',
    nip: 'NIP-69',
    category: 'regular',
    tags: []
  },
  {
    kind: 1063,
    name: 'File Metadata',
    description: 'Event containing metadata about a file including URL, hash, MIME type, and other descriptive information.',
    nip: 'NIP-94',
    category: 'regular',
    tags: []
  },
  {
    kind: 1311,
    name: 'Live Chat Message',
    description: 'Chat message posted to a live event or streaming session with real-time interaction capabilities.',
    nip: 'NIP-53',
    category: 'regular',
    tags: []
  },
  {
    kind: 1617,
    name: 'Patches',
    description: 'Patches',
    nip: 'NIP-34',
    category: 'regular',
    tags: []
  },
  {
    kind: 1621,
    name: 'Issues',
    description: 'Issues',
    nip: 'NIP-34',
    category: 'regular',
    tags: []
  },
  {
    kind: 1622,
    name: 'Replies',
    description: 'Replies',
    nip: 'NIP-34',
    category: 'regular',
    tags: []
  },
  {
    kind: 1971,
    name: 'Problem Tracker',
    description: 'Problem tracker',
    nip: 'NIP-1971',
    category: 'regular',
    tags: []
  },
  {
    kind: 1984,
    name: 'Reporting',
    description: 'Event for reporting content or users to relay operators with standardized report types and reasons.',
    nip: 'NIP-56',
    category: 'regular',
    tags: []
  },
  {
    kind: 1985,
    name: 'Label',
    description: 'Event for labeling other events or entities with standardized or custom labels and namespaces.',
    nip: 'NIP-32',
    category: 'regular',
    tags: []
  },
  {
    kind: 9734,
    name: 'Zap Request',
    description: 'Lightning payment request event sent to LNURL callback containing recipient and optional message, not published to relays.',
    nip: 'NIP-57',
    category: 'regular',
    tags: []
  },
  {
    kind: 9735,
    name: 'Zap',
    description: 'Lightning payment receipt event created when a zap request invoice is paid, containing the original request and bolt11 invoice.',
    nip: 'NIP-57',
    category: 'regular',
    tags: []
  },
  {
    kind: 10000,
    name: 'Mute List',
    description: 'Replaceable list of muted pubkeys and event IDs that the user wants to filter from their feeds.',
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
    description: 'Replaceable list defining which relays a user reads from and writes to, with read/write permissions.',
    nip: 'NIP-65',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 10003,
    name: 'Bookmark List',
    description: 'Bookmark list',
    nip: 'NIP-51',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 10004,
    name: 'Communities List',
    description: 'Communities list',
    nip: 'NIP-51',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 10005,
    name: 'Public Chats List',
    description: 'Public chats list',
    nip: 'NIP-51',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 10006,
    name: 'Blocked Relays List',
    description: 'Blocked relays list',
    nip: 'NIP-51',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 10007,
    name: 'Search Relays List',
    description: 'Search relays list',
    nip: 'NIP-51',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 10009,
    name: 'User Groups List',
    description: 'User groups list',
    nip: 'NIP-51',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 10015,
    name: 'Interests List',
    description: 'Interests list',
    nip: 'NIP-51',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 10030,
    name: 'User Emoji List',
    description: 'User emoji list',
    nip: 'NIP-51',
    category: 'replaceable',
    tags: []
  },
  {
    kind: 30000,
    name: 'Categorized People',
    description: 'Addressable list of pubkeys organized into custom categories defined by the d tag identifier.',
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
    description: 'Addressable event for long-form Markdown content like articles and blog posts with optional metadata tags.',
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
    kind: 30078,
    name: 'Application-specific Data',
    description: 'Application-specific data',
    nip: 'NIP-78',
    category: 'addressable',
    tags: []
  },
  {
    kind: 30315,
    name: 'User Status',
    description: 'User status',
    nip: 'NIP-315',
    category: 'addressable',
    tags: []
  },
  {
    kind: 30818,
    name: 'Wiki Article',
    description: 'Wiki article',
    nip: 'NIP-54',
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
    description: 'Addressable calendar event for all-day or multi-day events without specific times.',
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
  },
  {
    kind: 32123,
    name: 'Repository Announcement',
    description: 'Repository announcement',
    nip: 'NIP-34',
    category: 'addressable',
    tags: []
  },
  {
    kind: 34550,
    name: 'Community Definition',
    description: 'Addressable event defining a community with metadata, rules, and moderation parameters.',
    nip: 'NIP-72',
    category: 'addressable',
    tags: []
  },
  {
    kind: 39000,
    name: 'Group Metadata',
    description: 'Group metadata',
    nip: 'NIP-29',
    category: 'addressable',
    tags: []
  },
  {
    kind: 39001,
    name: 'Group Admins',
    description: 'Group admins',
    nip: 'NIP-29',
    category: 'addressable',
    tags: []
  },
  {
    kind: 39002,
    name: 'Group Members',
    description: 'Group members',
    nip: 'NIP-29',
    category: 'addressable',
    tags: []
  }
].sort((a, b) => a.kind - b.kind) as EventKind[];