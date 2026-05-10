# TikTak On-Chain Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [What is TikTak On-Chain?](#what-is-tiktak-on-chain)
3. [Architecture](#architecture)
4. [Blockchain Implementation](#blockchain-implementation)
5. [Project Structure](#project-structure)
6. [Features](#features)
7. [Technology Stack](#technology-stack)
8. [Getting Started](#getting-started)
9. [Game Mechanics](#game-mechanics)
10. [Blockchain Ledger](#blockchain-ledger)

---

## 🎯 Project Overview

**TikTak On-Chain** is a blockchain-based Tic-Tac-Toe game that combines a classic gaming experience with cryptographic verification and decentralized record-keeping. Every game played is recorded on an immutable blockchain ledger, ensuring transparency and preventing cheating.

The project demonstrates:
- **Blockchain fundamentals** - Hashing, block structure, chain validation
- **Cryptographic verification** - Game integrity through cryptographic hashing
- **Full-stack web application** - React frontend, Express backend, TypeScript throughout
- **Web3 integration** - Wallet connections and on-chain game records
- **Payment system** - Credit-based gameplay with purchase options

---

## 🎮 What is TikTak On-Chain?

### Core Concept
TikTak On-Chain is a turn-based Tic-Tac-Toe game where:
- Two players compete to get three marks in a row (standard Tic-Tac-Toe rules)
- Every move and game result is cryptographically hashed and stored
- All game records are organized in a blockchain structure
- Players can view the complete game history in the "Blockchain Ledger"
- Wallet addresses can be connected to track player identities

### Key Innovation
The blockchain integration ensures:
- **Immutability** - Game history cannot be altered
- **Transparency** - All game records are publicly visible
- **Verifiability** - Using FNV-1a hashing algorithm to verify game integrity
- **Decentralization** - Preparing for future on-chain consensus

### Game Flow
1. User logs in / creates account
2. Purchases game credits via payment system
3. Plays Tic-Tac-Toe against another player or AI
4. Game result is automatically recorded to blockchain
5. User can view complete game history in ledger
6. User can connect wallet to record identity on-chain

---

## 🏗️ Architecture

### High-Level Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  ┌──────────────┬──────────────┬──────────────────────┐    │
│  │ Game Page    │ Ledger Page  │ Auth Pages (Login,   │    │
│  │ (TicTacToe)  │ (Blockchain) │ Signup, Profile)     │    │
│  │              │              │ Payment System       │    │
│  └──────────────┴──────────────┴──────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓ API
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express.js)                      │
│  ┌─────────────┬──────────────┬──────────────┐             │
│  │ Game Engine │ Blockchain   │ Health Check │             │
│  │ Logic       │ Ledger       │ Endpoints    │             │
│  └─────────────┴──────────────┴──────────────┘             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Database & Storage Layer                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Blockchain Ledger (In-Memory / Persistent)         │    │
│  │ Game Records | Block Hashes | Player Stats         │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Component Organization

#### Frontend (`artifacts/tictactoe/`)
- **Game Page** - Interactive Tic-Tac-Toe board
- **Ledger Page** - Blockchain explorer showing all games
- **Auth Pages** - Login, Signup, User Profile
- **Payment Page** - Credit purchase interface
- **Layout Component** - Navigation and header

#### Backend (`artifacts/api-server/`)
- **Game Engine** - Handles game logic
- **Blockchain Module** - Manages ledger
- **API Routes** - RESTful endpoints
- **Health Check** - Server status monitoring

#### Shared Libraries (`lib/`)
- `api-spec/` - OpenAPI specification
- `api-zod/` - Type definitions
- `db/` - Database schema (Drizzle ORM)
- `api-client-react/` - React API client

---

## ⛓️ Blockchain Implementation

### 1. **Core Blockchain Structure**

#### Block Format
```typescript
interface Block {
  index: number;           // Block position in chain
  timestamp: string;       // ISO 8601 timestamp
  game_data: {
    board: number[];       // Final board state (9 cells)
    player_x: string;      // Player X identifier
    player_o: string;      // Player O identifier
    winner: number;        // 0=none, 1=X, 2=O, 3=draw
    moves: number[];       // Sequence of moves
  };
  previous_hash: string;   // Hash of previous block
  hash: string;            // Current block's hash
  nonce: number;           // Proof-of-work nonce
}
```

#### Game Data Storage
```typescript
type GameData = {
  board: Cell[];           // 0=empty, 1=X, 2=O
  player_x: string;        // Player identifier
  player_o: string;        // Opponent identifier
  winner: Winner;          // Game outcome
  moves: number[];         // Move sequence (0-8 positions)
  timestamp: string;       // When game ended
};
```

### 2. **Hashing Algorithm**

TikTak uses **FNV-1a** (Fowler-Noll-Vo) hashing for consistency with the Rust/WASM implementation:

```typescript
function simpleHash(data: string): string {
  // FNV-1a 64-bit hash implementation
  // Produces 64-character hexadecimal hash
  // Used to create block hashes for chain verification
}
```

**Hash Process:**
1. Serialize game data to JSON string
2. Apply FNV-1a algorithm (3-part hash for robustness)
3. Generate 64-char hex hash
4. Include previous block's hash for chain linkage

**Example Hash:**
```
a3f5e8c2d9b7e1f4c6a9d2e8f5b3c1a7e9d6c3f0a7b4e1f8d5c2a9b6e3f0a7
```

### 3. **Chain Validation**

The blockchain validates integrity through:

```typescript
interface ChainStats {
  chain_length: number;     // Total blocks
  is_valid: boolean;        // Chain integrity status
  total_games: number;      // Games recorded
  x_wins: number;           // Player X victories
  o_wins: number;           // Player O victories
  draws: number;            // Drawn games
}
```

**Validation Rules:**
1. ✅ Each block's `previous_hash` matches previous block's `hash`
2. ✅ Each block's `hash` correctly hashes its content
3. ✅ No gaps in block indices
4. ✅ Block ordering is chronological

**Validation Display:**
- Green badge: **CHAIN VALID** - All blocks verified
- Red badge: **CHAIN INVALID** - Integrity compromised

### 4. **Game Recording Flow**

```
Game Starts
    ↓
Player makes moves (X and O alternating)
    ↓
Game ends (Win/Draw)
    ↓
Create GameData object
    ↓
Serialize to JSON
    ↓
Hash with previous block's hash
    ↓
Create new Block
    ↓
Append to Blockchain
    ↓
Emit 'block_mined' event
    ↓
Display block hash in UI toast
    ↓
Update Ledger page with new game
```

### 5. **Blockchain Ledger Features**

The Ledger Page displays:

#### Statistics Dashboard
- **Total Games** - Cumulative games played
- **X Wins** - Games won by Player X
- **O Wins** - Games won by Player O
- **Draws** - Games that ended in draw

#### Block Explorer
Each block shows:
- **Block Index** - Position in chain
- **Block Hash** - Cryptographic identifier
- **Previous Hash** - Link to parent block
- **Game Result** - Who won and when
- **Players** - Identifiers of participants
- **Moves** - Complete move sequence
- **Timestamp** - When block was created

#### Chain Validation Status
- Real-time verification badge
- Indicates if any block has been tampered with

---

## 📁 Project Structure

```
tiktak-onchain/
├── artifacts/
│   ├── api-server/              # Express.js backend
│   │   ├── src/
│   │   │   ├── app.ts           # Express app setup
│   │   │   ├── index.ts         # Server entry point
│   │   │   ├── lib/
│   │   │   │   └── logger.ts    # Logging utility
│   │   │   ├── routes/
│   │   │   │   ├── health.ts    # Health check endpoint
│   │   │   │   └── index.ts     # Route aggregator
│   │   │   └── middlewares/     # Custom middleware
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── build.mjs            # Build script
│   │
│   ├── tictactoe/               # React frontend (main game)
│   │   ├── src/
│   │   │   ├── App.tsx          # Main app component
│   │   │   ├── main.tsx         # Entry point
│   │   │   ├── pages/
│   │   │   │   ├── game.tsx     # Tic-Tac-Toe game page
│   │   │   │   ├── ledger.tsx   # Blockchain ledger explorer
│   │   │   │   ├── login.tsx    # Login page
│   │   │   │   ├── signup.tsx   # Signup page
│   │   │   │   ├── payment.tsx  # Payment/credits page
│   │   │   │   ├── profile.tsx  # User profile & settings
│   │   │   │   └── not-found.tsx # 404 page
│   │   │   ├── components/
│   │   │   │   ├── layout.tsx   # Header & navigation
│   │   │   │   └── ui/          # Radix UI components
│   │   │   ├── game/
│   │   │   │   └── engine.ts    # TicTacToe logic & blockchain
│   │   │   ├── hooks/
│   │   │   │   ├── use-game.tsx      # Game state management
│   │   │   │   ├── use-auth.tsx      # Authentication
│   │   │   │   ├── use-payment.tsx   # Payment handling
│   │   │   │   └── use-toast.ts      # Notifications
│   │   │   ├── lib/
│   │   │   │   └── utils.ts     # Utility functions
│   │   │   └── index.css        # Tailwind CSS
│   │   ├── wasm-game/           # Rust WASM implementation
│   │   │   ├── Cargo.toml
│   │   │   └── src/
│   │   │       └── lib.rs       # WASM game engine (reference)
│   │   ├── vite.config.ts       # Vite build configuration
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── mockup-sandbox/          # Component showcase
│       └── src/components/mockups/
│           ├── payment-module.tsx
│           ├── login-module.tsx
│           ├── signup-module.tsx
│           └── profile-module.tsx
│
├── lib/
│   ├── api-spec/                # OpenAPI specification
│   │   ├── openapi.yaml
│   │   └── orval.config.ts
│   ├── api-zod/                 # Zod type definitions
│   │   └── src/
│   │       ├── index.ts
│   │       └── generated/
│   ├── api-client-react/        # React query client
│   │   └── src/
│   │       ├── custom-fetch.ts
│   │       └── index.ts
│   ├── db/                      # Database schema (Drizzle)
│   │   ├── src/
│   │   │   └── schema/
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   └── scripts/
│       ├── post-merge.sh        # Git hook
│       ├── package.json
│       └── src/
│
├── pnpm-workspace.yaml          # Workspace configuration
├── package.json                 # Root dependencies
├── tsconfig.base.json          # Base TypeScript config
├── tsconfig.json               # Root TypeScript config
├── vercel.json                 # Deployment config
└── README.md
```

---

## ✨ Features

### Game Features
- ✅ **Interactive Tic-Tac-Toe** - Two-player gameplay
- ✅ **Turn-based mechanics** - Clear player indicators
- ✅ **Win detection** - Automatic detection of wins/draws
- ✅ **Winning line highlighting** - Visual feedback
- ✅ **Game reset** - Start new game anytime

### Blockchain Features
- ✅ **Immutable records** - All games recorded forever
- ✅ **Cryptographic hashing** - FNV-1a algorithm
- ✅ **Chain validation** - Real-time verification
- ✅ **Game statistics** - Win/loss/draw tracking
- ✅ **Ledger explorer** - Browse all games
- ✅ **Block details** - View complete game history

### Authentication Features
- ✅ **User registration** - Create accounts
- ✅ **Secure login** - Session management
- ✅ **Profile management** - User settings
- ✅ **Wallet connection** - Link blockchain wallet
- ✅ **User persistence** - LocalStorage-based state

### Payment Features
- ✅ **Credit system** - Game access via credits
- ✅ **Multiple plans** - Starter/Pro/Premium options
- ✅ **Payment processing** - Card payment simulation
- ✅ **Transaction history** - Track purchases
- ✅ **Payment methods** - Manage payment cards

### UI/UX Features
- ✅ **Responsive design** - Works on mobile/desktop
- ✅ **Dark theme** - Professional aesthetic
- ✅ **Smooth animations** - Polished interactions
- ✅ **Toast notifications** - Real-time feedback
- ✅ **Loading states** - Clear async feedback

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **React Hook Form** - Form management
- **Wouter** - Lightweight routing
- **Tanstack React Query** - Data fetching

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Node.js** - Runtime

### Blockchain
- **Custom TS Implementation** - Game engine with blockchain
- **Rust/WASM** - Performance-critical blockchain (optional)
- **FNV-1a Hashing** - Cryptographic hash function

### Database
- **Drizzle ORM** - Type-safe database layer
- **PostgreSQL** - (Future) Production database

### DevOps & Deployment
- **pnpm** - Package manager (v10.26.1)
- **Vercel** - Deployment platform
- **Git** - Version control

### Development Tools
- **ESBuild** - Fast bundling
- **Tailwind CSS Vite** - CSS processing
- **Zod** - Schema validation

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- pnpm v10+
- Git

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/HafizTayyabNasir/BlockChainProject.git
   cd tiktak-onchain
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build all packages**
   ```bash
   pnpm run build
   ```

### Running the Application

#### Development Mode
```bash
# Start frontend (runs on http://localhost:5173)
cd artifacts/tictactoe
pnpm run dev

# In another terminal, start backend (runs on http://localhost:3000)
cd artifacts/api-server
pnpm run dev
```

#### Production Build
```bash
# Build everything
pnpm run build

# Start frontend
cd artifacts/tictactoe
pnpm run serve

# Start backend
cd artifacts/api-server
npm start
```

### Deployment
The project is configured for Vercel:
```bash
# Deploy frontend
vercel deploy artifacts/tictactoe

# Deploy backend
vercel deploy artifacts/api-server
```

---

## 🎯 Game Mechanics

### Tic-Tac-Toe Rules
1. **Board**: 3x3 grid (9 positions)
2. **Players**: X and O
3. **Turns**: Players alternate placing marks
4. **Win condition**: Three marks in a row (horizontal, vertical, diagonal)
5. **Draw**: All 9 positions filled with no winner

### Winning Lines
```
[0][1][2]     Horizontal: [0,1,2], [3,4,5], [6,7,8]
[3][4][5]     Vertical:   [0,3,6], [1,4,7], [2,5,8]
[6][7][8]     Diagonal:   [0,4,8], [2,4,6]
```

### Game State Management
```typescript
interface GameState {
  board: Cell[];           // Current board state
  currentPlayer: 1 | 2;    // Whose turn
  isGameOver: boolean;     // Game finished
  winner: Winner;          // Outcome
  moveCount: number;       // Moves made
  moveHistory: number[];   // Move sequence
}
```

### Move Validation
- ✅ Position must be empty (0)
- ✅ Game must not be over
- ✅ Position must be 0-8
- ✅ Player can only move on their turn

---

## ⛓️ Blockchain Ledger

### Ledger Page Layout

#### 1. Statistics Dashboard
Shows aggregate game statistics:
- Total Games Played
- Player X Victories
- Player O Victories
- Draw Count

#### 2. Chain Status
- **Chain Validation**: ✅ CHAIN VALID or ❌ CHAIN INVALID
- **Block Count**: Total blocks in ledger
- **Chain Length**: Index of latest block

#### 3. Block Explorer
Displays each block with:
- **Block #N** - Position in blockchain
- **Hash**: Cryptographic identifier
  ```
  a3f5e8c2d9b7e1f4c6a9d2e8f5b3c1a7...
  ```
- **Previous Hash**: Parent block reference
- **Game**: Shows winner and timestamp
- **Players**: X and O identifiers
- **Moves**: Complete move sequence (0-8)

#### 4. Block Details
Each block entry shows:
```
Block #42
├── Hash: a3f5e8c2...
├── Previous: 7d2c9e1f...
├── Game Result: Player X Wins (May 10, 2026 22:45:12)
├── Players: player1 vs player2
└── Moves: [4, 0, 1, 3, 2, 6, 7, 8]
```

### Verification Flow
1. Load blockchain from memory/storage
2. Iterate through each block
3. Verify each block's hash matches recalculated hash
4. Verify previous_hash chain linkage
5. Display validation badge

---

## 📊 Example Game Flow

### Step 1: User Launches Game
```
User visits app → Presented with login screen
User logs in → Redirected to game page
User sees empty board with "Player X Turn" status
```

### Step 2: Players Make Moves
```
Player X clicks position 4 (center)
┌─────────────┐
│     │     │     │
├─────────────┤
│     │  X  │     │
├─────────────┤
│     │     │     │
└─────────────┘
Display shows "Player O Turn"

Player O clicks position 0 (top-left)
┌─────────────┐
│  O  │     │     │
├─────────────┤
│     │  X  │     │
├─────────────┤
│     │     │     │
└─────────────┘
Display shows "Player X Turn"
```

### Step 3: Game Concludes
```
Player X completes winning line [0,4,8]
Display shows "Player X Wins"

System generates game data:
{
  board: [1, 0, 0, 0, 1, 0, 0, 0, 1],
  player_x: "user_123",
  player_o: "ai_bot",
  winner: 1,
  moves: [4, 0, 1, 3, 2, 6, 7, 8],
  timestamp: "2026-05-10T22:45:12Z"
}
```

### Step 4: Blockchain Recording
```
Serialize game data → JSON
Calculate hash using FNV-1a → "a3f5e8c2..."
Create block with:
  - index: 42
  - hash: "a3f5e8c2..."
  - previous_hash: "7d2c9e1f..."
  - game_data: {...}
Append to blockchain
Emit 'block_mined' event
Display toast: "Block Mined - a3f5e8c2..."
```

### Step 5: View in Ledger
```
User clicks "Ledger" button
Views updated statistics:
  - Total Games: 42
  - X Wins: 28
  - O Wins: 10
  - Draws: 4
Sees newest block at top of explorer:
  - Block #42
  - Hash: a3f5e8c2...
  - Result: Player X Wins
  - Players: user_123 vs ai_bot
  - Moves: [4, 0, 1, 3, 2, 6, 7, 8]
```

---

## 🔐 Security Considerations

### Current Implementation
- ✅ Frontend-based authentication (localStorage)
- ✅ Cryptographic game hashing
- ✅ Blockchain chain validation
- ✅ Read-only ledger display

### Future Enhancements
- 🔲 Backend authentication with JWT tokens
- 🔲 Database persistence
- 🔲 Smart contract integration (Solidity/Ethereum)
- 🔲 Multi-signature game moves
- 🔲 Zero-knowledge proofs for private games
- 🔲 Rate limiting and DDoS protection

---

## 📝 API Specification

### Current Endpoints
```
GET /api/healthz
  Response: { status: "healthy" }
```

### Planned Endpoints
```
POST /api/game/start
  Request: { player_x: string, player_o: string }
  Response: { game_id: string, board: [...] }

POST /api/game/move
  Request: { game_id: string, position: number }
  Response: { board: [...], currentPlayer: number }

GET /api/blockchain/ledger
  Response: { chain: Block[], stats: ChainStats }

POST /api/auth/register
  Request: { username, email, password }
  Response: { token, user }

POST /api/auth/login
  Request: { email, password }
  Response: { token, user }

POST /api/payment/purchase
  Request: { plan: string, amount: number }
  Response: { transaction_id, credits }
```

---

## 🤝 Contributing

### Development Workflow
1. Create feature branch: `git checkout -b feature/blockchain-upgrade`
2. Make changes and commit: `git commit -m "feat: add feature"`
3. Push to GitHub: `git push origin feature/blockchain-upgrade`
4. Create Pull Request with description

### Code Standards
- TypeScript with strict mode enabled
- ESLint/Prettier for formatting
- Type safety over any
- Test coverage for blockchain logic

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎓 Learning Resources

### Blockchain Concepts
- **FNV-1a Hashing** - Non-cryptographic fast hash function
- **Block Structure** - Index, timestamp, data, hash, prev_hash
- **Chain Validation** - Verifying hash chain integrity
- **Immutability** - Why changing one block breaks the chain

### Game Development
- **Game Loop** - Turn-based mechanics in React
- **State Management** - useContext and hooks
- **Animation** - CSS-in-JS with Tailwind

### Web3 Integration
- **Wallet Connection** - Preparing for MetaMask/Web3
- **Smart Contracts** - Future on-chain game storage
- **Token Economics** - Credit system design

---

## 📞 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: developer@tiktak-onchain.com

---

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Tic-Tac-Toe game engine
- ✅ Blockchain ledger with FNV-1a hashing
- ✅ React frontend with Tailwind CSS
- ✅ Authentication system (client-side)
- ✅ Payment integration (simulated)
- ✅ Ledger explorer
- ✅ Responsive UI

### v1.1.0 (Planned)
- 🔲 Backend blockchain persistence
- 🔲 Smart contract integration
- 🔲 Multiplayer real-time games
- 🔲 Leaderboards
- 🔲 Achievements system

### v2.0.0 (Future)
- 🔲 NFT integration
- 🔲 DAO governance
- 🔲 Cross-chain compatibility
- 🔲 Advanced game modes

---

**Last Updated**: May 10, 2026
**Project Status**: Active Development ✨
**Blockchain Chain**: Valid ✅

---

Generated for: TikTak On-Chain Blockchain Game Project
Documentation Version: 1.0.0
