AlgoViz

https://img.shields.io/badge/Next.js-16-black
https://img.shields.io/badge/TypeScript-5-blue
https://img.shields.io/badge/TailwindCSS-4-blue
https://img.shields.io/badge/license-MIT-green

An interactive educational platform for visualizing algorithms and data structures in real time. Step through sorting algorithms bar-by-bar, watch BFS and DFS explore a graph node-by-node, and manipulate data structures with live visual feedback — all with adjustable playback speed and complexity analysis panels.
Live Demo

Thembisile Makhubu

Computer Science undergraduate passionate about software engineering, algorithms, and building interactive educational tools.

    GitHub: https://github.com/TS-mak

    LinkedIn: https://www.linkedin.com/in/thembisile-makhubu-seipati

    Portfolio: https://personal-website-pmsz.vercel.app/

This project was designed and developed as part of my personal software engineering portfolio to demonstrate practical applications of algorithms, data structures, interactive visualization, and modern frontend engineering.
Project Motivation

Algorithms and data structures are fundamental concepts in computer science, but many learners struggle to understand their behaviour through code alone.

AlgoViz was created to bridge the gap between theory and implementation by providing an interactive environment where users can visually explore algorithm execution step-by-step.

The goal of this project is to make complex computational concepts easier to understand through real-time visualization while demonstrating practical applications of:

    Algorithm design

    State management

    Data visualization

    User interface engineering

    Computational complexity analysis

Features
Sorting Algorithms

All sorting algorithms are visualized as animated bar charts. Each bar changes color to represent its current state:
Color	Meaning
Teal (default)	Unsorted element
Yellow	Currently being compared
Red/Orange	Being swapped
Purple	Pivot element (Quick Sort)
Green	Confirmed sorted position

Available algorithms:

    Bubble Sort

    Insertion Sort

    Selection Sort

    Merge Sort

    Quick Sort

    Heap Sort

Graph Algorithms

Visualized on an interactive SVG canvas with labeled nodes and weighted edges.

Available algorithms:

    Breadth-First Search (BFS)

    Depth-First Search (DFS)

    Dijkstra's Shortest Path

Node states are color-coded: unvisited (neutral), in queue/stack (yellow), currently processing (orange), and fully visited (green). The source node is highlighted in teal.
Data Structures

Each data structure is fully interactive — use the input field and operation buttons to modify the structure and see it update live.
Data Structure	Supported Operations
Array	Insert, Delete
Linked List	Insert head, Insert tail, Delete head
Stack	Push, Pop
Queue	Enqueue, Dequeue
Binary Search Tree	Insert, Search
Hash Table	Insert (key/value), Delete
Playback Controls

Every visualizer shares a common set of controls:

    Play / Pause — animate through steps automatically

    Step back / Step forward — advance or rewind one step at a time

    Reset — return to the initial state

    Shuffle — generate a new random input

    Speed — six speed settings from 0.25x to 4x

Complexity Panel

A dedicated panel on each algorithm view shows:

    Best, average, and worst-case time complexity

    Space complexity

    Stability and in-place badges

    A short plain-English description of the algorithm

Computer Science Concepts Demonstrated
Algorithms

    Sorting algorithms (Bubble, Insertion, Selection, Merge, Quick, Heap)

    Graph traversal (BFS, DFS)

    Shortest path algorithms (Dijkstra)

Data Structures

    Arrays

    Linked Lists

    Stacks

    Queues

    Trees

    Hash Tables

Complexity Analysis

    Big-O notation

    Time complexity

    Space complexity

Software Engineering

    Component architecture

    State management

    Type-safe development

    Responsive UI design

Tech Stack

    Framework: Next.js 16 (App Router)

    Language: TypeScript (strict mode)

    Styling: Tailwind CSS v4 with custom design tokens

    Animations: Framer Motion

    Icons: Lucide React

    Font: JetBrains Mono (monospace, loaded via next/font/google)

Architecture Overview

AlgoViz follows a component-based architecture using Next.js and React.
text

User Interaction
        |
        ↓
React Components
        |
        ↓
Visualization Engine
        |
        ↓
Algorithm Generators
        |
        ↓
Step-by-step State Updates

Each algorithm is implemented as a generator function that produces intermediate states. Instead of directly modifying the UI during execution, algorithms produce a sequence of states that the visualization layer consumes.

This separation allows:

    Algorithms to remain independent from UI components

    Playback controls to work consistently

    Easy addition of new algorithms

    Better testing

Prerequisites

Before running the project, make sure you have the following installed on your machine:
Tool	Minimum Version	Notes
Node.js	18.x or higher	v20 LTS recommended; v24 confirmed working
pnpm	8.x or higher	Preferred package manager for this project

    Don't have pnpm? Install it globally once with:
    bash

    npm install -g pnpm

Getting Started
1. Clone or download the project

If you downloaded the project as a ZIP from v0, unzip it to a folder of your choice. If you have a Git repository:
bash

git clone <your-repo-url>
cd algoviz

2. Install dependencies
bash

pnpm install

This installs all packages listed in package.json, including Next.js, React, Framer Motion, Lucide React, Tailwind CSS, and all dev tooling.
3. Start the development server
bash

pnpm dev

