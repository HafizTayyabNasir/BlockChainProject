import React from "react";
import { useGame } from "@/hooks/use-game";
import { format } from "date-fns";
import { Trophy, ArrowRightLeft, Boxes, Server, CheckCircle2, XCircle, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LedgerPage() {
  const { chain, chainStats } = useGame();

  const valid = chainStats.is_valid;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-12">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
          <Database className="w-8 h-8 text-primary" />
          CHAIN LEDGER
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          Cryptographically verified game history
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Games" value={chainStats.total_games} icon={<Boxes className="w-4 h-4 text-muted-foreground" />} />
        <StatCard title="X Wins" value={chainStats.x_wins} icon={<Trophy className="w-4 h-4 text-primary" />} />
        <StatCard title="O Wins" value={chainStats.o_wins} icon={<Trophy className="w-4 h-4 text-secondary" />} />
        <StatCard title="Draws" value={chainStats.draws} icon={<ArrowRightLeft className="w-4 h-4 text-muted-foreground" />} />
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-sm font-semibold">Blocks ({chainStats.chain_length})</span>
          </div>
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-medium",
            valid ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-destructive/10 border-destructive/20 text-destructive"
          )}>
            {valid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {valid ? "CHAIN VALID" : "CHAIN INVALID"}
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {[...chain].reverse().map((block) => (
            <div key={block.index} className="p-5 flex flex-col md:flex-row gap-6 hover:bg-muted/10 transition-colors">
              
              <div className="flex flex-col gap-2 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded text-xs font-mono font-bold">
                    #{block.index}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {block.timestamp > 0 ? format(block.timestamp, "MMM d, HH:mm:ss") : "Genesis"}
                  </span>
                </div>
                
                {block.index > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-muted-foreground">Winner:</span>
                    <span className={cn(
                      "font-bold font-mono text-sm",
                      block.winner === 'X' && "text-primary",
                      block.winner === 'O' && "text-secondary",
                      block.winner === 'Draw' && "text-muted-foreground"
                    )}>
                      {block.winner}
                    </span>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground font-mono mt-auto pt-2">
                  Nonce: {block.nonce}
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3 justify-center min-w-0">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Hash</span>
                  <code className="text-xs text-foreground bg-background border border-border/50 px-2 py-1 rounded truncate block">
                    {block.hash}
                  </code>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Prev Hash</span>
                  <code className="text-xs text-muted-foreground bg-background border border-border/50 px-2 py-1 rounded truncate block">
                    {block.prev_hash}
                  </code>
                </div>
              </div>

              {block.index > 0 && (
                <div className="shrink-0 flex items-center justify-center">
                  <MiniBoard board={block.board_snapshot} />
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-4">
      <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
        {icon}
      </div>
      <div>
        <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">{title}</div>
        <div className="text-2xl font-black tracking-tight">{value}</div>
      </div>
    </div>
  );
}

function MiniBoard({ board }: { board: number[] }) {
  return (
    <div className="grid grid-cols-3 gap-0.5 bg-border/50 border border-border/50 p-0.5 rounded">
      {board.map((cell, idx) => (
        <div key={idx} className="w-5 h-5 bg-background flex items-center justify-center">
          {cell === 1 && <span className="text-[10px] font-bold text-primary font-mono">X</span>}
          {cell === 2 && <span className="text-[10px] font-bold text-secondary font-mono">O</span>}
        </div>
      ))}
    </div>
  );
}

