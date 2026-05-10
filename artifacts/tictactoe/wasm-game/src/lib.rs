use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

fn simple_hash(data: &str) -> String {
    let bytes = data.as_bytes();
    let mut h: u64 = 14695981039346656037u64;
    for &b in bytes {
        h ^= b as u64;
        h = h.wrapping_mul(1099511628211u64);
    }
    let mut result = format!("{:016x}", h);
    let mut h2: u64 = h.wrapping_mul(6364136223846793005u64).wrapping_add(1442695040888963407u64);
    for &b in bytes.iter().rev() {
        h2 ^= b as u64;
        h2 = h2.wrapping_mul(6364136223846793005u64).wrapping_add(1442695040888963407u64);
    }
    result.push_str(&format!("{:016x}", h2));
    let mut h3 = h.wrapping_add(h2).wrapping_mul(2654435769u64);
    for chunk in bytes.chunks(4) {
        let mut v: u64 = 0;
        for &b in chunk { v = v.wrapping_mul(31).wrapping_add(b as u64); }
        h3 ^= v;
        h3 = h3.rotate_left(17).wrapping_mul(2246822519u64);
    }
    result.push_str(&format!("{:016x}", h3));
    result[..64].to_string()
}

const WIN_LINES: [[usize; 3]; 8] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

#[wasm_bindgen]
pub struct TicTacToe {
    board: [u8; 9],
    current_player: u8,
    game_over: bool,
    winner: u8,
    move_count: u8,
    move_history: Vec<usize>,
}

#[wasm_bindgen]
impl TicTacToe {
    pub fn new() -> Self {
        TicTacToe {
            board: [0u8; 9],
            current_player: 1,
            game_over: false,
            winner: 0,
            move_count: 0,
            move_history: Vec::new(),
        }
    }

    pub fn make_move(&mut self, pos: usize) -> bool {
        if self.game_over || pos >= 9 || self.board[pos] != 0 {
            return false;
        }
        self.board[pos] = self.current_player;
        self.move_count += 1;
        self.move_history.push(pos);

        for &[a, b, c] in &WIN_LINES {
            if self.board[a] != 0 && self.board[a] == self.board[b] && self.board[b] == self.board[c] {
                self.winner = self.current_player;
                self.game_over = true;
                return true;
            }
        }

        if self.move_count == 9 {
            self.winner = 3;
            self.game_over = true;
            return true;
        }

        self.current_player = if self.current_player == 1 { 2 } else { 1 };
        true
    }

    pub fn get_board(&self) -> Vec<u8> {
        self.board.to_vec()
    }

    pub fn current_player(&self) -> u8 {
        self.current_player
    }

    pub fn is_game_over(&self) -> bool {
        self.game_over
    }

    pub fn winner(&self) -> u8 {
        self.winner
    }

    pub fn reset(&mut self) {
        self.board = [0u8; 9];
        self.current_player = 1;
        self.game_over = false;
        self.winner = 0;
        self.move_count = 0;
        self.move_history.clear();
    }

    pub fn get_move_history(&self) -> Vec<usize> {
        self.move_history.clone()
    }

