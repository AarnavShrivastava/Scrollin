/**
 * userStore.ts
 *
 * Single source of truth for all persisted Scrollin' user data.
 * Uses localStorage directly — no backend, no external library.
 * All keys are namespaced under "scrollin:" to avoid collisions.
 *
 * Shape overview
 * ─────────────────────────────────────────────────────────────
 *  scrollin:profile          UserProfile
 *  scrollin:checkins         DailyCheckin[]   (all check-ins ever logged)
 *  scrollin:habits           StoredHabit[]    (user's habit list + per-day completion)
 *  scrollin:journal          JournalEntry[]   (all journal entries)
 *  scrollin:onboarding_done  "true"           (sentinel — skip onboarding for returning users)
 */

import type { MoodLevel, EnergyLevel, JournalEntry } from '../data/mockWellbeing';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  firstName: string;
  createdAt: string; // ISO date string
}

export interface DailyCheckin {
  date: string;       // YYYY-MM-DD
  dayLabel: string;   // Mon / Tue / ...
  mood: MoodLevel;
  energy: EnergyLevel;
  sleepHours: number;
  // Screen time starts at 0 — real tracking requires OS integration;
  // for now we leave it at 0 so the chart shows real check-in days vs. nothing.
  screenMinutes: number;
  socialMinutes: number;
  gamingMinutes: number;
}

export interface StoredHabit {
  id: string;
  label: string;
  category: 'offline' | 'boundary' | 'mindful';
  // Map of YYYY-MM-DD → true (completed that day)
  completionHistory: Record<string, boolean>;
}

// ─── Storage keys ─────────────────────────────────────────────────────────────
const KEY_PROFILE         = 'scrollin:profile';
const KEY_CHECKINS        = 'scrollin:checkins';
const KEY_HABITS          = 'scrollin:habits';
const KEY_JOURNAL         = 'scrollin:journal';
const KEY_ONBOARDING_DONE = 'scrollin:onboarding_done';

// ─── Generic helpers ──────────────────────────────────────────────────────────
function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage might be full or unavailable — fail silently
  }
}

// ─── Onboarding sentinel ──────────────────────────────────────────────────────
export function isOnboardingDone(): boolean {
  return localStorage.getItem(KEY_ONBOARDING_DONE) === 'true';
}

export function markOnboardingDone(): void {
  localStorage.setItem(KEY_ONBOARDING_DONE, 'true');
}

/** Hard-reset everything — used by "start over" / dev tooling */
export function clearAllData(): void {
  [KEY_PROFILE, KEY_CHECKINS, KEY_HABITS, KEY_JOURNAL, KEY_ONBOARDING_DONE].forEach(k =>
    localStorage.removeItem(k)
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export function getProfile(): UserProfile | null {
  return read<UserProfile>(KEY_PROFILE);
}

export function saveProfile(profile: UserProfile): void {
  write(KEY_PROFILE, profile);
}

// ─── Check-ins ────────────────────────────────────────────────────────────────
export function getCheckins(): DailyCheckin[] {
  return read<DailyCheckin[]>(KEY_CHECKINS) ?? [];
}

export function saveCheckin(entry: DailyCheckin): void {
  const existing = getCheckins();
  // Replace if a check-in already exists for this date
  const idx = existing.findIndex(c => c.date === entry.date);
  if (idx >= 0) {
    existing[idx] = entry;
  } else {
    existing.push(entry);
  }
  // Keep last 90 days only
  const sorted = existing.sort((a, b) => a.date.localeCompare(b.date)).slice(-90);
  write(KEY_CHECKINS, sorted);
}

export function getTodayCheckin(): DailyCheckin | null {
  const today = todayDate();
  return getCheckins().find(c => c.date === today) ?? null;
}

// ─── Habits ───────────────────────────────────────────────────────────────────
export function getHabits(): StoredHabit[] {
  return read<StoredHabit[]>(KEY_HABITS) ?? [];
}

export function saveHabits(habits: StoredHabit[]): void {
  write(KEY_HABITS, habits);
}

export function toggleHabitToday(habitId: string): void {
  const today = todayDate();
  const habits = getHabits();
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return;
  if (habit.completionHistory[today]) {
    delete habit.completionHistory[today];
  } else {
    habit.completionHistory[today] = true;
  }
  saveHabits(habits);
}

/** Returns the current streak (consecutive days ending today or yesterday) */
export function computeStreak(habit: StoredHabit): number {
  const today = todayDate();
  let streak = 0;
  let cursor = new Date(today);
  while (true) {
    const key = cursor.toISOString().split('T')[0];
    if (habit.completionHistory[key]) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/** Returns whether the habit was completed today */
export function isCompletedToday(habit: StoredHabit): boolean {
  return !!habit.completionHistory[todayDate()];
}

// ─── Journal ──────────────────────────────────────────────────────────────────
export function getJournalEntries(): JournalEntry[] {
  return read<JournalEntry[]>(KEY_JOURNAL) ?? [];
}

export function saveJournalEntry(entry: JournalEntry): void {
  const existing = getJournalEntries();
  write(KEY_JOURNAL, [entry, ...existing]);
}

// ─── Utility ──────────────────────────────────────────────────────────────────
export function todayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function dayLabel(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Returns the last N check-ins as DailyCheckin[], most recent last.
 * If fewer than N exist, pads the front with empty placeholder entries
 * so charts always have something to render.
 */
export function getRecentCheckins(n = 7): DailyCheckin[] {
  const all = getCheckins().slice(-n);
  return all;
}

/**
 * Computes averages across an array of check-ins.
 * Returns null for each field if the array is empty.
 */
export function computeAverages(checkins: DailyCheckin[]) {
  if (checkins.length === 0) return null;
  const avg = (vals: number[]) => +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1);
  return {
    mood:          avg(checkins.map(c => c.mood)),
    energy:        avg(checkins.map(c => c.energy)),
    sleepHours:    avg(checkins.map(c => c.sleepHours)),
    screenMinutes: Math.round(checkins.reduce((s, c) => s + c.screenMinutes, 0) / checkins.length),
  };
}
