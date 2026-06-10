import { X, Calendar, Clock, User, Tag, GitBranch, ArrowRight } from 'lucide-react';
import type { Task, Dependency } from '../../types';

interface TaskDetailPanelProps {
  task: Task;
  allTasks: Task[];
  dependencies: Dependency[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}

const STATUS_BADGE: Record<string, string> = {
  'todo':        'bg-slate-700 text-slate-300',
  'in-progress': 'bg-blue-900/60 text-blue-300',
  'in-review':   'bg-violet-900/60 text-violet-300',
  'blocked':     'bg-red-900/60 text-red-300',
  'done':        'bg-emerald-900/60 text-emerald-300',
  'cancelled':   'bg-slate-800 text-slate-500',
};

const PRIORITY_BADGE: Record<string, string> = {
  low:      'bg-slate-700 text-slate-400',
  medium:   'bg-amber-900/50 text-amber-300',
  high:     'bg-orange-900/50 text-orange-300',
  critical: 'bg-red-900/60 text-red-300',
};

export function TaskDetailPanel({ task, allTasks, dependencies, onClose, onNavigate }: TaskDetailPanelProps) {
  const taskMap = new Map(allTasks.map(t => [t.id, t]));

  const upstreamDeps   = dependencies.filter(d => d.targetTaskId === task.id);
  const downstreamDeps = dependencies.filter(d => d.sourceTaskId === task.id);

  const progressPct = task.estimatedHours && task.loggedHours !== undefined
    ? Math.min(100, Math.round((task.loggedHours / task.estimatedHours) * 100))
    : null;

  return (
    <div className="absolute right-4 top-16 bottom-4 w-80 z-30 flex flex-col glass rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 border-b border-white/[0.06]">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base leading-snug">{task.title}</h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[task.status]}`}>
              {task.status.replace('-', ' ')}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${PRIORITY_BADGE[task.priority]}`}>
              {task.priority}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
        >
          <X size={15} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-5 flex flex-col gap-5">

        {/* Description */}
        {task.description && (
          <section>
            <SectionLabel>Description</SectionLabel>
            <p className="text-slate-400 text-sm leading-relaxed">{task.description}</p>
          </section>
        )}

        {/* Meta grid */}
        <section className="grid grid-cols-2 gap-3">
          {task.assignee && (
            <MetaItem icon={<User size={13} />} label="Assignee">
              <span className="text-sm text-white truncate">{task.assignee.name}</span>
            </MetaItem>
          )}
          {task.dueDate && (
            <MetaItem icon={<Calendar size={13} />} label="Due date">
              <span className={`text-sm ${
                task.status !== 'done' && new Date(task.dueDate) < new Date()
                  ? 'text-red-400 font-semibold'
                  : 'text-white'
              }`}>
                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </MetaItem>
          )}
          {task.estimatedHours && (
            <MetaItem icon={<Clock size={13} />} label="Estimated">
              <span className="text-sm text-white">{task.estimatedHours}h</span>
            </MetaItem>
          )}
          {task.loggedHours !== undefined && task.loggedHours > 0 && (
            <MetaItem icon={<Clock size={13} />} label="Logged">
              <span className="text-sm text-white">{task.loggedHours}h</span>
            </MetaItem>
          )}
        </section>

        {/* Progress bar */}
        {progressPct !== null && (
          <section>
            <div className="flex justify-between items-center mb-1.5">
              <SectionLabel>Progress</SectionLabel>
              <span className="text-xs text-slate-500 tabular-nums">{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </section>
        )}

        {/* Labels */}
        {task.labels.length > 0 && (
          <section>
            <SectionLabel icon={<Tag size={12} />}>Labels</SectionLabel>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {task.labels.map(l => (
                <span key={l} className="text-[11px] text-slate-400 bg-white/[0.05] border border-white/[0.06] px-2.5 py-1 rounded-full">
                  {l}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Upstream dependencies */}
        {upstreamDeps.length > 0 && (
          <section>
            <SectionLabel icon={<GitBranch size={12} />}>
              Depends on ({upstreamDeps.length})
            </SectionLabel>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {upstreamDeps.map(dep => {
                const src = taskMap.get(dep.sourceTaskId);
                if (!src) return null;
                return (
                  <DepChip
                    key={dep.id}
                    task={src}
                    direction="upstream"
                    isCritical={dep.isCriticalPath}
                    onClick={() => onNavigate(src.id)}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Downstream dependents */}
        {downstreamDeps.length > 0 && (
          <section>
            <SectionLabel icon={<ArrowRight size={12} />}>
              Blocks ({downstreamDeps.length})
            </SectionLabel>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {downstreamDeps.map(dep => {
                const tgt = taskMap.get(dep.targetTaskId);
                if (!tgt) return null;
                return (
                  <DepChip
                    key={dep.id}
                    task={tgt}
                    direction="downstream"
                    isCritical={dep.isCriticalPath}
                    onClick={() => onNavigate(tgt.id)}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-600 mb-1">
      {icon}
      {children}
    </div>
  );
}

function MetaItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
      <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-medium mb-1">
        {icon} {label}
      </div>
      {children}
    </div>
  );
}

function DepChip({
  task,
  direction,
  isCritical,
  onClick,
}: {
  task: Task;
  direction: 'upstream' | 'downstream';
  isCritical: boolean;
  onClick: () => void;
}) {
  const STATUS_DOT: Record<string, string> = {
    'todo': 'bg-slate-500', 'in-progress': 'bg-blue-400',
    'in-review': 'bg-violet-400', 'blocked': 'bg-red-400',
    'done': 'bg-emerald-400', 'cancelled': 'bg-slate-600',
  };
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.07] hover:border-violet-500/30 transition-all text-left group"
    >
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[task.status]}`} />
      <span className="text-xs text-slate-300 truncate flex-1">{task.title}</span>
      {isCritical && (
        <span className="text-[9px] text-amber-500 font-semibold">★</span>
      )}
      <ArrowRight size={11} className="text-slate-600 group-hover:text-violet-400 transition-colors flex-shrink-0" />
    </button>
  );
}
