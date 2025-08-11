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

  if (kind === 4) {
    return [
      {
        library: 'ndk',
        title: 'Encrypted Direct Message with NDK',
        description: 'Send encrypted direct messages using NIP-04 with NDK encryption',
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

async function sendEncryptedMessage() {
  try {
    await ndk.connect()
    console.log('Connected to relays')

    // Recipient's public key (hex format)
    const recipientPubkey = '04c915daefee38317fa734444acee390a8269fe5810b2241e5e6dd343dfbecc9'
    const message = "Hello! This is a private message."

    // Get recipient user
    const recipient = new NDKUser({ hexpubkey: recipientPubkey })
    recipient.ndk = ndk

    // Create encrypted DM event
    const dmEvent = new NDKEvent(ndk, {
      kind: 4,
      content: message, // NDK will encrypt this automatically
      tags: [
        ['p', recipientPubkey] // Required: recipient's pubkey
      ],
      created_at: Math.floor(Date.now() / 1000)
    })

    // Encrypt and publish (NDK handles NIP-04 encryption)
    await dmEvent.encrypt(recipient)
    const publishedEvent = await dmEvent.publish()
    
    console.log('Encrypted message sent:', publishedEvent.id)
    console.log('Encrypted content:', publishedEvent.content)
    
    return publishedEvent
  } catch (error) {
    console.error('Failed to send encrypted message:', error)
    throw error
  }
}

sendEncryptedMessage()`
      },
      {
        library: 'ndk',
        title: 'Decrypt Received Messages',
        description: 'Decrypt and read received encrypted direct messages',
        code: `import NDK, { NDKEvent, NDKNip07Signer, NDKFilter } from '@nostr-dev-kit/ndk'

const signer = new NDKNip07Signer()
const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.damus.io',
    'wss://nos.lol'
  ],
  signer
})

async function readEncryptedMessages() {
  try {
    await ndk.connect()
    
    // Get current user
    const currentUser = await signer.user()
    console.log('Reading DMs for:', currentUser.npub)

    // Subscribe to encrypted DMs sent to us
    const filter: NDKFilter = {
      kinds: [4],
      '#p': [currentUser.hexpubkey()], // Messages sent to us
      limit: 20
    }

    const subscription = ndk.subscribe(filter)
    
    subscription.on('event', async (event: NDKEvent) => {
      try {
        // Decrypt the message
        await event.decrypt()
        
        console.log('Decrypted message:', {
          from: event.author.npub,
          content: event.content,
          timestamp: new Date(event.created_at * 1000)
        })
      } catch (error) {
        console.error('Failed to decrypt message:', error)
      }
    })

    console.log('Listening for encrypted messages...')
    
  } catch (error) {
    console.error('Failed to read encrypted messages:', error)
  }
}

readEncryptedMessages()`
      }
    ];
  }

  if (kind === 6) {
    return [
      {
        library: 'ndk',
        title: 'Repost Event with NDK',
        description: 'Create and publish a repost (kind 6) with proper event references',
        code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const signer = new NDKNip07Signer()
const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.snort.social'
  ],
  signer
})

async function repostEvent() {
  try {
    await ndk.connect()
    console.log('Connected to relays')

    // The event we want to repost
    const originalEventId = 'event_id_to_repost'
    const originalAuthorPubkey = 'pubkey_of_original_author'
    const relayHint = 'wss://relay.damus.io'

    // Fetch the original event to include as content
    const originalEvent = await ndk.fetchEvent(originalEventId)
    
    if (!originalEvent) {
      throw new Error('Original event not found')
    }

    // Create repost event (kind 6)
    const repostEvent = new NDKEvent(ndk, {
      kind: 6,
      content: JSON.stringify(originalEvent.rawEvent()), // Stringified original event
      tags: [
        ['e', originalEventId, relayHint], // Required: original event ID
        ['p', originalAuthorPubkey] // Recommended: original author
      ],
      created_at: Math.floor(Date.now() / 1000)
    })

    // Publish repost
    const publishedEvent = await repostEvent.publish()
    console.log('Event reposted successfully:', publishedEvent.id)
    
    return publishedEvent
  } catch (error) {
    console.error('Failed to repost event:', error)
    throw error
  }
}

repostEvent()`
      }
    ];
  }

  if (kind === 7) {
    return [
      {
        library: 'ndk',
        title: 'React to Event (Like/Dislike)',
        description: 'Create reactions to events with proper tagging and content',
        code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const signer = new NDKNip07Signer()
const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.snort.social'
  ],
  signer
})

