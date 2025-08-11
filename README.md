# Nostr Event Kinds Reference

A comprehensive, searchable reference for Nostr event kinds with documentation and library usage examples.

## Features

🔍 **Advanced Search**: Search by event kind number, name, description, or NIP using Fuse.js fuzzy search  
📱 **Mobile-Friendly**: Responsive email client-style layout with collapsible sidebar  
📚 **Code Examples**: Ready-to-use code snippets for nostr-tools and NDK  
🌙 **Theme Support**: Light, dark, and system theme modes with persistent preference  
🚀 **Static Site**: Built with Next.js 15 static export for fast deployment  
🎯 **Direct URLs**: Navigate directly to specific event kinds via `/[kind]` routes  

## Quick Start

```bash
# Clone the repository
git clone https://github.com/nostrocket/nostr.dev.git
cd nostr.dev

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

- **Next.js 15** with TypeScript and App Router
- **Tailwind CSS** for styling with dark mode support
- **Fuse.js** for intelligent fuzzy search
- **Lucide React** for consistent iconography
- **Client-side routing** with dynamic kind pages
- **Theme Context** for persistent theme management

## Event Kinds Coverage

Currently documents **95+ event kinds** across all major categories:

- **Basic Events**: Kind 0 (metadata), Kind 1 (notes), Kind 3 (follows)
- **Messaging**: Kind 4 (encrypted DMs), Kind 14 (gift wrap), Kind 17 (reactions to websites)  
- **Interactions**: Kind 6 (reposts), Kind 7 (reactions), Kind 9734/9735 (zap requests/receipts)
- **Content**: Kind 30023 (long-form articles), Kind 1063 (file metadata), Kind 21/22 (videos)
- **Lists**: Kind 10000+ (mute/pin/bookmark lists), Kind 30000+ (categorized lists)
- **Communities**: Kind 34550 (community definitions), Kind 39000+ (group management)
- **Calendar**: Kind 31922+ (events, RSVPs, calendars)
- **Development**: Kind 1617+ (patches, issues, repositories)
- **And many more...**

Each event kind includes:
- Detailed descriptions and use cases
- NIP reference links
- Tag specifications where applicable
- Event category classification (regular, replaceable, addressable)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [kind]/            # Dynamic routes for individual event kinds
│   ├── ai-reference/      # AI documentation endpoint
│   └── layout.tsx         # Root layout with theme provider
├── components/            # React components
│   ├── SearchBar.tsx      # Fuzzy search interface
│   ├── Sidebar.tsx        # Collapsible event kinds list
│   ├── MainContent.tsx    # Event details display
│   └── ThemeToggle.tsx    # Light/dark/system theme switcher
├── contexts/              # React contexts
│   └── ThemeContext.tsx   # Theme state management
├── data/                  # Static data
│   ├── eventKinds.ts      # Event kinds definitions
│   ├── eventsData.ts      # Real event examples (currently empty)
│   └── libraryExamples.ts # Code examples for nostr-tools/NDK
└── types/                 # TypeScript definitions
```

## Development

```bash
# Run development server with hot reload
npm run dev

# Build optimized production site
npm run build

# Lint code for consistency
npm run lint

# The built static site will be in the `out/` directory
```

## Key Features

- **Direct Navigation**: Visit `/[kind]` (e.g., `/1`, `/30023`) to jump directly to any event kind
- **Intelligent Search**: Uses Fuse.js for fuzzy matching across names, descriptions, and NIPs
- **Mobile Optimized**: Responsive design with touch-friendly collapsible sidebar
- **Accessibility**: Proper ARIA labels, keyboard navigation, and semantic HTML
- **Fast Performance**: Static generation with optimized bundle splitting
- **Theme Persistence**: Remembers user's theme preference across sessions

## Contributing

Contributions welcome! This project helps make Nostr development more accessible by providing clear, working examples of every event kind.

To contribute:
1. Fork the repository
2. Add new event kinds to `src/data/eventKinds.ts`
3. Include proper NIP references and tag specifications
4. Test the search and navigation functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
