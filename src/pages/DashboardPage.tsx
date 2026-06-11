import { useState, useCallback } from 'react';
import {
  Smartphone, Moon, Zap, TrendingDown, TrendingUp, Minus,
  CheckCircle2, Circle, Flame, Sun, PlusCircle, X,
} from 'lucide-react';
import {
  getProfile, getRecentCheckins, getHabits,
  getTodayCheckin, saveCheckin, toggleHabitToday,
  computeAverages, computeStreak, isCompletedToday,
  todayDate, dayLabel,
  type DailyCheckin, type StoredHabit,
} from '../store/userStore';
import { moodLabels, energyLabels, type MoodLevel, type EnergyLevel } from '../data/mockWellbeing';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtMins(m: number): string {
  if (m === 0) return '—';
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h ${min}m` : `${min}m`;
}

function MoodDot({ level }: { level: number }) {
  const colors = ['', 'bg-choco-400', 'bg-steel-300', 'bg-powder-300', 'bg-sage-400', 'bg-powder-600'];
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[level] ?? 'bg-powder-200'}`} />;
}

function TrendIcon({ delta }: { delta: number }) {
  if (delta > 0) return <TrendingUp   size={13} className="text-sage-500"  />;
  if (delta < 0) return <TrendingDown size={13} className="text-choco-400" />;
  return <Minus size={13} className="text-steel-300" />;
}

const MOOD_EMOJI:   Record<number, string> = { 1:'😔', 2:'😕', 3:'😐', 4:'🙂', 5:'😊' };
const ENERGY_EMOJI: Record<number, string> = { 1:'🪫', 2:'😴', 3:'😑', 4:'⚡', 5:'🚀' };

// ─── Check-in modal ───────────────────────────────────────────────────────────
const SLEEP_OPTIONS = [4, 5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 10];

