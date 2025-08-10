import { LibraryExample } from '@/types';

export const getLibraryExamples = (kind: number): LibraryExample[] => {
  const baseExamples: LibraryExample[] = [
    {
      library: 'nostr-tools',
      title: 'Create and Publish Event',
      description: 'Basic event creation and publishing using nostr-tools',
      code: `import { SimplePool, finalizeEvent, generateSecretKey } from 'nostr-tools'

const pool = new SimplePool()
const sk = generateSecretKey()

const event = finalizeEvent({
  kind: ${kind},
  content: "Hello Nostr!",
  tags: [],
  created_at: Math.floor(Date.now() / 1000)
}, sk)

pool.publish(['wss://relay.example.com'], event)`
    },
    {
      library: 'ndk',
      title: 'Create and Publish Event with NDK',
      description: 'Event creation and publishing using NDK with signer',
      code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

// Optional: Set up signer for browser extension
const signer = new NDKNip07Signer()

const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.example.com'],
  signer // Optional: for automatic signing
})

try {
  await ndk.connect()
  
  const event = new NDKEvent(ndk)
  event.kind = ${kind}
  event.content = "Hello Nostr!"
  event.tags = []
  event.created_at = Math.floor(Date.now() / 1000)
  
  await event.publish()
} catch (error) {
  console.error('Failed to publish event:', error)
}`
    }
  ];

  // Add kind-specific examples
  if (kind === 0) {
    return [
      {
        library: 'nostr-tools',
        title: 'Update User Profile',
        description: 'Create a user metadata event (kind 0)',
        code: `import { SimplePool, finalizeEvent, generateSecretKey } from 'nostr-tools'

const pool = new SimplePool()
const sk = generateSecretKey()

const profile = {
  name: "Alice",
  about: "Bitcoin enthusiast",
  picture: "https://example.com/alice.jpg",
  nip05: "alice@example.com"
}

const event = finalizeEvent({
  kind: 0,
  content: JSON.stringify(profile),
  tags: [],
  created_at: Math.floor(Date.now() / 1000)
}, sk)

pool.publish(['wss://relay.example.com'], event)`
      },
      {
        library: 'ndk',
        title: 'Update Profile with NDK',
        description: 'Update user profile using NDK with NIP-07 signer',
        code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const signer = new NDKNip07Signer()
const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.example.com'],
  signer
})

try {
  await ndk.connect()

  const profile = {
    name: "Alice", 
    about: "Bitcoin enthusiast",
    picture: "https://example.com/alice.jpg",
    nip05: "alice@example.com"
  }

  const event = new NDKEvent(ndk)
  event.kind = 0
  event.content = JSON.stringify(profile)
  event.created_at = Math.floor(Date.now() / 1000)

  await event.publish()
} catch (error) {
  console.error('Failed to update profile:', error)
}`
      }
    ];
  }

  if (kind === 1) {
    return [
      {
        library: 'nostr-tools',
        title: 'Publish Text Note',
        description: 'Create and publish a basic text note',
        code: `import { SimplePool, finalizeEvent, generateSecretKey } from 'nostr-tools'

const pool = new SimplePool()
const sk = generateSecretKey()

const event = finalizeEvent({
  kind: 1,
  content: "This is my first nostr note!",
  tags: [],
  created_at: Math.floor(Date.now() / 1000)
}, sk)

pool.publish(['wss://relay.example.com'], event)`
      },
      {
        library: 'ndk',
        title: 'Publish Note with NDK',
        description: 'Create and publish a text note using NDK with signer',
        code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const signer = new NDKNip07Signer()
const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.example.com'],
  signer
})

try {
  await ndk.connect()

  const event = new NDKEvent(ndk)
  event.kind = 1
  event.content = "This is my first nostr note!"
  event.tags = []
  event.created_at = Math.floor(Date.now() / 1000)

  await event.publish()
} catch (error) {
  console.error('Failed to publish note:', error)
}`
      }
    ];
  }

  if (kind === 3) {
    return [
      {
        library: 'nostr-tools',
        title: 'Update Follow List',
        description: 'Create a follow list event',
        code: `import { SimplePool, finalizeEvent, generateSecretKey } from 'nostr-tools'

const pool = new SimplePool()
const sk = generateSecretKey()

const followList = [
  ['p', 'pubkey1', 'wss://relay1.com', 'alice'],
  ['p', 'pubkey2', 'wss://relay2.com', 'bob']
]

const event = finalizeEvent({
  kind: 3,
  content: "",
  tags: followList,
  created_at: Math.floor(Date.now() / 1000)
}, sk)

pool.publish(['wss://relay.example.com'], event)`
      },
      {
        library: 'ndk',
        title: 'Update Follows with NDK',
        description: 'Update follow list using NDK with signer',
        code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const signer = new NDKNip07Signer()
const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.example.com'],
  signer
})

try {
  await ndk.connect()

  const event = new NDKEvent(ndk)
  event.kind = 3
  event.content = ""
  event.tags = [
    ['p', 'pubkey1', 'wss://relay1.com', 'alice'],
    ['p', 'pubkey2', 'wss://relay2.com', 'bob']
  ]
  event.created_at = Math.floor(Date.now() / 1000)

  await event.publish()
} catch (error) {
  console.error('Failed to update follows:', error)
}`
      }
    ];
  }

  return baseExamples;
};