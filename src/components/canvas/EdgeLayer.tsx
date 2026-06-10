import { memo } from 'react';
import type { Task, Dependency } from '../../types';
import { NODE_WIDTH, NODE_HEIGHT } from './TaskNode';

interface EdgeLayerProps {
  tasks: Task[];
  dependencies: Dependency[];
  selectedEdgeId: string | null;
  onEdgeClick: (id: string) => void;
}

/** Compute the cubic bezier path between source (right-center) and target (left-center). */
function bezierPath(sx: number, sy: number, tx: number, ty: number): string {
  const dx = Math.abs(tx - sx);
  const cp = Math.max(dx * 0.5, 60);
  return `M ${sx} ${sy} C ${sx + cp} ${sy}, ${tx - cp} ${ty}, ${tx} ${ty}`;
}

export const EdgeLayer = memo(function EdgeLayer({
  tasks,
  dependencies,
  selectedEdgeId,
  onEdgeClick,
}: EdgeLayerProps) {
  const taskMap = new Map(tasks.map(t => [t.id, t]));

  return (
    <svg
      className="absolute inset-0 overflow-visible pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        {/* Arrow markers — one per colour variant */}
        {[
          { id: 'arrow-default',  color: '#475569' },
          { id: 'arrow-critical', color: '#f59e0b' },
          { id: 'arrow-blocked',  color: '#ef4444' },
          { id: 'arrow-done',     color: '#10b981' },
          { id: 'arrow-selected', color: '#a78bfa' },
        ].map(({ id, color }) => (
          <marker
            key={id}
            id={id}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={color} />
          </marker>
        ))}

        {/* Glow filter for critical path */}
        <filter id="glow-amber">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {dependencies.map(dep => {
        const src = taskMap.get(dep.sourceTaskId);
        const tgt = taskMap.get(dep.targetTaskId);
        if (!src || !tgt) return null;

        const sx = src.position.x + NODE_WIDTH;
        const sy = src.position.y + NODE_HEIGHT / 2;
        const tx = tgt.position.x;
        const ty = tgt.position.y + NODE_HEIGHT / 2;

        const path = bezierPath(sx, sy, tx, ty);

        const isSelected = selectedEdgeId === dep.id;
        const srcDone    = src.status === 'done';
        const tgtBlocked = tgt.status === 'blocked';

        // Pick colour + marker
        let stroke: string;
        let markerId: string;
        let strokeWidth: number;

        if (isSelected) {
          stroke = '#a78bfa'; markerId = 'arrow-selected'; strokeWidth = 2;
        } else if (srcDone) {
          stroke = '#10b981'; markerId = 'arrow-done'; strokeWidth = 1.5;
        } else if (tgtBlocked) {
          stroke = '#ef4444'; markerId = 'arrow-blocked'; strokeWidth = 2;
        } else if (dep.isCriticalPath) {
          stroke = '#f59e0b'; markerId = 'arrow-critical'; strokeWidth = 2;
        } else {
          stroke = '#475569'; markerId = 'arrow-default'; strokeWidth = 1.5;
        }

        const midX = (sx + tx) / 2;
        const midY = (sy + ty) / 2;

        return (
          <g key={dep.id}>
            {/* Wide invisible hit area for easy clicking */}
            <path
              d={path}
              fill="none"
              stroke="transparent"
              strokeWidth={16}
              className="pointer-events-auto cursor-pointer"
              onClick={() => onEdgeClick(dep.id)}
            />

            {/* Visible path */}
            <path
              d={path}
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={tgtBlocked ? '5 4' : undefined}
              markerEnd={`url(#${markerId})`}
              opacity={isSelected ? 1 : 0.7}
              filter={dep.isCriticalPath && !srcDone ? 'url(#glow-amber)' : undefined}
              className="transition-all duration-200"
            />

            {/* Edge label */}
            {(dep.label || dep.isCriticalPath) && (
              <text
                x={midX}
                y={midY - 6}
                textAnchor="middle"
                fontSize={9}
                fill={dep.isCriticalPath && !srcDone ? '#f59e0b' : '#64748b'}
                fontFamily="ui-monospace, monospace"
                fontWeight="600"
                className="pointer-events-none select-none"
              >
                {dep.label ?? (dep.isCriticalPath ? '★ critical' : '')}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
});