    pub fn get_winning_line(&self) -> Vec<usize> {
        for &[a, b, c] in &WIN_LINES {
            if self.board[a] != 0 && self.board[a] == self.board[b] && self.board[b] == self.board[c] {
                return vec![a, b, c];
            }
        }
        Vec::new()
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Block {
    pub index: u32,
    pub timestamp: f64,
    pub winner: String,
    pub board_snapshot: Vec<u8>,
    pub move_history: Vec<usize>,
    pub player_x: String,
    pub player_o: String,
    pub prev_hash: String,
    pub hash: String,
    pub nonce: u32,
}

impl Block {
    fn calculate_hash(index: u32, timestamp: f64, winner: &str, board_snapshot: &str, move_history: &str, prev_hash: &str, nonce: u32) -> String {
        let data = format!("{}{}{}{}{}{}{}", index, timestamp, winner, board_snapshot, move_history, prev_hash, nonce);
        simple_hash(&data)
    }

    fn mine(index: u32, timestamp: f64, winner: &str, board_snapshot: &str, move_history_str: &str, prev_hash: &str, difficulty: usize) -> (String, u32) {
        let prefix = "0".repeat(difficulty);
        let mut nonce = 0u32;
        loop {
            let hash = Self::calculate_hash(index, timestamp, winner, board_snapshot, move_history_str, prev_hash, nonce);
            if hash.starts_with(&prefix) {
                return (hash, nonce);
            }
            nonce += 1;
            if nonce > 100000 { break; }
        }
        let hash = Self::calculate_hash(index, timestamp, winner, board_snapshot, move_history_str, prev_hash, nonce);
        (hash, nonce)
    }
}

#[wasm_bindgen]
pub struct Blockchain {
    chain: Vec<Block>,
    difficulty: usize,
}

#[wasm_bindgen]
impl Blockchain {
    pub fn new() -> Self {
        let genesis = Block {
            index: 0,
            timestamp: 0.0,
            winner: "genesis".to_string(),
            board_snapshot: vec![0u8; 9],
            move_history: Vec::new(),
            player_x: "Player X".to_string(),
            player_o: "Player O".to_string(),
            prev_hash: "0000000000000000000000000000000000000000000000000000000000000000".to_string(),
            hash: simple_hash("genesis_block_tiktaktoe_2024"),
            nonce: 0,
        };

        Blockchain {
            chain: vec![genesis],
            difficulty: 2,
        }
    }

    pub fn add_game_result(
        &mut self,
        winner: &str,
        board_json: &str,
        move_history_json: &str,
        timestamp: f64,
        player_x: &str,
        player_o: &str,
    ) -> String {
        let prev_hash = self.chain.last().map(|b| b.hash.clone()).unwrap_or_default();
        let index = self.chain.len() as u32;

        let board_snapshot: Vec<u8> = serde_json::from_str(board_json).unwrap_or_default();
        let move_history: Vec<usize> = serde_json::from_str(move_history_json).unwrap_or_default();

        let board_str = serde_json::to_string(&board_snapshot).unwrap_or_default();
        let move_str = serde_json::to_string(&move_history).unwrap_or_default();

        let (hash, nonce) = Block::mine(index, timestamp, winner, &board_str, &move_str, &prev_hash, self.difficulty);

        let block = Block {
            index,
            timestamp,
            winner: winner.to_string(),
            board_snapshot,
            move_history,
            player_x: player_x.to_string(),
            player_o: player_o.to_string(),
            prev_hash,
            hash: hash.clone(),
            nonce,
        };

        self.chain.push(block);
        hash
    }

    pub fn get_chain_json(&self) -> String {
        serde_json::to_string(&self.chain).unwrap_or_default()
    }

    pub fn is_valid(&self) -> bool {
        for i in 1..self.chain.len() {
            let current = &self.chain[i];
            let previous = &self.chain[i - 1];
            if current.prev_hash != previous.hash {
                return false;
            }
            let board_str = serde_json::to_string(&current.board_snapshot).unwrap_or_default();
            let move_str = serde_json::to_string(&current.move_history).unwrap_or_default();
            let recalculated = Block::calculate_hash(
                current.index, current.timestamp, &current.winner,
                &board_str, &move_str, &current.prev_hash, current.nonce,
            );
            if recalculated != current.hash {
                return false;
            }
        }
        true
    }

    pub fn get_stats_json(&self) -> String {
        let game_blocks: Vec<&Block> = self.chain.iter().filter(|b| b.index > 0).collect();
        let total = game_blocks.len();
        let x_wins = game_blocks.iter().filter(|b| b.winner == "X").count();
        let o_wins = game_blocks.iter().filter(|b| b.winner == "O").count();
        let draws = game_blocks.iter().filter(|b| b.winner == "Draw").count();

        let stats = serde_json::json!({
            "total_games": total,
            "x_wins": x_wins,
            "o_wins": o_wins,
            "draws": draws,
            "chain_length": self.chain.len(),
            "is_valid": self.is_valid(),
        });
        serde_json::to_string(&stats).unwrap_or_default()
    }

    pub fn chain_length(&self) -> usize {
        self.chain.len()
    }
}
