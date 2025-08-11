// Example: How to use the AI-accessible event data

// Import the AI reference functions
import { 
  getEventByKind, 
  searchEventsByUsage, 
  getEventsByCategory,
  getAllImplementationNotes,
  getAllCommonGotchas 
} from './src/data/ai-event-reference.ts';

import { 
  getEventImplementationGuide,
  validateEventStructure,
  searchEventsByUsagePattern 
} from './src/lib/eventData.ts';

// 1. Get complete info about a specific event kind
const profileEvent = getEventByKind(0);
console.log("Profile Event Summary:", profileEvent.summary);
console.log("Use Cases:", profileEvent.useCases);
console.log("Implementation Notes:", profileEvent.implementationNotes);
console.log("Common Gotchas:", profileEvent.commonGotchas);
console.log("Basic Example:", profileEvent.basicExample.code);

// 2. Search events by use case
const messagingEvents = searchEventsByUsage("direct message");
console.log("Events for messaging:", messagingEvents.map(e => `${e.kind}: ${e.name}`));

// 3. Get events by category  
const replaceableEvents = getEventsByCategory('replaceable');
console.log("Replaceable events:", replaceableEvents.map(e => `${e.kind}: ${e.name}`));

// 4. Get complete implementation guide
const guide = getEventImplementationGuide(1); // Text notes
console.log("Complete guide for text notes:", {
  eventKind: guide.eventKind?.name,
  aiReference: guide.aiReference?.summary,
  exampleCount: guide.examples.length,
  relatedEvents: guide.relatedEvents.length
});

// 5. Validate an event before publishing
const testEvent = {
  id: "abc123",
  pubkey: "def456", 
  created_at: Math.floor(Date.now() / 1000),
  kind: 7,
  tags: [["e", "target123"], ["p", "author456"]],
  content: "+",
  sig: "signature"
};

const validation = validateEventStructure(testEvent);
console.log("Event validation:", validation);

// 6. Get all implementation wisdom
const allNotes = getAllImplementationNotes();
const allGotchas = getAllCommonGotchas();
console.log("All implementation notes:", allNotes);
console.log("All common gotchas:", allGotchas);