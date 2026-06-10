/**
 * The semantic relationship between two tasks.
 *
 * - "finish-to-start"  (default) — target cannot start until source is done.
 *   e.g. "Write tests" must finish before "Merge PR" can start.
 *
 * - "start-to-start"   — target cannot start until source has started.
 *   e.g. "Backend API" must start before "Frontend integration" can start.
 *
 * - "finish-to-finish" — target cannot finish until source has finished.
 *   e.g. "Documentation" cannot be marked done until "Feature" is done.
 *
 * - "start-to-finish"  — (rare) target cannot finish until source has started.
 *   Used in scheduling scenarios where a successor keeps a predecessor alive.
 */
export type DependencyType =
  | 'finish-to-start'
  | 'start-to-start'
  | 'finish-to-finish'
  | 'start-to-finish';

/**
 * Represents a directed dependency edge between two tasks on the project graph.
 *
 * Direction: sourceTaskId ──► targetTaskId
 * Reading: "target depends on source" / "source blocks target"
 */
export interface Dependency {
  /**
   * Unique identifier for this dependency edge — UUID from the database.
   */
  id: string;

  /**
   * The project both tasks belong to.
   * Denormalized here so edges can be fetched without joining tasks.
   */
  projectId: string;

  /**
   * The upstream / blocking task.
   * This task must satisfy the dependency condition before the target can proceed.
   */
  sourceTaskId: string;

  /**
   * The downstream / blocked task.
   * This task is gated on the source satisfying the dependency condition.
   */
  targetTaskId: string;

  /**
   * The semantic type of the dependency relationship.
   * Defaults to "finish-to-start" — the most common case.
   */
  type: DependencyType;

  /**
   * Optional short label rendered on the edge arrow on the canvas.
   * e.g. "requires", "blocks", "triggers"
   * Max 32 characters.
   */
  label?: string;

  /**
   * Optional lag time in hours between the source condition being met
   * and the target becoming unblocked.
   * Positive = delay (e.g. "wait 24h after deploy before testing").
   * Negative = lead time overlap (target can start before source finishes).
   */
  lagHours?: number;

  /**
   * Whether this edge lies on the project's critical path.
   * Computed server-side via topological sort; stored for fast highlight rendering.
   */
  isCriticalPath: boolean;

  /** ISO 8601 timestamp of when this dependency was created. */
  createdAt: string;
}
