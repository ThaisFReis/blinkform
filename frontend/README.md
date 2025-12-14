# BlinkForm Frontend

This is the frontend application for [BlinkForm](https://github.com/your-repo/blinkform), a no-code visual builder for creating Solana Blinks (Actions) with an intuitive drag-and-drop interface. Build complex transaction flows, forms, and interactive experiences without writing code.

## Getting Started

First, ensure you have the backend running. See the main [README.md](../README.md) for full setup instructions.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start building forms by navigating to `/builder`. The page auto-updates as you edit the file.

## Features

- **Visual Flow Builder**: Drag-and-drop interface for creating complex transaction flows
- **Solana Integration**: Native support for Solana Actions and Blinks protocol
- **Mobile Responsive**: Fully responsive design with mobile-optimized preview
- **Real-time Preview**: See your forms in action on mobile devices
- **Node-Based Architecture**: Modular components for inputs, transactions, NFTs, and more

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Flow Builder**: [React Flow](https://reactflow.dev/) (xyflow)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **Blinks**: [@dialectlabs/blinks](https://github.com/dialectlabs/blinks)

## Project Structure

```
frontend/
├── src/
│   ├── app/             # Next.js app router pages
│   │   ├── builder/     # Form builder page
│   │   ├── form/[id]/   # Form rendering page
│   │   └── page.tsx     # Home page
│   ├── components/      # React components
│   │   ├── nodes/       # Flow builder node types
│   │   └── sidebars/    # Builder sidebars
│   ├── store/           # Zustand state management
│   └── types/           # TypeScript type definitions
└── package.json
```

## Learn More

For more information about the project, including backend setup and API documentation, see the main [README.md](../README.md).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
