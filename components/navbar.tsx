"use client";

import { AlgorithmId } from "@/lib/types";
import { ALGORITHMS, CATEGORIES } from "@/lib/algorithms-meta";
import { cn } from "@/lib/utils";
import { ChevronRight, Activity } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

interface NavbarProps {
  activeId: AlgorithmId;
  onSelect: (id: AlgorithmId) => void;
}

export function Navbar({ activeId, onSelect }: NavbarProps) {
  return (
    <nav className="flex flex-col h-full bg-sidebar border-r border-border overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
        <div className="flex items-center justify-center w-7 h-7 rounded bg-neon/20 border border-neon/30">
          <Activity className="w-4 h-4 text-neon" />
        </div>
        <div>
          <div className="text-sm font-bold text-foreground tracking-wider">
            AlgoViz
          </div>
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase">
            v2.1.0
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 py-3 space-y-5 px-2">
        {CATEGORIES.map((cat) => {
          const items = ALGORITHMS.filter((a) => a.category === cat.id);
          return (
            <div key={cat.id}>
              <div className="px-2 mb-1 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/70">
                {cat.label}
              </div>
              <div className="space-y-0.5">
                {items.map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => onSelect(algo.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-all duration-150 group text-left",
                      activeId === algo.id
                        ? "bg-neon/15 text-neon border border-neon/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent",
                    )}
                  >
                    <span className="truncate">{algo.name}</span>
                    {activeId === algo.id && (
                      <ChevronRight className="w-3 h-3 shrink-0 text-neon" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer with Theme Toggle */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[10px] text-muted-foreground/50 leading-tight">
            Interactive
            <br />
            algorithm visualizer
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
