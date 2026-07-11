import React from "react";
import { Generation } from "../types";
import { History, Trash2, Calendar, FileText, ChevronRight } from "lucide-react";

interface HistoryListProps {
  generations: Generation[];
  onSelect: (gen: Generation) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function HistoryList({
  generations,
  onSelect,
  onDelete,
  onClearAll,
}: HistoryListProps) {
  if (generations.length === 0) {
    return (
      <div id="history-empty-card" className="bg-dark-sidebar rounded-lg border border-dark-border p-6 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-dark-input flex items-center justify-center mx-auto border border-dark-border">
          <History className="w-4 h-4 text-dark-text-secondary" />
        </div>
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider">No history</h3>
        <p className="text-[10px] text-dark-text-secondary">
          Platform-ready copies will be saved in your local browser cache automatically.
        </p>
      </div>
    );
  }

  return (
    <div id="history-list-card" className="bg-dark-sidebar rounded-lg border border-dark-border p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-dark-border">
        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-gold-500" />
          <span>History ({generations.length})</span>
        </h3>
        <button
          type="button"
          id="history-clear-all"
          onClick={onClearAll}
          className="text-[9px] font-extrabold text-red-400 hover:text-red-500 transition cursor-pointer uppercase tracking-wider"
        >
          Clear Workspace
        </button>
      </div>

      {/* List Items */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {generations.map((gen) => {
          // Format date cleanly
          const dateStr = new Date(gen.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={gen.id}
              id={`history-item-${gen.id}`}
              className="group relative flex items-center justify-between p-3 rounded-md bg-dark-input hover:bg-[#202020] border border-dark-border hover:border-gold-500/50 transition duration-150 cursor-pointer"
              onClick={() => onSelect(gen)}
            >
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span className="text-[9px] font-bold text-gold-500 bg-dark-sidebar border border-dark-border px-2 py-0.5 rounded-sm">
                    {gen.contentType}
                  </span>
                  <span className="text-[9px] text-dark-text-secondary font-medium">
                    {gen.tone} · {gen.length}
                  </span>
                </div>
                <h4 className="text-xs text-white font-medium line-clamp-1 leading-snug">
                  {gen.topic}
                </h4>
                <div className="flex items-center gap-1 text-[9px] text-dark-text-secondary mt-1 font-mono">
                  <Calendar className="w-3 h-3 text-dark-text-secondary/75" />
                  <span>{dateStr}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  id={`history-delete-${gen.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(gen.id);
                  }}
                  className="p-1.5 rounded-md text-dark-text-secondary hover:text-red-400 hover:bg-red-500/10 transition active:scale-95 cursor-pointer"
                  title="Delete item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <ChevronRight className="w-4 h-4 text-dark-text-secondary group-hover:translate-x-0.5 transition" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
