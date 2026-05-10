# TikTak.OnChain

A cryptographic TicTacToe game where every completed game is recorded as a block on an in-browser blockchain. Built with Rust game logic (TypeScript port running in browser) and a full blockchain ledger viewer.

## Run & Operate

- `pnpm --filter @workspace/tictactoe run dev` — run the game (port auto-assigned)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/tictactoe run build:wasm` — compile Rust → WASM (requires wasm32-unknown-unknown target)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS (shadcn/ui)
- Game logic: Rust source in `artifacts/tictactoe/wasm-game/src/lib.rs` (TypeScript port at `src/game/engine.ts`)
- Blockchain: FNV-1a hash-based proof-of-work, difficulty=2 prefix zeroes
- Routing: wouter
- Build: Vite

## Where things live

- `artifacts/tictactoe/src/game/engine.ts` — TypeScript port of the Rust game engine + blockchain (source of truth for runtime)
- `artifacts/tictactoe/wasm-game/src/lib.rs` — Rust source (for wasm-pack compilation when toolchain is available)
- `artifacts/tictactoe/src/hooks/use-game.tsx` — React context wiring game + blockchain state
- `artifacts/tictactoe/src/pages/game.tsx` — game board page
- `artifacts/tictactoe/src/pages/ledger.tsx` — blockchain explorer page
- `vercel.json` — Vercel deploy config (root level)

## Architecture decisions

- Game logic is written in Rust (`wasm-game/`) and ported 1:1 to TypeScript for browser execution. The TypeScript port uses identical algorithms (same FNV-1a hash, same mining loop, same win detection).
- Blockchain uses proof-of-work with difficulty=2 (hash must start with "00"). Each game result is a block containing winner, board snapshot, move history, timestamps, and a chain of hashes.
- The Blockchain and TicTacToe instances are stored in `useRef` (not useState) since they are mutable objects — only derived state arrays trigger re-renders.
- No backend required — entirely client-side. Blockchain state lives in memory for the session.

## Product

- Two-player TicTacToe (local multiplayer)
- After each game, result is mined as a blockchain block with a real proof-of-work hash
- Blockchain Ledger page shows full chain with hashes, nonces, board snapshots, and chain validity
- Stats: total games, X wins, O wins, draws

## Vercel Deployment

Deploy with Vercel. The `vercel.json` at the project root points to `artifacts/tictactoe/`. The build is pure static — no server required.

For full Rust/WASM compilation on Vercel, add a custom build image with Rust stable + wasm32-unknown-unknown target and update the `build` script to include `pnpm run build:wasm`.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Rust WASM compilation requires wasm32-unknown-unknown in the Rust sysroot. Nix-managed Rust on Replit doesn't include this target — use `rustup` for wasm development.
- The `build:wasm` script is separate from `build` intentionally so the app can run without Rust toolchain.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
