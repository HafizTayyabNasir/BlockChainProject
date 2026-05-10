import React, { useEffect } from "react";
import { useGame } from "@/hooks/use-game";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const IconX = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("w-full h-full p-6", className)} stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <line x1="20" y1="20" x2="80" y2="80" className="draw-line" />
    <line x1="80" y1="20" x2="20" y2="80" className="draw-line" style={{ animationDelay: '0.1s' }} />
  </svg>
);

const IconO = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={cn("w-full h-full p-6", className)} stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none">
    <circle cx="50" cy="50" r="30" className="draw-line" strokeDasharray="200" strokeDashoffset="200" />
  </svg>
);

export default function GamePage() {
  const { board, currentPlayer, isGameOver, winner, winningLine, makeMove, resetGame } = useGame();
  const { toast } = useToast();

  useEffect(() => {
    const handleBlockMined = (e: Event) => {
      const customEvent = e as CustomEvent;
      toast({
        title: "Block Mined",
        description: (
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-xs text-muted-foreground">Result recorded to ledger</span>
            <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-primary border border-primary/20 truncate">
              {customEvent.detail.hash}
            </code>
          </div>
        ),
        duration: 5000,
      });
    };

    window.addEventListener('block_mined', handleBlockMined);
    return () => window.removeEventListener('block_mined', handleBlockMined);
  }, [toast]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            TIKTAK
          </span>
          <span className="opacity-50">.ONCHAIN</span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
          Cryptographic Tic-Tac-Toe
        </p>
      </div>

      <div className="w-full bg-card border border-border/50 rounded-xl shadow-2xl p-6 md:p-8 backdrop-blur-sm flex flex-col items-center relative overflow-hidden">
        
        {/* Header / Status */}
        <div className="w-full flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">Status</span>
            {!isGameOver ? (
              <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-mono text-primary font-bold">
                  Player {currentPlayer === 1 ? 'X' : 'O'} Turn
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/30">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-sm font-mono text-secondary font-bold">
                  {winner === 3 ? 'Match Drawn' : `Player ${winner === 1 ? 'X' : 'O'} Wins`}
                </span>
              </div>
            )}
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetGame}
            className="font-mono text-xs border-primary/30 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <RotateCcw className="w-3 h-3 mr-2" />
            NEW GAME
          </Button>
        </div>

        {/* Board */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 w-full max-w-[400px] aspect-square">
          {board.map((cell, idx) => {
            const isWinningCell = winningLine.includes(idx);
            return (
              <button
                key={idx}
                disabled={cell !== 0 || isGameOver}
                onClick={() => makeMove(idx)}
                className={cn(
                  "cell-glow bg-background border border-border/50 rounded-lg flex items-center justify-center relative overflow-hidden group transition-all",
                  isWinningCell && "cell-winning z-10",
                  !isWinningCell && cell === 0 && !isGameOver && "hover:bg-muted/30 cursor-pointer",
                  (cell !== 0 || isGameOver) && "cursor-default"
                )}
              >
                {cell === 1 && <IconX className="text-primary" />}
                {cell === 2 && <IconO className="text-secondary" />}
                {cell === 0 && !isGameOver && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 flex items-center justify-center transition-opacity">
                    {currentPlayer === 1 ? <IconX className="text-primary" /> : <IconO className="text-secondary" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
}
