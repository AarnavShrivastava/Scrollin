import { memo } from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle, XCircle, Eye, User } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority } from '../../types';

// ─── Style maps ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TaskStatus, {
  icon: React.FC<{ size?: number; className?: string }>;
  border: string;
  badge: string;
  label: string;
}> = {
  'todo':        { icon: Circle,       border: 'border-slate-600',   badge: 'bg-slate-700 text-slate-300',      label: 'To Do'      },
  'in-progress': { icon: Clock,        border: 'border-blue-500',    badge: 'bg-blue-900/60 text-blue-300',     label: 'In Progress'},
  'in-review':   { icon: Eye,          border: 'border-violet-500',  badge: 'bg-violet-900/60 text-violet-300', label: 'In Review'  },
  'blocked':     { icon: AlertCircle,  border: 'border-red-500',     badge: 'bg-red-900/60 text-red-300',       label: 'Blocked'    },
  'done':        { icon: CheckCircle2, border: 'border-emerald-500', badge: 'bg-emerald-900/60 text-emerald-300', label: 'Done'     },
  'cancelled':   { icon: XCircle,      border: 'border-slate-700',   badge: 'bg-slate-800 text-slate-500',      label: 'Cancelled' },
};

const PRIORITY_DOT: Record<TaskPriority, string> = {
  low:      'bg-slate-500',
  medium:   'bg-amber-400',
  high:     'bg-orange-500',
  critical: 'bg-red-500',
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical',
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  'bg-violet-600', 'bg-blue-600', 'bg-cyan-600',
  'bg-pink-600',   'bg-amber-600', 'bg-emerald-600',
];

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className="w-6 h-6 rounded-full object-cover" />;
  }
  return (
    <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
      {name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
    </div>
  );
}

// ─── TaskNode ────────────────────────────────────────────────────────────────

interface TaskNodeProps {
  task: Task;
  selected: boolean;
  isOnCriticalPath: boolean;
  onClick: (id: string) => void;
  onDragStart: (e: React.MouseEvent, id: string) => void;
}

export const NODE_WIDTH  = 240;
export const NODE_HEIGHT = 110;

export const TaskNode = memo(function TaskNode({
  task,
  selected,
  isOnCriticalPath,
  onClick,
  onDragStart,
}: TaskNodeProps) {
  const { icon: StatusIcon, border, badge, label: statusLabel } = STATUS_CONFIG[task.status];

  const isBlocked   = task.status === 'blocked';
  const isDone      = task.status === 'done';
  const isCancelled = task.status === 'cancelled';

  return (
    <div
      className={`
        absolute select-none cursor-pointer rounded-2xl border
        transition-all duration-150
        ${border}
        ${selected
          ? 'ring-2 ring-offset-1 ring-offset-transparent ring-violet-400 shadow-2xl shadow-violet-900/40 scale-[1.02]'
          : 'hover:scale-[1.01] hover:shadow-xl hover:shadow-black/40'
        }
        ${isOnCriticalPath && !isDone && !isCancelled
          ? 'shadow-lg shadow-amber-900/30'
          : ''
        }
        ${isBlocked ? 'animate-pulse-slow' : ''}
      `}
      style={{
        left: task.position.x,
        top:  task.position.y,
        width: NODE_WIDTH,
        minHeight: NODE_HEIGHT,
        background: 'rgba(13, 13, 31, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={() => onClick(task.id)}
      onMouseDown={(e) => { e.stopPropagation(); onDragStart(e, task.id); }}
    >
      {/* Critical path stripe */}
      {isOnCriticalPath && !isDone && !isCancelled && (
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0" />
      )}

      <div className="p-4 flex flex-col gap-2.5">
        {/* Top row: status icon + title + priority dot */}
        <div className="flex items-start gap-2">
          <StatusIcon
            size={15}
            className={`flex-shrink-0 mt-0.5 ${isDone ? 'text-emerald-400' : isBlocked ? 'text-red-400' : 'text-slate-400'}`}
          />
          <p
            className={`text-sm font-semibold leading-snug flex-1 ${
              isDone || isCancelled ? 'text-slate-500 line-through' : 'text-white'
            }`}
          >
            {task.title}
          </p>
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${PRIORITY_DOT[task.priority]}`}
            title={`Priority: ${PRIORITY_LABEL[task.priority]}`}
          />
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge}`}>
            {statusLabel}
          </span>
          {task.labels.slice(0, 2).map(l => (
            <span key={l} className="text-[10px] text-slate-500 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/[0.06]">
              {l}
            </span>
          ))}
        </div>

        {/* Bottom row: assignee + due date */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          {task.assignee ? (
            <div className="flex items-center gap-1.5">
              <Avatar name={task.assignee.name} avatarUrl={task.assignee.avatarUrl} />
              <span className="text-[11px] text-slate-500 truncate max-w-[100px]">
                {task.assignee.name.split(' ')[0]}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-600">
              <User size={12} />
              <span className="text-[11px]">Unassigned</span>
            </div>
          )}

          {task.dueDate && (
            <span className={`text-[11px] tabular-nums ${
              !isDone && new Date(task.dueDate) < new Date()
                ? 'text-red-400 font-semibold'
                : 'text-slate-500'
            }`}>
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        {/* Progress bar for in-progress tasks */}
        {task.status === 'in-progress' && task.estimatedHours && task.loggedHours !== undefined && (
          <div className="mt-0.5">
            <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (task.loggedHours / task.estimatedHours) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-600 mt-0.5 block">
              {task.loggedHours}h / {task.estimatedHours}h
            </span>
          </div>
        )}
      </div>

      {/* Output handle — right center */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-500 hover:border-violet-400 hover:bg-violet-600 transition-all duration-150 z-10"
        title="Drag to create dependency"
      />
      {/* Input handle — left center */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-500 hover:border-violet-400 hover:bg-violet-600 transition-all duration-150 z-10"
        title="Dependency input"
      />
    </div>
  );
});
