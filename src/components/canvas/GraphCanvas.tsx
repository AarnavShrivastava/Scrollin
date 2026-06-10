import { useCallback, useEffect, useRef, useState } from 'react';
import type { Task, Dependency, TaskStatus } from '../../types';
import { TaskNode, NODE_WIDTH, NODE_HEIGHT } from './TaskNode';
import { EdgeLayer } from './EdgeLayer';
import { CanvasToolbar } from './CanvasToolbar';
import { TaskDetailPanel } from './TaskDetailPanel';
import { MiniMap } from './MiniMap';

// ─── Constants ────────────────────────────────────────────────────────────────
const ZOOM_MIN   = 0.25;
const ZOOM_MAX   = 2;
const ZOOM_STEP  = 0.12;
const GRID_SIZE  = 20;

// Auto-layout: hierarchical left-to-right using topological levels
function computeAutoLayout(tasks: Task[], deps: Dependency[]): Map<string, { x: number; y: number }> {
  const inDegree = new Map(tasks.map(t => [t.id, 0]));
  const adjList  = new Map(tasks.map(t => [t.id, [] as string[]]));

  deps.forEach(d => {
    adjList.get(d.sourceTaskId)?.push(d.targetTaskId);
    inDegree.set(d.targetTaskId, (inDegree.get(d.targetTaskId) ?? 0) + 1);
  });

  // Kahn's algorithm for topological levels
  const levels: string[][] = [];
  let queue = tasks.filter(t => inDegree.get(t.id) === 0).map(t => t.id);

  while (queue.length) {
    levels.push([...queue]);
    const next: string[] = [];
    queue.forEach(id => {
      adjList.get(id)?.forEach(nid => {
        inDegree.set(nid, (inDegree.get(nid) ?? 1) - 1);
        if (inDegree.get(nid) === 0) next.push(nid);
      });
    });
    queue = next;
  }

  const H_GAP = NODE_WIDTH  + 80;
  const V_GAP = NODE_HEIGHT + 40;
  const positions = new Map<string, { x: number; y: number }>();

  levels.forEach((level, col) => {
    const totalH = level.length * V_GAP - 40;
    level.forEach((id, row) => {
      positions.set(id, {
        x: 60 + col * H_GAP,
        y: 80 + row * V_GAP - totalH / 2 + (tasks.length * V_GAP) / 2,
      });
    });
  });

  return positions;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface GraphCanvasProps {
  initialTasks: Task[];
  initialDependencies: Dependency[];
}

export default function GraphCanvas({ initialTasks, initialDependencies }: GraphCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Graph state
  const [tasks,        setTasks]        = useState<Task[]>(initialTasks);
  const [dependencies, setDependencies] = useState<Dependency[]>(initialDependencies);

  // Canvas transform
  const [zoom,     setZoom]     = useState(0.85);
  const [offsetX,  setOffsetX]  = useState(0);
  const [offsetY,  setOffsetY]  = useState(60);

  // Selection
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // UI state
  const [filterStatus,   setFilterStatus]   = useState<TaskStatus | 'all'>('all');
  const [panelTaskId,    setPanelTaskId]     = useState<string | null>(null);
  const [containerSize,  setContainerSize]   = useState({ w: 800, h: 600 });

  // Drag state (node drag)
  const dragging = useRef<{
    nodeId:  string;
    startMouseX: number;
    startMouseY: number;
    startNodeX:  number;
    startNodeY:  number;
  } | null>(null);

  // Pan state (canvas drag)
  const panning = useRef<{ startX: number; startY: number; startOffsetX: number; startOffsetY: number } | null>(null);

  // ── Measure container ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    setContainerSize({ w: el.offsetWidth, h: el.offsetHeight });
    return () => ro.disconnect();
  }, []);

  // ── Fit view on first load ─────────────────────────────────────────────────
  const fitView = useCallback(() => {
    if (tasks.length === 0) return;
    const pad = 80;
    const minX = Math.min(...tasks.map(t => t.position.x));
    const minY = Math.min(...tasks.map(t => t.position.y));
    const maxX = Math.max(...tasks.map(t => t.position.x + NODE_WIDTH));
    const maxY = Math.max(...tasks.map(t => t.position.y + NODE_HEIGHT));
    const graphW = maxX - minX;
    const graphH = maxY - minY;
    const z = Math.min(
      (containerSize.w - pad * 2) / graphW,
      (containerSize.h - pad * 2) / graphH,
      ZOOM_MAX
    );
    const newZoom = Math.max(ZOOM_MIN, z);
    setZoom(newZoom);
    setOffsetX((containerSize.w - graphW  * newZoom) / 2 - minX * newZoom);
    setOffsetY((containerSize.h - graphH * newZoom) / 2 - minY * newZoom);
  }, [tasks, containerSize]);

  useEffect(() => { fitView(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Zoom ───────────────────────────────────────────────────────────────────
  const adjustZoom = useCallback((delta: number, cx?: number, cy?: number) => {
    setZoom(prev => {
      const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, prev + delta));
      if (cx !== undefined && cy !== undefined) {
        const factor = next / prev;
        setOffsetX(ox => cx - (cx - ox) * factor);
        setOffsetY(oy => cy - (cy - oy) * factor);
      }
      return next;
    });
  }, []);

  // ── Wheel zoom ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      adjustZoom(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP, cx, cy);
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [adjustZoom]);

  // ── Mouse down: start node drag OR canvas pan ──────────────────────────────
  const onNodeDragStart = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    const task = tasks.find(t => t.id === nodeId);
    if (!task) return;
    dragging.current = {
      nodeId,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startNodeX:  task.position.x,
      startNodeY:  task.position.y,
    };
  }, [tasks]);

  const onCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start panning if clicking on blank canvas
    if ((e.target as HTMLElement).closest('[data-node]')) return;
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setPanelTaskId(null);
    panning.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: offsetX,
      startOffsetY: offsetY,
    };
  }, [offsetX, offsetY]);

  // ── Mouse move ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragging.current) {
        const { nodeId, startMouseX, startMouseY, startNodeX, startNodeY } = dragging.current;
        const dx = (e.clientX - startMouseX) / zoom;
        const dy = (e.clientY - startMouseY) / zoom;
        // Snap to grid
        const nx = Math.round((startNodeX + dx) / GRID_SIZE) * GRID_SIZE;
        const ny = Math.round((startNodeY + dy) / GRID_SIZE) * GRID_SIZE;
        setTasks(prev => prev.map(t =>
          t.id === nodeId ? { ...t, position: { x: nx, y: ny } } : t
        ));
      } else if (panning.current) {
        const { startX, startY, startOffsetX, startOffsetY } = panning.current;
        setOffsetX(startOffsetX + e.clientX - startX);
        setOffsetY(startOffsetY + e.clientY - startY);
      }
    };
    const onMouseUp = () => {
      dragging.current = null;
      panning.current  = null;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, [zoom]);

  // ── Keyboard: delete / escape ──────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setPanelTaskId(null);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        setTasks(prev => prev.filter(t => t.id !== selectedNodeId));
        setDependencies(prev => prev.filter(
          d => d.sourceTaskId !== selectedNodeId && d.targetTaskId !== selectedNodeId
        ));
        setSelectedNodeId(null);
        setPanelTaskId(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedNodeId]);

  // ── Auto layout ────────────────────────────────────────────────────────────
  const autoLayout = useCallback(() => {
    const positions = computeAutoLayout(tasks, dependencies);
    setTasks(prev => prev.map(t => {
      const pos = positions.get(t.id);
      return pos ? { ...t, position: pos } : t;
    }));
    setTimeout(fitView, 50);
  }, [tasks, dependencies, fitView]);

  // ── Add node ───────────────────────────────────────────────────────────────
  const addNode = useCallback(() => {
    const id = `t${Date.now()}`;
    const newTask: Task = {
      id,
      projectId: 'p1',
      title: 'New Action',
      status: 'todo',
      priority: 'medium',
      position: {
        x: Math.round((-offsetX / zoom + containerSize.w / zoom / 2 - NODE_WIDTH / 2) / GRID_SIZE) * GRID_SIZE,
        y: Math.round((-offsetY / zoom + containerSize.h / zoom / 2 - NODE_HEIGHT / 2) / GRID_SIZE) * GRID_SIZE,
      },
      labels: [],
      comments: [],
      activityLog: [],
      createdBy: { id: 'u1', name: 'Alice Chen' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    setSelectedNodeId(id);
    setPanelTaskId(id);
  }, [offsetX, offsetY, zoom, containerSize]);

  // ── Filtered tasks for display ─────────────────────────────────────────────
  const visibleTasks = filterStatus === 'all'
    ? tasks
    : tasks.filter(t => t.status === filterStatus);

  // ── Critical-path node IDs ─────────────────────────────────────────────────
  const criticalNodeIds = new Set(
    dependencies
      .filter(d => d.isCriticalPath)
      .flatMap(d => [d.sourceTaskId, d.targetTaskId])
  );

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = {
    total:      tasks.length,
    done:       tasks.filter(t => t.status === 'done').length,
    blocked:    tasks.filter(t => t.status === 'blocked').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
  };

  const panelTask = panelTaskId ? tasks.find(t => t.id === panelTaskId) ?? null : null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#060612] select-none" ref={containerRef}>

      {/* Dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize:  `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`,
          backgroundPosition: `${offsetX % (GRID_SIZE * zoom)}px ${offsetY % (GRID_SIZE * zoom)}px`,
        }}
      />

      {/* Toolbar */}
      <CanvasToolbar
        zoom={zoom}
        onZoomIn={() => adjustZoom(ZOOM_STEP)}
        onZoomOut={() => adjustZoom(-ZOOM_STEP)}
        onFitView={fitView}
        onAutoLayout={autoLayout}
        onAddNode={addNode}
        onDeleteSelected={() => {
          if (selectedNodeId) {
            setTasks(prev => prev.filter(t => t.id !== selectedNodeId));
            setDependencies(prev => prev.filter(
              d => d.sourceTaskId !== selectedNodeId && d.targetTaskId !== selectedNodeId
            ));
            setSelectedNodeId(null);
            setPanelTaskId(null);
          }
        }}
        hasSelection={!!selectedNodeId}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        stats={stats}
      />

      {/* Panning + canvas area */}
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={onCanvasMouseDown}
      >
        {/* Transformed world */}
        <div
          style={{
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            inset: 0,
          }}
        >
          {/* SVG edge layer (rendered below nodes) */}
          <EdgeLayer
            tasks={visibleTasks}
            dependencies={dependencies}
            selectedEdgeId={selectedEdgeId}
            onEdgeClick={(id) => {
              setSelectedEdgeId(id);
              setSelectedNodeId(null);
            }}
          />

          {/* Task nodes */}
          {visibleTasks.map(task => (
            <div key={task.id} data-node="true">
              <TaskNode
                task={task}
                selected={selectedNodeId === task.id}
                isOnCriticalPath={criticalNodeIds.has(task.id)}
                onClick={(id) => {
                  setSelectedNodeId(id);
                  setSelectedEdgeId(null);
                  setPanelTaskId(id);
                }}
                onDragStart={onNodeDragStart}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mini map */}
      <MiniMap
        tasks={visibleTasks}
        viewportX={offsetX}
        viewportY={offsetY}
        zoom={zoom}
        containerWidth={containerSize.w}
        containerHeight={containerSize.h}
      />

      {/* Task detail panel */}
      {panelTask && (
        <TaskDetailPanel
          task={panelTask}
          allTasks={tasks}
          dependencies={dependencies}
          onClose={() => setPanelTaskId(null)}
          onNavigate={(id) => {
            setSelectedNodeId(id);
            setPanelTaskId(id);
          }}
        />
      )}

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-slate-600 text-sm">No tasks yet.</p>
            <p className="text-slate-700 text-xs mt-1">Click "Add task" to get started.</p>
          </div>
        </div>
      )}
    </div>
  );
}
