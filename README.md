# Lapu Miniapp

A Farcaster Mini App built with Next.js, TypeScript, and React.

## Features

- 🔐 Farcaster authentication
- 🎮 Interactive mini app experience
- 🚀 Built with Next.js 15 and React 19
- 💅 Styled with Tailwind CSS
- 🔗 Web3 integration with wagmi and viem

## Prerequisites

- Node.js 18+
- npm or yarn or pnpm

## Getting Started

1. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   └── ...           # Pages and layouts
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions and configurations
├── public/              # Static assets
└── ...                  # Configuration files
```

## Environment Variables

See `.env.example` for required environment variables.

## Deployment

This app is optimized for deployment on Vercel:

```bash
vercel deploy
```

## Learn More

- [Farcaster Mini Apps Documentation](https://docs.farcaster.xyz/developers/mini-apps)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)

## License

MIT
