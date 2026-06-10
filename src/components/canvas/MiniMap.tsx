import { memo } from 'react';
import type { Task } from '../../types';
import { NODE_WIDTH, NODE_HEIGHT } from './TaskNode';

const STATUS_COLOR: Record<string, string> = {
  'todo':        '#475569',
  'in-progress': '#3b82f6',
  'in-review':   '#8b5cf6',
  'blocked':     '#ef4444',
  'done':        '#10b981',
  'cancelled':   '#334155',
};

interface MiniMapProps {
  tasks: Task[];
  viewportX: number;
  viewportY: number;
  zoom: number;
  containerWidth: number;
  containerHeight: number;
}

const MAP_W = 160;
const MAP_H = 100;

export const MiniMap = memo(function MiniMap({
  tasks,
  viewportX,
  viewportY,
  zoom,
  containerWidth,
  containerHeight,
}: MiniMapProps) {
  if (tasks.length === 0) return null;

  const minX = Math.min(...tasks.map(t => t.position.x));
  const minY = Math.min(...tasks.map(t => t.position.y));
  const maxX = Math.max(...tasks.map(t => t.position.x + NODE_WIDTH));
  const maxY = Math.max(...tasks.map(t => t.position.y + NODE_HEIGHT));

  const graphW = maxX - minX || 1;
  const graphH = maxY - minY || 1;

  const scale = Math.min(MAP_W / graphW, MAP_H / graphH) * 0.9;

  const toMapX = (x: number) => (x - minX) * scale + (MAP_W - graphW * scale) / 2;
  const toMapY = (y: number) => (y - minY) * scale + (MAP_H - graphH * scale) / 2;

  // Viewport rect in map coords
  const vpX = (-viewportX / zoom - minX) * scale + (MAP_W - graphW * scale) / 2;
  const vpY = (-viewportY / zoom - minY) * scale + (MAP_H - graphH * scale) / 2;
  const vpW = (containerWidth  / zoom) * scale;
  const vpH = (containerHeight / zoom) * scale;

  return (
    <div className="absolute bottom-4 left-4 z-20 rounded-xl overflow-hidden border border-white/10 shadow-xl"
         style={{ width: MAP_W, height: MAP_H, background: 'rgba(6,6,18,0.85)', backdropFilter: 'blur(8px)' }}>
      <svg width={MAP_W} height={MAP_H}>
        {tasks.map(t => (
          <rect
            key={t.id}
            x={toMapX(t.position.x)}
            y={toMapY(t.position.y)}
            width={NODE_WIDTH * scale}
            height={NODE_HEIGHT * scale}
            rx={2}
            fill={STATUS_COLOR[t.status] ?? '#475569'}
            opacity={0.8}
          />
        ))}

        {/* Viewport indicator */}
        <rect
          x={vpX}
          y={vpY}
          width={Math.max(vpW, 10)}
          height={Math.max(vpH, 10)}
          rx={2}
          fill="rgba(124,58,237,0.15)"
          stroke="#7c3aed"
          strokeWidth={1}
        />
      </svg>

      <div className="absolute bottom-1 right-1.5 text-[8px] font-mono text-slate-600 select-none">
        minimap
      </div>
    </div>
  );
});