function CheckinModal({ onSave, onClose }: { onSave: () => void; onClose: () => void }) {
  const [mood,   setMood]   = useState<MoodLevel | null>(null);
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [sleep,  setSleep]  = useState<number | null>(null);

  const handleSave = () => {
    if (!mood || !energy || sleep === null) return;
    const date = todayDate();
    saveCheckin({ date, dayLabel: dayLabel(date), mood, energy, sleepHours: sleep, screenMinutes: 0, socialMinutes: 0, gamingMinutes: 0 });
    onSave();
  };

  const emojiOpts = [
    { level:1, emoji:'😔', label:'Really low'   },
    { level:2, emoji:'😕', label:'Not great'    },
    { level:3, emoji:'😐', label:'Okay'         },
    { level:4, emoji:'🙂', label:'Pretty good'  },
    { level:5, emoji:'😊', label:'Great'        },
  ];
  const energyOpts = [
    { level:1, emoji:'🪫', label:'Exhausted'      },
    { level:2, emoji:'😴', label:'Tired'          },
    { level:3, emoji:'😑', label:'Okay'           },
    { level:4, emoji:'⚡', label:'Energised'      },
    { level:5, emoji:'🚀', label:'Full of energy' },
  ];

  const selClass  = 'bg-powder-200 border-powder-400 ring-1 ring-powder-300';
  const idleClass = 'bg-cream-100 border-powder-200 hover:border-powder-300';

  return (
    <div
      className="fixed inset-0 z-50 bg-choco-900/20 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl border-2 border-powder-200 shadow-lifted w-full max-w-md p-6 flex flex-col gap-5 animate-fade-up" style={{ animationFillMode: 'both' }}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-extrabold text-choco-800">Today's check-in ☀️</h2>
            <p className="text-xs text-steel-400 mt-0.5 font-semibold">Three quick questions — takes under a minute.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-powder-100 text-steel-400 transition-colors"><X size={16}/></button>
        </div>

        {/* Mood */}
        <div>
          <p className="text-sm font-extrabold text-choco-700 mb-2">How's your mood?</p>
          <div className="flex gap-2">
            {emojiOpts.map(o => (
              <button key={o.level} onClick={() => setMood(o.level as MoodLevel)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl border-2 text-xs transition-all ${mood === o.level ? selClass : idleClass}`}>
                <span className="text-lg">{o.emoji}</span>
                <span className="text-[10px] text-steel-500 font-bold">{o.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div>
          <p className="text-sm font-extrabold text-choco-700 mb-2">How's your energy?</p>
          <div className="flex gap-2">
            {energyOpts.map(o => (
              <button key={o.level} onClick={() => setEnergy(o.level as EnergyLevel)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl border-2 text-xs transition-all ${energy === o.level ? selClass : idleClass}`}>
                <span className="text-lg">{o.emoji}</span>
                <span className="text-[10px] text-steel-500 font-bold">{o.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sleep */}
        <div>
          <p className="text-sm font-extrabold text-choco-700 mb-2">Hours of sleep last night?</p>
          <div className="flex flex-wrap gap-2">
            {SLEEP_OPTIONS.map(h => (
              <button key={h} onClick={() => setSleep(h)}
                className={`px-3.5 py-2 rounded-xl border-2 text-sm font-extrabold transition-all ${sleep === h ? 'bg-powder-200 border-powder-400 text-choco-700 ring-1 ring-powder-300' : 'bg-cream-100 border-powder-200 text-steel-600 hover:border-powder-300'}`}>
                {h}h
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!mood || !energy || sleep === null}
          className="w-full py-3 rounded-2xl bg-powder-600 text-white font-extrabold text-sm hover:bg-powder-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-soft"
        >
          Save check-in 🌿
        </button>
      </div>
    </div>
  );
}

// ─── Screen-time chart ─────────────────────────────────────────────────────────
function ScreenTimeChart({ checkins }: { checkins: DailyCheckin[] }) {
  const todayEntry = getTodayCheckin();
  const max = Math.max(...checkins.map(d => d.screenMinutes), 60);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-steel-400 mb-0.5">Screen time</p>
          <p className="text-2xl font-extrabold text-choco-800">{fmtMins(todayEntry?.screenMinutes ?? 0)}</p>
          <p className="text-xs text-steel-400 font-bold">today · self-reported</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-powder-200 border-2 border-powder-300 flex items-center justify-center">
          <Smartphone size={18} className="text-powder-600" />
        </div>
      </div>

      {checkins.length > 0 ? (
        <div className="flex items-end gap-1.5 h-24">
          {checkins.map(d => {
            const isToday = d.date === todayDate();
            const pct = checkins.length === 1 && d.screenMinutes === 0 ? 8 : Math.max((d.screenMinutes / max) * 100, 4);
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full relative" style={{ height: '80px' }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-t-xl transition-all duration-500 ${isToday ? 'bg-powder-600' : 'bg-powder-300'}`}
                    style={{ height: `${pct}%` }}
                    title={`${d.dayLabel}: ${fmtMins(d.screenMinutes)}`}
                  />
                </div>
                <span className={`text-[10px] font-extrabold ${isToday ? 'text-powder-600' : 'text-steel-400'}`}>{d.dayLabel}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-steel-400 text-center py-8 font-semibold">Check in daily to build your chart.</p>
      )}

      <p className="text-xs text-steel-400 mt-3 pt-3 border-t border-powder-200 font-semibold">
        Screen time is self-reported. We don't track your device usage.
      </p>
    </div>
  );
}

// ─── Today check-in card ───────────────────────────────────────────────────────
function CheckinCard({ checkin, onOpenModal }: { checkin: DailyCheckin | null; onOpenModal: () => void }) {
  const recentTwo   = getRecentCheckins(7).slice(-2);
  const prev        = recentTwo.length >= 2 ? recentTwo[0] : null;
  const moodDelta   = checkin && prev ? checkin.mood   - prev.mood   : 0;
  const energyDelta = checkin && prev ? checkin.energy - prev.energy : 0;

  if (!checkin) {
    return (
      <div className="card p-5 flex flex-col gap-4">
        <p className="text-xs font-extrabold uppercase tracking-widest text-steel-400">Today's check-in</p>
        <div className="card-inset px-4 py-6 text-center">
          <p className="text-3xl mb-2">☀️</p>
          <p className="text-sm font-extrabold text-choco-800 mb-1">You haven't checked in today.</p>
          <p className="text-xs text-steel-500 mb-4 font-semibold">Takes under a minute. Helps you spot patterns over time.</p>
          <button
            onClick={onOpenModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-powder-600 text-white text-sm font-extrabold hover:bg-powder-700 transition-all shadow-soft"
          >
            <PlusCircle size={14}/> Check in now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-extrabold uppercase tracking-widest text-steel-400">Today's check-in</p>
        <button onClick={onOpenModal} className="text-xs text-powder-600 hover:text-powder-700 transition-colors font-extrabold">Update</button>
      </div>

      {/* Mood */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-powder-100 border-2 border-powder-200 flex items-center justify-center">
            <Sun size={16} className="text-powder-600" />
          </div>
          <div>
            <p className="text-xs text-steel-400 font-bold">Mood</p>
            <div className="flex items-center gap-1.5">
              <MoodDot level={checkin.mood} />
              <p className="text-sm font-extrabold text-choco-800">{MOOD_EMOJI[checkin.mood]} {moodLabels[checkin.mood as MoodLevel]}</p>
            </div>
          </div>
        </div>
        {prev && (
          <div className="flex items-center gap-1 text-xs text-steel-400 font-bold">
            <TrendIcon delta={moodDelta} />
            <span>{moodDelta > 0 ? `+${moodDelta}` : moodDelta < 0 ? moodDelta : '–'}</span>
          </div>
        )}
      </div>

      {/* Energy */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-cream-100 border-2 border-powder-200 flex items-center justify-center">
            <Zap size={16} className="text-steel-500" />
          </div>
          <div>
            <p className="text-xs text-steel-400 font-bold">Energy</p>
            <div className="flex items-center gap-1.5">
              <MoodDot level={checkin.energy} />
              <p className="text-sm font-extrabold text-choco-800">{ENERGY_EMOJI[checkin.energy]} {energyLabels[checkin.energy as EnergyLevel]}</p>
            </div>
          </div>
        </div>
        {prev && (
          <div className="flex items-center gap-1 text-xs text-steel-400 font-bold">
            <TrendIcon delta={energyDelta} />
            <span>{energyDelta > 0 ? `+${energyDelta}` : energyDelta < 0 ? energyDelta : '–'}</span>
          </div>
        )}
      </div>

      {/* Sleep */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-powder-100 border-2 border-powder-200 flex items-center justify-center">
            <Moon size={16} className="text-powder-600" />
          </div>
          <div>
            <p className="text-xs text-steel-400 font-bold">Sleep last night</p>
            <p className="text-sm font-extrabold text-choco-800">{checkin.sleepHours}h</p>
          </div>
        </div>
        <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
          checkin.sleepHours >= 8   ? 'bg-sage-100 text-sage-700' :
          checkin.sleepHours >= 6.5 ? 'bg-powder-200 text-steel-600' :
                                      'bg-cream-200 text-choco-600'
        }`}>
          {checkin.sleepHours >= 8 ? '🌙 Good' : checkin.sleepHours >= 6.5 ? '😐 Fair' : '⚡ Low'}
        </span>
      </div>
    </div>
  );
}

// ─── Habits card ───────────────────────────────────────────────────────────────
const CATEGORY_STYLES: Record<StoredHabit['category'], string> = {
  offline:  'bg-powder-100 text-powder-700 border-powder-300',
  boundary: 'bg-cream-200 text-choco-600 border-cream-400',
  mindful:  'bg-sage-100 text-sage-700 border-sage-200',
};

function HabitsCard({ habits, onToggle, completedCount }: { habits: StoredHabit[]; onToggle: (id: string) => void; completedCount: number }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-extrabold uppercase tracking-widest text-steel-400">Daily habits</p>
        <span className="text-xs text-steel-400 font-extrabold">{completedCount}/{habits.length} today</span>
      </div>

      {habits.length === 0 ? (
        <p className="text-xs text-steel-400 text-center py-6 font-semibold">No habits yet — add one to get started.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {habits.map(h => {
            const done   = isCompletedToday(h);
            const streak = computeStreak(h);
            return (
              <button
                key={h.id}
                onClick={() => onToggle(h.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all ${done ? 'bg-powder-100 border-powder-300' : 'bg-cream-50 border-powder-200 hover:border-powder-300'}`}
              >
                {done
                  ? <CheckCircle2 size={17} className="text-powder-600 flex-shrink-0" />
                  : <Circle       size={17} className="text-steel-300 flex-shrink-0" />
                }
                <span className={`text-sm flex-1 font-bold ${done ? 'text-steel-400 line-through' : 'text-choco-800'}`}>{h.label}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {streak > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] text-choco-500 font-extrabold">
                      <Flame size={10} className="text-choco-400"/> {streak}
                    </span>
                  )}
                  <span className={`badge border ${CATEGORY_STYLES[h.category]}`}>{h.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Mood timeline ─────────────────────────────────────────────────────────────
function MoodTimeline({ checkins }: { checkins: DailyCheckin[] }) {
  const moodColors: Record<number, string> = {
    1: 'bg-choco-200', 2: 'bg-choco-100', 3: 'bg-powder-200', 4: 'bg-powder-400', 5: 'bg-powder-600',
  };

  if (checkins.length === 0) {
    return (
      <div className="card p-5">
        <p className="text-xs font-extrabold uppercase tracking-widest text-steel-400 mb-4">Mood this week</p>
        <p className="text-xs text-steel-400 text-center py-8 font-semibold">Check in daily to see your mood history here.</p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <p className="text-xs font-extrabold uppercase tracking-widest text-steel-400 mb-4">Mood this week</p>
      <div className="flex items-end gap-2">
        {checkins.map(d => {
          const isToday = d.date === todayDate();
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={`w-full rounded-xl ${moodColors[d.mood] ?? 'bg-powder-200'} ${isToday ? 'ring-2 ring-powder-500' : ''} transition-all`}
                style={{ height: `${(d.mood / 5) * 56 + 12}px` }}
                title={`${d.dayLabel}: ${moodLabels[d.mood as MoodLevel]}`}
              />
              <span className={`text-[10px] font-extrabold ${isToday ? 'text-powder-600' : 'text-steel-400'}`}>{d.dayLabel}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-steel-400 font-extrabold">
        <span>Low mood 😔</span><span>High mood 😊</span>
      </div>
    </div>
  );
}

// ─── Insight banner ───────────────────────────────────────────────────────────
function InsightBanner({ checkins, firstName }: { checkins: DailyCheckin[]; firstName: string }) {
  if (checkins.length === 0) return null;
  const avgs = computeAverages(checkins);
  if (!avgs) return null;

  const highScreen = checkins.filter(d => d.screenMinutes > 360).length;
  const bestDay    = [...checkins].sort((a, b) => b.mood - a.mood)[0];
  const lowSleep   = checkins.filter(d => d.sleepHours < 6.5).length;

  let title = '', body = '', emoji = '✦';

  if (checkins.length === 1) {
    title = `Good start, ${firstName}. 🌱`; body = `You've logged your first check-in. Come back tomorrow to start seeing how your days connect.`; emoji = '🌱';
  } else if (highScreen >= 2) {
    title = `${highScreen} days with high screen time this week`; body = `On those days your mood averaged lower. Not a judgment — just something worth noticing.`; emoji = '📱';
  } else if (lowSleep >= 2) {
    title = `${lowSleep} nights with less than 6.5 hours of sleep`; body = `Sleep and mood are closely linked. Even one extra hour can make a noticeable difference.`; emoji = '😴';
  } else if (bestDay) {
    title = `Your best day so far was ${bestDay.dayLabel}`; body = `Mood: ${moodLabels[bestDay.mood as MoodLevel]}. What was different about that day?`; emoji = '🌟';
  }

  if (!title) return null;

  return (
    <div className="card-inset px-5 py-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-2xl bg-powder-200 border-2 border-powder-300 flex items-center justify-center flex-shrink-0 mt-0.5 text-base">{emoji}</div>
      <div>
        <p className="text-sm font-extrabold text-choco-800 mb-0.5">{title}</p>
        <p className="text-xs text-steel-500 leading-relaxed font-semibold">{body}</p>
      </div>
    </div>
  );
}

// ─── Dashboard page ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [refresh, setRefresh] = useState(0);
  const forceRefresh = useCallback(() => setRefresh(n => n + 1), []);
  const [showModal, setShowModal] = useState(false);

  const profile   = getProfile();
  const firstName = profile?.firstName ?? 'there';
  const checkins  = getRecentCheckins(7);
  const todayCI   = getTodayCheckin();
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const handleToggle   = (id: string) => { toggleHabitToday(id); forceRefresh(); };
  const handleCheckinSaved = () => { setShowModal(false); forceRefresh(); };

  const liveHabits    = getHabits();
  const liveCompleted = liveHabits.filter(h => isCompletedToday(h)).length;

  return (
    <div className="min-h-screen bg-cream-100">
      {showModal && <CheckinModal onSave={handleCheckinSaved} onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div className="bg-white border-b-2 border-powder-200 px-6 py-5 shadow-soft">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-steel-400 mb-0.5 font-bold">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="text-xl font-extrabold text-choco-800">{greeting}, {firstName}. 🌸</h1>
              <p className="text-sm text-steel-500 mt-0.5 font-semibold">
                {liveCompleted === 0 ? 'No habits ticked off yet — no rush.' :
                 liveCompleted === liveHabits.length && liveHabits.length > 0 ? 'All habits done for today. Well done 🌟' :
                 `${liveCompleted} of ${liveHabits.length} habit${liveHabits.length !== 1 ? 's' : ''} done today.`}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              {liveHabits.length > 0 && (
                <>
                  <p className="text-2xl font-extrabold text-powder-600">{Math.round((liveCompleted / liveHabits.length) * 100)}%</p>
                  <p className="text-xs text-steel-400 font-bold">today's habits</p>
                </>
              )}
            </div>
          </div>

          {liveHabits.length > 0 && (
            <div className="mt-4 h-2 bg-powder-100 rounded-full overflow-hidden">
              <div className="h-full bg-powder-500 rounded-full transition-all duration-500" style={{ width: `${(liveCompleted / liveHabits.length) * 100}%` }} />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-5" key={refresh}>
        <InsightBanner checkins={checkins} firstName={firstName} />
        <div className="grid md:grid-cols-2 gap-5">
          <ScreenTimeChart checkins={checkins} />
          <CheckinCard checkin={todayCI} onOpenModal={() => setShowModal(true)} />
        </div>
        <MoodTimeline checkins={checkins} />
        <HabitsCard habits={liveHabits} onToggle={handleToggle} completedCount={liveCompleted} />
        <p className="text-xs text-center text-steel-400 pb-4 font-bold">🌿 All data is stored only on this device and never shared.</p>
      </div>
    </div>
  );
}
