export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

export interface EventKind {
  kind: number;
  name: string;
  description: string;
  nip?: string;
  category: 'regular' | 'replaceable' | 'ephemeral' | 'addressable';
  examples?: NostrEvent[];
  tags?: {
    name: string;
    description: string;
    required: boolean;
  }[];
  
  // Enhanced fields for AI accessibility
  summary?: string; // One-line summary for quick understanding
  useCases?: string[]; // Common use cases
  implementationNotes?: string[]; // Important implementation details
  commonGotchas?: string[]; // Common mistakes to avoid
  
  // Schema definitions for validation
  requiredTags?: TagSchema[];
  optionalTags?: TagSchema[];
  contentSchema?: {
    type: 'text' | 'json' | 'empty' | 'encrypted';
    description: string;
    examples?: string[];
    validation?: string; // Regex or validation rule
  };
  
  // Implementation examples
  basicExample?: CodeExample;
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

export interface LibraryExample {
  library: 'nostr-tools' | 'ndk';
  title: string;
  description: string;
  code: string;
}