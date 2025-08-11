# Nostr Event Kinds Reference

A comprehensive, searchable reference for Nostr event kinds with documentation and library usage examples.

## Features

🔍 **Advanced Search**: Search by event kind number, name, description, or NIP  
📱 **Mobile-Friendly**: Responsive email client-style layout that works on all devices  
📚 **Code Examples**: Ready-to-use code snippets for nostr-tools and NDK  
🚀 **Static Site**: Built with Next.js static export for fast, serverless deployment  
🔄 **Auto-Deploy**: GitHub Actions automatically builds and deploys to GitHub Pages  

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

- **Next.js 15** with TypeScript and static export
- **Tailwind CSS** for styling
- **Client-side search** with instant filtering
- **GitHub Pages** deployment ready

## Event Kinds Coverage

This reference includes comprehensive documentation for:

- **Basic Events**: Kind 0 (metadata), Kind 1 (notes), Kind 3 (follows)
- **Messaging**: Kind 4 (encrypted DMs), Kind 14 (gift wrap)  
- **Interactions**: Kind 6 (reposts), Kind 7 (reactions), Kind 9735 (zaps)
- **Content**: Kind 30023 (articles), Kind 1063 (file metadata)
- **Lists**: Kind 10000+ (mute/pin lists), Kind 30000+ (categorized lists)
- **And many more...**

Each event kind includes:
- Detailed documentation and specifications
- Tag specifications  
- NIP documentation links
- nostr-tools and NDK usage examples

## Development

```bash
# Run development server
npm run dev

# Build static site
npm run build

# The built site will be in the `out/` directory
```

## Deployment

This site is configured for automatic deployment to GitHub Pages via GitHub Actions. On every push to main:

1. Dependencies are installed
2. The site is built statically with Next.js  
3. Deployed to GitHub Pages automatically

## Contributing

Contributions welcome! This project helps make Nostr development more accessible by providing clear, working examples of every event kind.

## License

MIT License - see LICENSE file for details.
