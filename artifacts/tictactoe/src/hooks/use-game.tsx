import React, { createContext, useContext, useRef, useState, useCallback } from "react";
import { TicTacToe, Blockchain, Block, ChainStats, Cell, Winner } from "@/game/engine";

interface GameContextType {
  board: Cell[];
  currentPlayer: 1 | 2;
  isGameOver: boolean;
  winner: Winner;
  winningLine: number[];
  makeMove: (pos: number) => void;
  resetGame: () => void;
  chain: Block[];
  chainStats: ChainStats;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const gameRef = useRef<TicTacToe>(TicTacToe.new());
  const blockchainRef = useRef<Blockchain>(new Blockchain());

  const [board, setBoard] = useState<Cell[]>(gameRef.current.getBoard());
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(gameRef.current.currentPlayer());
  const [isGameOver, setIsGameOver] = useState<boolean>(gameRef.current.isGameOver());
  const [winner, setWinner] = useState<Winner>(gameRef.current.winner());
  const [winningLine, setWinningLine] = useState<number[]>(gameRef.current.getWinningLine());
  
  const [chain, setChain] = useState<Block[]>(blockchainRef.current.getChain());
  const [chainStats, setChainStats] = useState<ChainStats>(blockchainRef.current.getStats());

  const makeMove = useCallback((pos: number) => {
    const game = gameRef.current;
    if (game.makeMove(pos)) {
      setBoard(game.getBoard());
      setCurrentPlayer(game.currentPlayer());
      
      const over = game.isGameOver();
      setIsGameOver(over);
      
      if (over) {
        const win = game.winner();
        setWinner(win);
        setWinningLine(game.getWinningLine());
        
        let winnerLabel = "Draw";
        if (win === 1) winnerLabel = "X";
        if (win === 2) winnerLabel = "O";
        
        const hash = blockchainRef.current.addGameResult(
          winnerLabel,
          game.getBoard(),
          game.getMoveHistory(),
          Date.now(),
          "Player X",
          "Player O"
        );
        
        setChain(blockchainRef.current.getChain());
        setChainStats(blockchainRef.current.getStats());

        // We dispatch a custom event to notify components if needed
        window.dispatchEvent(new CustomEvent('block_mined', { detail: { hash } }));
      }
    }
  }, []);

  const resetGame = useCallback(() => {
    gameRef.current.reset();
    setBoard(gameRef.current.getBoard());
    setCurrentPlayer(gameRef.current.currentPlayer());
    setIsGameOver(gameRef.current.isGameOver());
    setWinner(gameRef.current.winner());
    setWinningLine(gameRef.current.getWinningLine());
  }, []);

  return (
    <GameContext.Provider
      value={{
        board,
        currentPlayer,
        isGameOver,
        winner,
        winningLine,
        makeMove,
        resetGame,
        chain,
        chainStats,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
