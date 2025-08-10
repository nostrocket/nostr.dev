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
}

export interface LibraryExample {
  library: 'nostr-tools' | 'ndk';
  title: string;
  description: string;
  code: string;
}