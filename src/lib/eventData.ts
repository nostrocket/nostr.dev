import { EventKind, NostrEvent, TagSchema } from '@/types';
import { eventKinds } from '@/data/eventKinds';
import { eventsData } from '@/data/eventsData';
import { aiEventReference, getEventByKind, searchEventsByUsage, getRelatedEvents } from '@/data/ai-event-reference';

export function getAllEventKinds(): EventKind[] {
  return eventKinds.map(kind => ({
    ...kind,
    examples: (eventsData[kind.kind.toString() as keyof typeof eventsData] || []) as NostrEvent[]
  }));
}

export function getEventKind(kind: number): EventKind | null {
  const eventKind = eventKinds.find(k => k.kind === kind);
  if (!eventKind) return null;
  
  return {
    ...eventKind,
    examples: (eventsData[kind.toString() as keyof typeof eventsData] || []) as NostrEvent[]
  };
}

export function searchEventKinds(query: string): EventKind[] {
  const allKinds = getAllEventKinds();
  
  if (!query.trim()) return allKinds;
  
  const searchTerm = query.toLowerCase();
  
  return allKinds.filter(kind => 
    kind.name.toLowerCase().includes(searchTerm) ||
    kind.description.toLowerCase().includes(searchTerm) ||
    kind.kind.toString().includes(searchTerm) ||
    (kind.nip && kind.nip.toLowerCase().includes(searchTerm))
  );
}

// AI-Optimized Functions

/**
 * Get complete implementation guide for an event kind including examples and schemas
 */
export function getEventImplementationGuide(kind: number): {
  eventKind: EventKind | null;
  aiReference: any;
  examples: NostrEvent[];
  relatedEvents: any[];
} {
  const eventKind = getEventKind(kind);
  const aiReference = getEventByKind(kind);
  const examples = (eventsData[kind.toString() as keyof typeof eventsData] || []) as NostrEvent[];
  const relatedEvents = getRelatedEvents(kind);
  
  return {
    eventKind,
    aiReference,
    examples,
    relatedEvents
  };
}

/**
 * Search events by use case or implementation pattern
 */
export function searchEventsByUsagePattern(query: string): EventKind[] {
  const aiResults = searchEventsByUsage(query);
  
  // Convert AI references back to EventKind format
  return aiResults.map(aiRef => {
    const baseEvent = eventKinds.find(e => e.kind === aiRef.kind);
    if (!baseEvent) return null;
    
    return {
      ...baseEvent,
      summary: aiRef.summary,
      useCases: aiRef.useCases,
      implementationNotes: aiRef.implementationNotes,
      commonGotchas: aiRef.commonGotchas,
      requiredTags: aiRef.requiredTags,
      optionalTags: aiRef.optionalTags,
      contentSchema: aiRef.contentSchema,
      basicExample: aiRef.basicExample,
      advancedExamples: aiRef.advancedExamples,
      relatedKinds: aiRef.relatedKinds,
      examples: (eventsData[aiRef.kind.toString() as keyof typeof eventsData] || []) as NostrEvent[]
    } as EventKind;
  }).filter(Boolean) as EventKind[];
}

/**
 * Get events by category with enhanced AI data
 */
export function getEventsByCategory(category: 'regular' | 'replaceable' | 'ephemeral' | 'addressable'): EventKind[] {
  return eventKinds
    .filter(kind => kind.category === category)
    .map(kind => {
      const aiRef = getEventByKind(kind.kind);
      return {
        ...kind,
        summary: aiRef?.summary,
        useCases: aiRef?.useCases,
        implementationNotes: aiRef?.implementationNotes,
        examples: (eventsData[kind.kind.toString() as keyof typeof eventsData] || []) as NostrEvent[]
      } as EventKind;
    });
}

/**
 * Validate event structure against kind schema
 */
export function validateEventStructure(event: NostrEvent): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const aiRef = getEventByKind(event.kind);
  if (!aiRef) {
    warnings.push(`Unknown event kind: ${event.kind}`);
    return { isValid: true, errors, warnings };
  }
  
  // Validate required tags
  if (aiRef.requiredTags) {
    for (const requiredTag of aiRef.requiredTags) {
      const hasTag = event.tags.some(tag => tag[0] === requiredTag.name);
      if (!hasTag) {
        errors.push(`Missing required tag: ${requiredTag.name}`);
      }
    }
  }
  
  // Validate content schema
  if (aiRef.contentSchema) {
    switch (aiRef.contentSchema.type) {
      case 'json':
        try {
          JSON.parse(event.content);
        } catch {
          errors.push('Content must be valid JSON');
        }
        break;
      case 'empty':
        if (event.content.trim() !== '') {
          warnings.push('Content should be empty for this event kind');
        }
        break;
    }
  }
  
  // Check for common gotchas
  if (aiRef.commonGotchas) {
    // Add specific validation based on gotchas
    if (event.kind === 0 && aiRef.commonGotchas.includes('Forgetting to JSON.stringify the profile object')) {
      try {
        const parsed = JSON.parse(event.content);
        if (typeof parsed !== 'object') {
          warnings.push('Profile content should be a JSON object');
        }
      } catch {
        // Already caught above
      }
    }
    
    if (event.kind === 7) {
      const hasETag = event.tags.some(tag => tag[0] === 'e');
      const hasPTag = event.tags.some(tag => tag[0] === 'p');
      if (!hasETag || !hasPTag) {
        errors.push('Reaction events must include both e and p tags');
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get implementation examples for a specific library
 */
export function getImplementationExamples(kind: number, library: 'ndk' | 'nostr-tools' | 'generic' = 'ndk'): any[] {
  const aiRef = getEventByKind(kind);
  if (!aiRef) return [];
  
  const examples = [];
  if (aiRef.basicExample?.library === library) {
    examples.push(aiRef.basicExample);
  }
  
  if (aiRef.advancedExamples) {
    examples.push(...aiRef.advancedExamples.filter(ex => ex.library === library));
  }
  
  return examples;
}

/**
 * Get all implementation notes across all event kinds
 */
export function getAllImplementationNotes(): Array<{kind: number, name: string, notes: string[]}> {
  return aiEventReference.map(ref => ({
    kind: ref.kind,
    name: ref.name,
    notes: ref.implementationNotes
  }));
}

/**
 * Get common gotchas for all event kinds
 */
export function getAllCommonGotchas(): Array<{kind: number, name: string, gotchas: string[]}> {
  return aiEventReference.map(ref => ({
    kind: ref.kind,
    name: ref.name,
    gotchas: ref.commonGotchas
  }));
}

/**
 * Find events that might be related based on tags or usage patterns
 */
export function findRelatedEventKinds(kind: number): EventKind[] {
  const aiRef = getEventByKind(kind);
  if (!aiRef?.relatedKinds) return [];
  
  return aiRef.relatedKinds
    .map(relatedKind => getEventKind(relatedKind))
    .filter(Boolean) as EventKind[];
}