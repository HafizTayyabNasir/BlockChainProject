/**
 * TicTacToe Game Engine + Blockchain
 * TypeScript port of the Rust/WASM implementation in wasm-game/src/lib.rs
 * Identical algorithms: same hash function, same blockchain structure, same game logic.
 */

export type Cell = 0 | 1 | 2; // 0=empty, 1=X, 2=O
export type Winner = 0 | 1 | 2 | 3; // 0=none, 1=X, 2=O, 3=draw

const WIN_LINES: [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

// FNV-1a based hash — mirrors the Rust simple_hash() function
function simpleHash(data: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);

  let h = BigInt("14695981039346656037");
  const FNV_PRIME = BigInt("1099511628211");
  const MASK64 = BigInt("0xFFFFFFFFFFFFFFFF");

  for (const b of bytes) {
    h ^= BigInt(b);
    h = (h * FNV_PRIME) & MASK64;
  }

  let part1 = h.toString(16).padStart(16, "0");

  const MUL2 = BigInt("6364136223846793005");
  const ADD2 = BigInt("1442695040888963407");
  let h2 = (h * MUL2 + ADD2) & MASK64;
  for (let i = bytes.length - 1; i >= 0; i--) {
    h2 ^= BigInt(bytes[i]);
    h2 = ((h2 * MUL2) + ADD2) & MASK64;
  }
  let part2 = h2.toString(16).padStart(16, "0");

  let h3 = (h + h2) * BigInt("2654435769") & MASK64;
  for (let i = 0; i < bytes.length; i += 4) {
    let v = BigInt(0);
    const chunk = bytes.slice(i, i + 4);
    for (const b of chunk) {
      v = (v * BigInt(31) + BigInt(b)) & MASK64;
    }
    h3 ^= v;
    const rotated = ((h3 << BigInt(17)) | (h3 >> BigInt(47))) & MASK64;
    h3 = (rotated * BigInt("2246822519")) & MASK64;
  }
  let part3 = h3.toString(16).padStart(16, "0");

  return (part1 + part2 + part3).slice(0, 64);
}

// ─── Game Engine ─────────────────────────────────────────────────────────────

export class TicTacToe {
  private board: Cell[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  private _currentPlayer: 1 | 2 = 1;
  private _gameOver = false;
  private _winner: Winner = 0;
  private _moveCount = 0;
  private _moveHistory: number[] = [];

  static new(): TicTacToe {
    return new TicTacToe();
  }

  makeMove(pos: number): boolean {
    if (this._gameOver || pos < 0 || pos >= 9 || this.board[pos] !== 0) {
      return false;
    }
    this.board[pos] = this._currentPlayer;
    this._moveCount++;
    this._moveHistory.push(pos);

    for (const [a, b, c] of WIN_LINES) {
      if (this.board[a] !== 0 && this.board[a] === this.board[b] && this.board[b] === this.board[c]) {
        this._winner = this._currentPlayer;
        this._gameOver = true;
        return true;
      }
    }

    if (this._moveCount === 9) {
      this._winner = 3;
      this._gameOver = true;
      return true;
    }

    this._currentPlayer = this._currentPlayer === 1 ? 2 : 1;
    return true;
  }

  getBoard(): Cell[] {
    return [...this.board];
  }

  currentPlayer(): 1 | 2 {
    return this._currentPlayer;
  }

  isGameOver(): boolean {
    return this._gameOver;
  }

  winner(): Winner {
    return this._winner;
  }

  reset(): void {
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this._currentPlayer = 1;
    this._gameOver = false;
    this._winner = 0;
    this._moveCount = 0;
    this._moveHistory = [];
  }

  getMoveHistory(): number[] {
    return [...this._moveHistory];
  }

  getWinningLine(): number[] {
    for (const [a, b, c] of WIN_LINES) {
      if (this.board[a] !== 0 && this.board[a] === this.board[b] && this.board[b] === this.board[c]) {
        return [a, b, c];
      }
    }
    return [];
  }
}

// ─── Blockchain ───────────────────────────────────────────────────────────────

export interface Block {
  index: number;
  timestamp: number;
  winner: string;
  board_snapshot: Cell[];
  move_history: number[];
  player_x: string;
  player_o: string;
  prev_hash: string;
  hash: string;
  nonce: number;
}

export interface ChainStats {
  total_games: number;
  x_wins: number;
  o_wins: number;
  draws: number;
  chain_length: number;
  is_valid: boolean;
}

const DIFFICULTY = 2;

function calculateHash(
  index: number,
  timestamp: number,
  winner: string,
  boardSnapshot: string,
  moveHistory: string,
  prevHash: string,
  nonce: number
): string {
  const data = `${index}${timestamp}${winner}${boardSnapshot}${moveHistory}${prevHash}${nonce}`;
  return simpleHash(data);
}

function mineBlock(
  index: number,
  timestamp: number,
  winner: string,
  boardSnapshot: string,
  moveHistory: string,
  prevHash: string
): { hash: string; nonce: number } {
  const prefix = "0".repeat(DIFFICULTY);
  let nonce = 0;
  while (nonce <= 100000) {
    const hash = calculateHash(index, timestamp, winner, boardSnapshot, moveHistory, prevHash, nonce);
    if (hash.startsWith(prefix)) {
      return { hash, nonce };
    }
    nonce++;
  }
  const hash = calculateHash(index, timestamp, winner, boardSnapshot, moveHistory, prevHash, nonce);
  return { hash, nonce };
}

export class Blockchain {
  private chain: Block[] = [];