async function reactToEvent() {
  try {
    await ndk.connect()
    console.log('Connected to relays')

    // Event to react to
    const eventId = 'event_id_to_react_to'
    const eventAuthorPubkey = 'author_pubkey_of_event'
    const relayHint = 'wss://relay.damus.io'
    
    // Reaction types:
    // '+' or '' = like/upvote
    // '-' = dislike/downvote  
    // '🔥' = fire emoji reaction
    const reactionContent = '+' // Like

    // Create reaction event (kind 7)
    const reactionEvent = new NDKEvent(ndk, {
      kind: 7,
      content: reactionContent,
      tags: [
        ['e', eventId, relayHint], // Required: event being reacted to
        ['p', eventAuthorPubkey], // Required: pubkey of event author
        ['k', '1'] // Optional: kind of event being reacted to
      ],
      created_at: Math.floor(Date.now() / 1000)
    })

    // Publish reaction
    const publishedEvent = await reactionEvent.publish()
    console.log('Reaction published:', publishedEvent.id)
    console.log('Reaction type:', reactionContent || 'like')
    
    return publishedEvent
  } catch (error) {
    console.error('Failed to publish reaction:', error)
    throw error
  }
}

reactToEvent()`
      },
      {
        library: 'ndk',
        title: 'Subscribe to Reactions',
        description: 'Monitor reactions to your events in real-time',
        code: `import NDK, { NDKFilter, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const signer = new NDKNip07Signer()
const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.damus.io',
    'wss://nos.lol'
  ],
  signer
})

async function subscribeToReactions() {
  try {
    await ndk.connect()
    
    // Get current user to monitor reactions to their events
    const currentUser = await signer.user()
    
    // Subscribe to reactions mentioning current user
    const filter: NDKFilter = {
      kinds: [7], // Reactions
      '#p': [currentUser.hexpubkey()], // Reactions to our events
      since: Math.floor(Date.now() / 1000) - 3600 // Last hour
    }

    const subscription = ndk.subscribe(filter, { closeOnEose: false })
    
    subscription.on('event', (event) => {
      // Parse reaction
      let reactionType = 'like'
      if (event.content === '-') reactionType = 'dislike'
      else if (event.content && event.content !== '+') reactionType = event.content

      console.log('New reaction received:', {
        type: reactionType,
        from: event.author.npub,
        eventId: event.tags.find(t => t[0] === 'e')?.[1],
        timestamp: new Date(event.created_at * 1000)
      })
    })

    console.log('Monitoring reactions...')
    
  } catch (error) {
    console.error('Failed to subscribe to reactions:', error)
  }
}

