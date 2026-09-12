"use client";

import { useState } from "react";
import { AlgorithmId } from "@/lib/types";
import { ALGORITHMS } from "@/lib/algorithms-meta";
import { Navbar } from "./navbar";
import { SortVisualizer } from "./sort-visualizer";
import { GraphVisualizer } from "./graph-visualizer";
import { DataStructureVisualizer } from "./data-structure-visualizer";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const SORT_IDS: AlgorithmId[] = [
  "bubble-sort",
  "merge-sort",
  "quick-sort",
  "heap-sort",
  "insertion-sort",
  "selection-sort",
];
const GRAPH_IDS: AlgorithmId[] = ["bfs", "dfs", "dijkstra"];

export function AlgoViz() {
  const [activeId, setActiveId] = useState<AlgorithmId>("bubble-sort");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const meta = ALGORITHMS.find((a) => a.id === activeId)!;

  const handleSelect = (id: AlgorithmId) => {
    setActiveId(id);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-56 transition-transform duration-200 md:relative md:translate-x-0 shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Navbar activeId={activeId} onSelect={handleSelect} />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}

        <header className="flex items-center gap-4 px-6 py-3 border-b border-border bg-card shrink-0">
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded border border-border text-muted-foreground hover:text-foreground transition-all"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 min-w-0">
            <div>
              <h1 className="text-sm font-bold text-foreground">{meta.name}</h1>
              <div className="text-[10px] text-muted-foreground/60 font-mono tracking-wider uppercase">
                {meta.category === "sorting"
                  ? "Sorting Algorithm"
                  : meta.category === "graph"
                    ? "Graph Algorithm"
                    : "Data Structure"}
              </div>
            </div>
          </div>

          {/* Complexity badges in header */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <ComplexityBadge
              label="Best"
              value={meta.timeComplexity.best}
              color="neon"
            />
            <ComplexityBadge
              label="Avg"
              value={meta.timeComplexity.average}
              color="warn"
            />
            <ComplexityBadge
              label="Worst"
              value={meta.timeComplexity.worst}
              color="danger"
            />
            <ComplexityBadge
              label="Space"
              value={meta.spaceComplexity}
              color="compare"
            />
          </div>

          {/* Theme toggle — always visible on mobile, hidden on desktop (sidebar has it) */}
          <div className="md:hidden flex items-center ml-auto">
            <ThemeToggle />
          </div>
        </header>
        {/* Visualizer area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {SORT_IDS.includes(activeId) && (
            <SortVisualizer key={activeId} meta={meta} />
          )}
          {GRAPH_IDS.includes(activeId) && (
            <GraphVisualizer key={activeId} meta={meta} />
          )}
          {!SORT_IDS.includes(activeId) && !GRAPH_IDS.includes(activeId) && (
            <DataStructureVisualizer key={activeId} meta={meta} />
          )}
        </div>
      </main>
    </div>
  );
}

function ComplexityBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "neon" | "warn" | "danger" | "compare";
}) {
  const colorMap = {
    neon: "text-neon border-neon/30 bg-neon/10",
    warn: "text-warn border-warn/30 bg-warn/10",
    danger: "text-danger border-danger/30 bg-danger/10",
    compare: "text-compare border-compare/30 bg-compare/10",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-mono",
        colorMap[color],
      )}
    >
      <span className="text-muted-foreground/60">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
