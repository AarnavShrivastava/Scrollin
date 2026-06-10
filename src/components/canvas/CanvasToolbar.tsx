import {
  ZoomIn, ZoomOut, Maximize2, LayoutTemplate,
  PlusCircle, Trash2, Filter,
} from 'lucide-react';
import type { TaskStatus } from '../../types';

interface CanvasToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onAutoLayout: () => void;
  onAddNode: () => void;
  onDeleteSelected: () => void;
  hasSelection: boolean;
  filterStatus: TaskStatus | 'all';
  onFilterChange: (s: TaskStatus | 'all') => void;
  stats: { total: number; done: number; blocked: number; inProgress: number };
}

const STATUS_FILTERS: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all',         label: 'All'         },
  { value: 'todo',        label: 'To Do'       },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'blocked',     label: 'Blocked'     },
  { value: 'done',        label: 'Done'        },
];

export function CanvasToolbar({
  zoom, onZoomIn, onZoomOut, onFitView, onAutoLayout,
  onAddNode, onDeleteSelected, hasSelection,
  filterStatus, onFilterChange, stats,
}: CanvasToolbarProps) {
  return (
    <div className="absolute top-4 left-0 right-0 z-20 flex items-center justify-between px-4 pointer-events-none">

      {/* Left — zoom + layout controls */}
      <div className="flex items-center gap-1 glass rounded-xl px-2 py-1.5 pointer-events-auto shadow-lg">
        <button
          onClick={onZoomOut}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Zoom out"
        >
          <ZoomOut size={15} />
        </button>
        <span className="text-xs font-mono text-slate-400 w-10 text-center select-none">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Zoom in"
        >
          <ZoomIn size={15} />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button
          onClick={onFitView}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Fit to view"
        >
          <Maximize2 size={15} />
        </button>
        <button
          onClick={onAutoLayout}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Auto layout"
        >
          <LayoutTemplate size={15} />
        </button>
      </div>

      {/* Center — stats */}
      <div className="hidden md:flex items-center gap-3 glass rounded-xl px-4 py-2 pointer-events-auto shadow-lg">
        <Stat label="Total"       value={stats.total}      color="text-slate-300" />
        <div className="w-px h-3 bg-white/10" />
        <Stat label="In Progress" value={stats.inProgress} color="text-blue-400"    />
        <div className="w-px h-3 bg-white/10" />
        <Stat label="Blocked"     value={stats.blocked}    color="text-red-400"     />
        <div className="w-px h-3 bg-white/10" />
        <Stat label="Done"        value={stats.done}       color="text-emerald-400" />
      </div>

      {/* Right — add / delete + filter */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Filter */}
        <div className="flex items-center gap-1 glass rounded-xl px-2 py-1.5 shadow-lg">
          <Filter size={13} className="text-slate-500 mr-1" />
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all ${
                filterStatus === f.value
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.06]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 glass rounded-xl px-2 py-1.5 shadow-lg">
          <button
            onClick={onAddNode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-violet-600/80 hover:bg-violet-600 transition-all"
          >
            <PlusCircle size={13} />
            Add task
          </button>
          {hasSelection && (
            <button
              onClick={onDeleteSelected}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
              title="Delete selected"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-sm font-bold tabular-nums ${color}`}>{value}</span>
      <span className="text-[11px] text-slate-600">{label}</span>
    </div>
  );
}