subscribeToReactions()`
      }
    ];
  }

  if (kind === 30023) {
    return [
      {
        library: 'ndk',
        title: 'Long-form Content Article',
        description: 'Create and publish long-form articles with proper metadata',
        code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const signer = new NDKNip07Signer()
const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.snort.social'
  ],
  signer
})

async function publishArticle() {
  try {
    await ndk.connect()
    console.log('Connected to relays')

    const articleId = 'my-first-article-' + Date.now()
    const articleContent = \`# My First Nostr Article

This is a long-form article published on Nostr using **kind 30023**.

## Features

- Markdown formatting
- Addressable events (replaceable)
- Rich metadata support
- References to other events

You can reference other nostr events like this: nostr:note1abc123...

## Conclusion

Long-form content on Nostr enables censorship-resistant publishing!\`

    // Create long-form content event (kind 30023)
    const articleEvent = new NDKEvent(ndk, {
      kind: 30023,
      content: articleContent,
      tags: [
        ['d', articleId], // Required: unique identifier for replaceability
        ['title', 'My First Nostr Article'],
        ['published_at', Math.floor(Date.now() / 1000).toString()],
        ['t', 'nostr'], // Topic/hashtag
        ['t', 'longform'],
        ['image', 'https://example.com/article-cover.jpg'],
        ['summary', 'An introduction to publishing long-form content on Nostr']
      ],
      created_at: Math.floor(Date.now() / 1000)
    })

    // Publish article
    const publishedEvent = await articleEvent.publish()
    console.log('Article published:', publishedEvent.id)
    console.log('Article identifier:', articleId)
    
    // Generate addressable event coordinate
    const currentUser = await signer.user()
    const coordinate = \`30023:\${currentUser.hexpubkey()}:\${articleId}\`
    console.log('Article coordinate:', coordinate)
    
    return publishedEvent
  } catch (error) {
    console.error('Failed to publish article:', error)
    throw error
  }
}

publishArticle()`
      }
    ];
  }

  if (kind === 9734) {
    return [
      {
        library: 'ndk',
        title: 'Zap Request Creation',
        description: 'Create a zap request for Lightning payments with proper tags',
        code: `import NDK, { NDKEvent, NDKNip07Signer } from '@nostr-dev-kit/ndk'

const signer = new NDKNip07Signer()
const ndk = new NDK({
  explicitRelayUrls: [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.snort.social'
  ],
  signer
})

async function createZapRequest() {
  try {
    await ndk.connect()
    console.log('Connected to relays')

    // Zap recipient details
    const recipientPubkey = '04c915daefee38317fa734444acee390a8269fe5810b2241e5e6dd343dfbecc9'
    const recipientLnurl = 'lnurl1dp68gurn8ghj7mrww3uxymm59e3k7mf0v9cxj0m385ekvcenxc6r2c35xvukxefcv5mkvv34x5ekzd3ev56nyd3hxqurzepexejxxepnxscrvwfnv36x2epnxejnxv3ex5nz'
    const amountMillisats = 21000 // 21 sats
    const zapMessage = "Great post! ⚡"
    
    // Optional: Event being zapped
    const eventId = 'event_id_being_zapped' // Leave empty if zapping profile
    
    // Create zap request event (kind 9734)
    const zapRequestTags = [
      ['p', recipientPubkey], // Required: recipient pubkey
      ['amount', amountMillisats.toString()], // Amount in millisats
      ['lnurl', recipientLnurl], // Lightning address
      ['relays', 'wss://relay.damus.io', 'wss://nos.lol'] // Relays to publish receipt
    ]
    
    // Add event tag if zapping a specific event
    if (eventId) {
      zapRequestTags.push(['e', eventId])
    }

    const zapRequestEvent = new NDKEvent(ndk, {
      kind: 9734,
      content: zapMessage,
      tags: zapRequestTags,
      created_at: Math.floor(Date.now() / 1000)
    })

    // Sign the zap request (don't publish - send to LNURL service)
    await zapRequestEvent.sign()
    console.log('Zap request created:', zapRequestEvent.id)
    
    // In a real implementation, you would:
    // 1. Encode this event and send to the LNURL callback
    // 2. The LNURL service returns a Lightning invoice
    // 3. Pay the invoice
    // 4. The service publishes a kind 9735 zap receipt
    
    console.log('Zap request event (send to LNURL service):')
    console.log(JSON.stringify(zapRequestEvent.rawEvent(), null, 2))
    
    return zapRequestEvent
  } catch (error) {
    console.error('Failed to create zap request:', error)
    throw error
  }
}

createZapRequest()`
      }
    ];
  }

  return baseExamples;
};