Open http://localhost:3000 in your browser. The app supports Hot Module Replacement (HMR), so file changes reflect instantly without a full reload.
4. Build for production (optional)
bash

pnpm build
pnpm start

pnpm build compiles an optimized production bundle. pnpm start serves it locally on port 3000.
Project Structure
text

algoviz/
├── app/
│   ├── layout.tsx              # Root layout — fonts, metadata, html shell
│   ├── page.tsx                # Entry point, renders <AlgoViz />
│   └── globals.css             # Tailwind v4 theme tokens, design system colors
│
├── components/
│   ├── algo-viz.tsx            # Main shell — sidebar navigation, view routing
│   ├── navbar.tsx              # Top navigation bar with logo and category tabs
│   ├── sort-visualizer.tsx     # Bar chart visualizer for all sorting algorithms
│   ├── graph-visualizer.tsx    # SVG canvas visualizer for BFS, DFS, Dijkstra
│   ├── data-structure-visualizer.tsx  # All data structure visualizations
│   ├── playback-controls.tsx   # Play/pause/step/speed/reset/shuffle controls
│   ├── complexity-panel.tsx    # Big-O complexity badges and description cards
│   └── ui/
│       └── button.tsx          # shadcn base Button component
│
└── lib/
    ├── types.ts                # Shared TypeScript interfaces (SortStep, GraphStep, etc.)
    ├── algorithms-meta.ts      # Metadata for every algorithm (complexity, description)
    ├── sort-generators.ts      # Generator functions producing step-by-step sort frames
    └── graph-generators.ts     # Generator functions producing step-by-step graph traversal frames

Algorithm Documentation

Detailed documentation for each algorithm's implementation and visualization approach can be found in the codebase. Each algorithm generator produces a structured sequence of steps that the visualizer consumes.

Sorting algorithms produce steps containing:

    Array state at each step

    Indices being compared or swapped

    Sorted indices

    Pivot indices (for Quick Sort)

Graph algorithms produce steps containing:

    Current node being processed

    Queue/stack state

    Visited nodes

    Distance values (for Dijkstra)

    Path reconstruction (for Dijkstra)

Engineering Challenges
Visualizing Algorithm Execution

Algorithms normally execute instantly, but visualization requires breaking execution into meaningful intermediate steps.

To solve this, AlgoViz uses generator functions that pause execution after each important operation and return the current state.

Example:

    Comparing two elements

    Swapping values

    Visiting a graph node

    Updating a data structure

Managing Complex UI State

The application manages multiple visualization states including:

    Current algorithm step

    Playback position

    Animation speed

    User inputs

    Algorithm metadata

React state management patterns were used to keep visualizations predictable and reusable.
Synchronizing Playback with Visualization

Ensuring smooth playback across different algorithm types required careful state management. The playback controls interact with a unified step-based system that works consistently across sorting, graph, and data structure visualizations.
Future Improvements

Planned features:

    User accounts

    Save and share visualizations

    More graph algorithms (A*, Floyd-Warshall)

    Dynamic programming visualizations

    Code execution playground

    Custom algorithm input support

    Performance benchmarking

    Mobile optimization

    Dark/light theme toggle

    Interactive algorithm code display

    Comprehensive test suite

Dependencies
Runtime dependencies
Package	Version	Purpose
next	^16.2.6	React framework (App Router, Server Components, Turbopack)
react	^19	UI library
react-dom	^19	DOM bindings for React
framer-motion	^12	Smooth bar and node animations
lucide-react	^1.16	Icon set (Play, Pause, SkipForward, etc.)
tailwind-merge	^3	Safely merge Tailwind class strings
clsx	^2	Conditional class name utility
class-variance-authority	^0.7	Variant-based component styling
tw-animate-css	^1.4	Additional Tailwind animation utilities
@base-ui/react	^1.5	Accessible headless UI primitives
@vercel/analytics	1.6.1	Web analytics (no-op in local dev)
Dev dependencies
Package	Version	Purpose
typescript	5.7.3	Static type checking
tailwindcss	^4.2	Utility-first CSS framework
@tailwindcss/postcss	^4.2	PostCSS plugin for Tailwind v4
postcss	^8.5	CSS transformation pipeline
@types/node	^24	Node.js type definitions
@types/react	^19	React type definitions
@types/react-dom	^19	ReactDOM type definitions
Available Scripts
Command	Description
pnpm dev	Start development server with HMR on http://localhost:3000
pnpm build	Create optimized production build in .next/
pnpm start	Serve the production build (run build first)
pnpm lint	Run ESLint across all source files
Troubleshooting

Port 3000 is already in use
Next.js will automatically try port 3001, 3002, etc. You can also specify a port explicitly:
bash

pnpm dev -- --port 4000

pnpm install fails with peer dependency errors
Make sure your Node.js version is 18 or higher. Check with node --version. Use nvm or fnm to manage multiple Node versions.

Animations are choppy
Try reducing the number of array elements using the Shuffle button (which randomizes input size) or lowering the playback speed. Devices with lower GPU performance may benefit from reducing animation complexity in framer-motion by setting reducedMotion: "user".

TypeScript errors on build
The project has ignoreBuildErrors: true set in next.config.mjs to allow the production build to succeed. For strict type checking during development, run pnpm exec tsc --noEmit.
License

This project is licensed under the MIT License. See the LICENSE file for details.