  constructor() {
    const genesis: Block = {
      index: 0,
      timestamp: 0,
      winner: "genesis",
      board_snapshot: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      move_history: [],
      player_x: "Player X",
      player_o: "Player O",
      prev_hash: "0000000000000000000000000000000000000000000000000000000000000000",
      hash: simpleHash("genesis_block_tiktaktoe_2024"),
      nonce: 0,
    };
    this.chain = [genesis];
  }

  addGameResult(
    winner: string,
    boardSnapshot: Cell[],
    moveHistory: number[],
    timestamp: number,
    playerX: string,
    playerO: string
  ): string {
    const prevHash = this.chain[this.chain.length - 1]?.hash ?? "";
    const index = this.chain.length;
    const boardStr = JSON.stringify(boardSnapshot);
    const moveStr = JSON.stringify(moveHistory);
    const { hash, nonce } = mineBlock(index, timestamp, winner, boardStr, moveStr, prevHash);

    const block: Block = {
      index,
      timestamp,
      winner,
      board_snapshot: boardSnapshot,
      move_history: moveHistory,
      player_x: playerX,
      player_o: playerO,
      prev_hash: prevHash,
      hash,
      nonce,
    };

    this.chain.push(block);
    return hash;
  }

  getChain(): Block[] {
    return [...this.chain];
  }

  isValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const curr = this.chain[i];
      const prev = this.chain[i - 1];
      if (curr.prev_hash !== prev.hash) return false;
      const recalc = calculateHash(
        curr.index, curr.timestamp, curr.winner,
        JSON.stringify(curr.board_snapshot),
        JSON.stringify(curr.move_history),
        curr.prev_hash, curr.nonce
      );
      if (recalc !== curr.hash) return false;
    }
    return true;
  }

  getStats(): ChainStats {
    const games = this.chain.filter(b => b.index > 0);
    return {
      total_games: games.length,
      x_wins: games.filter(b => b.winner === "X").length,
      o_wins: games.filter(b => b.winner === "O").length,
      draws: games.filter(b => b.winner === "Draw").length,
      chain_length: this.chain.length,
      is_valid: this.isValid(),
    };
  }

  chainLength(): number {
    return this.chain.length;
  }
}
