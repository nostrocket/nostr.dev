import { LibraryExample } from '@/types';

export const getLibraryExamples = (kind: number): LibraryExample[] => {
  const baseExamples: LibraryExample[] = [
    {
      library: 'ndk',
      title: 'Complete NDK Event Creation & Publishing',
      description: 'Full NDK example with proper initialization, signing, and publishing',
      code: `import NDK, { NDKEvent, NDKNip07Signer, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk'

// Choose your signer method
const nip07Signer = new NDKNip07Signer() // Browser extension
// OR for server/testing:
// const privateSigner = NDKPrivateKeySigner.generate()

const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.snort.social'
  ],
  signer: nip07Signer
})

async function createAndPublishEvent() {
  try {
    // Connect to relays
    await ndk.connect()
    console.log('Connected to Nostr relays')

    // Create event with proper structure
    const event = new NDKEvent(ndk, {
      kind: ${kind},
      content: "Hello Nostr!",
      tags: [], // Add relevant tags here
      created_at: Math.floor(Date.now() / 1000)
    })

    // Publish event (NDK auto-signs with configured signer)
    const publishedEvent = await event.publish()
    console.log('Event published successfully:', publishedEvent.id)
    
    return publishedEvent
  } catch (error) {
    console.error('Failed to publish event:', error)
    throw error
  }
}

// Execute the function
createAndPublishEvent()`
    }
  ];

  // Add kind-specific examples
  if (kind === 0) {
    return [
      {
        library: 'ndk',
        title: 'Complete Profile Update with NDK',
        description: 'Full example of updating user profile with proper signing and validation',
        code: `import NDK, { NDKEvent, NDKNip07Signer, NDKUser } from '@nostr-dev-kit/ndk'

const signer = new NDKNip07Signer()
const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.snort.social'
  ],
  signer
})

async function updateProfile() {
  try {
    await ndk.connect()
    console.log('Connected to relays')

    // Get current user from signer
    const currentUser = await signer.user()
    console.log('Updating profile for:', currentUser.npub)

    const profileData = {
      name: "Alice", 
      about: "Bitcoin enthusiast and Nostr developer",
      picture: "https://example.com/alice.jpg",
      nip05: "alice@example.com",
      website: "https://alice.dev",
      banner: "https://example.com/banner.jpg"
    }

    // Create kind 0 event
    const profileEvent = new NDKEvent(ndk, {
      kind: 0,
      content: JSON.stringify(profileData),
      tags: [],
      created_at: Math.floor(Date.now() / 1000)
    })

    // Publish profile update
    const publishedEvent = await profileEvent.publish()
    console.log('Profile updated successfully:', publishedEvent.id)

    // Verify the update by fetching the profile
    const user = new NDKUser({ npub: currentUser.npub })
    user.ndk = ndk
    const profile = await user.fetchProfile()
    console.log('Updated profile:', profile)

    return publishedEvent
  } catch (error) {
    console.error('Failed to update profile:', error)
    throw error
  }
}

updateProfile()`
      }
    ];
  }

  if (kind === 1) {
    return [
      {
        library: 'ndk',
        title: 'Complete NDK Example: Create, Sign & Publish',
        description: 'Complete example with event creation, signing, and publishing',
        code: `import NDK, { NDKEvent, NDKNip07Signer, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk'

// Option 1: Browser extension signer (NIP-07)
const browserSigner = new NDKNip07Signer()

// Option 2: Private key signer (for testing/backend)
const privateKey = NDKPrivateKeySigner.generate()

const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.snort.social'
  ],
  signer: browserSigner // or privateKey
})

async function publishNote() {
  try {
    // Connect to relays
    await ndk.connect()
    console.log('Connected to relays')

    // Create the event
    const event = new NDKEvent(ndk, {
      kind: 1,
      content: "This is my first nostr note!",
      tags: [],
      created_at: Math.floor(Date.now() / 1000)
    })

    // Sign and publish (NDK handles signing automatically)
    const publishedEvent = await event.publish()
    console.log('Event published:', publishedEvent.id)
    
    return publishedEvent
  } catch (error) {
    console.error('Failed to publish note:', error)
    throw error
  }
}

// Execute
publishNote()`
      },
      {
        library: 'ndk',
        title: 'NDK Subscription Example',
        description: 'Subscribe to and receive events in real-time',
        code: `import NDK, { NDKSubscription, NDKFilter } from '@nostr-dev-kit/ndk'

const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.damus.io',
    'wss://nos.lol'
  ]
})

async function subscribeToNotes() {
  try {
    await ndk.connect()
    
    // Define subscription filters
    const filters: NDKFilter[] = [{
      kinds: [1], // Text notes
      limit: 10,
      since: Math.floor(Date.now() / 1000) - 3600 // Last hour
    }]

    // Create subscription
    const subscription = ndk.subscribe(filters, { closeOnEose: false })

    // Handle incoming events
    subscription.on('event', (event) => {
      console.log('New note:', {
        id: event.id,
        content: event.content,
        author: event.author.npub,
        created_at: new Date(event.created_at * 1000)
      })
    })

    subscription.on('eose', () => {
      console.log('End of stored events')
    })

    subscription.on('close', () => {
      console.log('Subscription closed')
    })

    // Stop subscription after 30 seconds
    setTimeout(() => {
      subscription.stop()
    }, 30000)

  } catch (error) {
    console.error('Subscription failed:', error)
  }
}

subscribeToNotes()`
      }
    ];
  }

  if (kind === 3) {
    return [
      {
        library: 'ndk',
        title: 'Complete Follow List Management with NDK',
        description: 'Complete example of managing follow list with proper NDK patterns',
        code: `import NDK, { NDKEvent, NDKNip07Signer, NDKUser } from '@nostr-dev-kit/ndk'

const signer = new NDKNip07Signer()
const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.snort.social'
  ],
  signer
})

async function updateFollowList() {
  try {
    await ndk.connect()
    console.log('Connected to relays')

    // Get current user
    const currentUser = await signer.user()
    console.log('Updating follows for:', currentUser.npub)

    // Example pubkeys to follow (in hex format)
    const followList = [
      {
        pubkey: '3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d',
        relay: 'wss://relay.damus.io',
        petname: 'fiatjaf'
      },
      {
        pubkey: '04c915daefee38317fa734444acee390a8269fe5810b2241e5e6dd343dfbecc9',
        relay: 'wss://nos.lol', 
        petname: 'odell'
      }
    ]

    // Create follow event tags
    const followTags = followList.map(follow => [
      'p', 
      follow.pubkey, 
      follow.relay || '', 
      follow.petname || ''
    ])

    // Create kind 3 event
    const followEvent = new NDKEvent(ndk, {
      kind: 3,
      content: "", // Usually empty for follow lists
      tags: followTags,
      created_at: Math.floor(Date.now() / 1000)
    })

    // Publish follow list
    const publishedEvent = await followEvent.publish()
    console.log('Follow list updated:', publishedEvent.id)

    // Verify by fetching the updated follow list
    const user = new NDKUser({ npub: currentUser.npub })
    user.ndk = ndk
    const follows = await user.follows()
    console.log('Now following', follows.size, 'users')

    return publishedEvent
  } catch (error) {
    console.error('Failed to update follows:', error)
    throw error
  }
}

updateFollowList()`
      }
    ];
  }

  return baseExamples;
};