# Advanced Data Grid

Production-grade virtualized data grid built from scratch with React 18+ and TypeScript.

## Features

- ✅ **50,000+ rows** with custom virtualization
- ✅ **Sticky headers** with pinned left/right columns
- ✅ **Custom cell renderers** for flexible data display
- ✅ **60 FPS scrolling** performance
- 🚧 Multi-column sorting
- 🚧 Column resizing & reordering
- 🚧 In-cell editing with async validation
- 🚧 Full keyboard navigation & ARIA support

## Tech Stack

- **React 19** with TypeScript strict mode
- **Next.js 16** (App Router)
- **Tailwind CSS v4** with black/white design tokens
- **Custom virtualization** (no external libraries)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the grid with 50,000 rows.

## Structure

```
components/DataGrid/
├── DataGrid.tsx           # Main grid component
├── types/index.ts         # TypeScript definitions
├── hooks/
│   └── useVirtualization.ts  # Custom virtualization logic
└── utils/                 # Utility functions
```

## Constraints

Built following strict requirements:
- No component libraries (MUI, Radix, ShadCN, etc.)
- No table/virtualization libraries (react-table, tanstack, react-window)
- All logic implemented manually
- TypeScript strict mode with `noUncheckedIndexedAccess`
- Accessibility-first approach

## Performance

- Only visible rows rendered in DOM
- Efficient scroll handling with ResizeObserver
- Memoized calculations for optimal re-renders
- Target: 60 FPS sustained scrolling

## License

MIT
