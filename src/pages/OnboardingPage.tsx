import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Scroll } from 'lucide-react';
import {
  saveProfile, saveCheckin, saveHabits, markOnboardingDone,
  todayDate, dayLabel,
} from '../store/userStore';
import type { MoodLevel, EnergyLevel } from '../data/mockWellbeing';
import type { StoredHabit } from '../store/userStore';

// ─── Shared types ─────────────────────────────────────────────────────────────
interface OnboardingData {
  firstName: string;
  mood: MoodLevel | null;
  energy: EnergyLevel | null;
  sleepHours: number | null;
  habitId: string;
  habitLabel: string;
  habitCategory: StoredHabit['category'];
}

// ─── Habit options presented in step 3 ───────────────────────────────────────
const HABIT_OPTIONS: { id: string; label: string; category: StoredHabit['category']; description: string }[] = [
  { id: 'h-bed',      label: 'No phone in bed',                  category: 'boundary', description: 'Keep your phone out of reach when you sleep.' },
  { id: 'h-break',    label: '20-min screen break after school',  category: 'offline',  description: 'Give yourself space between school and your device.' },
  { id: 'h-twice',    label: 'Check social media only twice a day', category: 'boundary', description: 'Set two intentional times to check — not all day.' },
  { id: 'h-outside',  label: 'Spend 30 min outside',             category: 'offline',  description: 'Fresh air does more for your mood than you might think.' },
  { id: 'h-morning',  label: 'Morning without screens',          category: 'mindful',  description: 'Start your day before the feed starts you.' },
  { id: 'h-notif',    label: 'Turn off non-essential notifications', category: 'boundary', description: 'Fewer interruptions, more focus.' },
];

// ─── Mood option data ─────────────────────────────────────────────────────────
const MOOD_OPTIONS: { level: MoodLevel; emoji: string; label: string }[] = [
  { level: 1, emoji: '😔', label: 'Really low'  },
  { level: 2, emoji: '😕', label: 'Not great'   },
  { level: 3, emoji: '😐', label: 'Okay'        },
  { level: 4, emoji: '🙂', label: 'Pretty good' },
  { level: 5, emoji: '😊', label: 'Great'       },
];

const ENERGY_OPTIONS: { level: EnergyLevel; emoji: string; label: string }[] = [
  { level: 1, emoji: '🪫', label: 'Exhausted'       },
  { level: 2, emoji: '😴', label: 'Tired'           },
  { level: 3, emoji: '😑', label: 'Okay'            },
  { level: 4, emoji: '⚡', label: 'Energised'       },
  { level: 5, emoji: '🚀', label: 'Full of energy'  },
];

// ─── Progress dots ────────────────────────────────────────────────────────────
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i < current ? 'w-2 h-2 bg-calm-600' :
            i === current ? 'w-6 h-2 bg-calm-600' :
            'w-2 h-2 bg-sand-200'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Step 1 — Name ────────────────────────────────────────────────────────────
function StepName({
  value, onChange, onNext,
}: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-calm-600 mb-2">Step 1 of 4</p>
        <h2 className="text-2xl font-semibold text-sand-900 leading-snug mb-2">
          First, what should we call you?
        </h2>
        <p className="text-sand-500 text-sm leading-relaxed">
          Just a first name is fine. This is stored only on your device and never shared.
        </p>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && value.trim()) onNext(); }}
        placeholder="Your first name"
        maxLength={40}
        className="w-full text-lg px-4 py-3.5 rounded-xl border border-sand-200 bg-white text-sand-900 placeholder:text-sand-300 focus:outline-none focus:border-calm-400 focus:ring-2 focus:ring-calm-100 transition-all"
      />

      <button
        onClick={onNext}
        disabled={!value.trim()}
        className="self-start flex items-center gap-2 px-6 py-3 rounded-xl bg-calm-600 text-white font-medium text-sm hover:bg-calm-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Continue <ArrowRight size={14} />
      </button>
    </div>
  );
}

// ─── Step 2 — Mood / Energy / Sleep ──────────────────────────────────────────
function StepCheckin({
  firstName,
  mood, energy, sleepHours,
  onMood, onEnergy, onSleep,
  onNext, onBack,
}: {
  firstName: string;
  mood: MoodLevel | null; energy: EnergyLevel | null; sleepHours: number | null;
  onMood: (v: MoodLevel) => void; onEnergy: (v: EnergyLevel) => void; onSleep: (v: number) => void;
  onNext: () => void; onBack: () => void;
}) {
  const canContinue = mood !== null && energy !== null && sleepHours !== null;

  const sleepOptions = [4, 5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 10];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-calm-600 mb-2">Step 2 of 4</p>
        <h2 className="text-2xl font-semibold text-sand-900 leading-snug mb-2">
          Hey {firstName} — how are you right now?
        </h2>
        <p className="text-sand-500 text-sm leading-relaxed">
          Three quick questions. This becomes your first dashboard entry.
        </p>
      </div>

      {/* Mood */}
      <div>
        <p className="text-sm font-medium text-sand-700 mb-3">How's your mood today?</p>
        <div className="flex gap-2 flex-wrap">
          {MOOD_OPTIONS.map(m => (
            <button
              key={m.level}
              onClick={() => onMood(m.level)}
              className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all ${
                mood === m.level
                  ? 'bg-calm-50 border-calm-400 ring-1 ring-calm-300'
                  : 'bg-white border-sand-200 hover:border-sand-300'
              }`}
            >
              <span className="text-2xl leading-none">{m.emoji}</span>
              <span className="text-[11px] text-sand-500 whitespace-nowrap">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Energy */}
      <div>
        <p className="text-sm font-medium text-sand-700 mb-3">How's your energy?</p>
        <div className="flex gap-2 flex-wrap">
          {ENERGY_OPTIONS.map(e => (
            <button
              key={e.level}
              onClick={() => onEnergy(e.level)}
              className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all ${
                energy === e.level
                  ? 'bg-calm-50 border-calm-400 ring-1 ring-calm-300'
                  : 'bg-white border-sand-200 hover:border-sand-300'
              }`}
            >
              <span className="text-2xl leading-none">{e.emoji}</span>
              <span className="text-[11px] text-sand-500 whitespace-nowrap">{e.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sleep */}
      <div>
        <p className="text-sm font-medium text-sand-700 mb-3">How many hours did you sleep last night?</p>
        <div className="flex gap-2 flex-wrap">
          {sleepOptions.map(h => (
            <button
              key={h}
              onClick={() => onSleep(h)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                sleepHours === h
                  ? 'bg-calm-50 border-calm-400 text-calm-700 ring-1 ring-calm-300'
                  : 'bg-white border-sand-200 text-sand-700 hover:border-sand-300'
              }`}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onBack} className="px-5 py-3 rounded-xl text-sm text-sand-500 hover:bg-sand-100 transition-colors">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-calm-600 text-white font-medium text-sm hover:bg-calm-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 — Habit goal ──────────────────────────────────────────────────────
function StepHabit({
  selectedId,
  onSelect,
  onNext, onBack,
}: { selectedId: string; onSelect: (id: string, label: string, category: StoredHabit['category']) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-calm-600 mb-2">Step 3 of 4</p>
        <h2 className="text-2xl font-semibold text-sand-900 leading-snug mb-2">
          Pick one thing to try.
        </h2>
        <p className="text-sand-500 text-sm leading-relaxed">
          Just one. Small changes stick better than big ones. You can add more later.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {HABIT_OPTIONS.map(h => (
          <button
            key={h.id}
            onClick={() => onSelect(h.id, h.label, h.category)}
            className={`w-full text-left px-4 py-4 rounded-xl border transition-all ${
              selectedId === h.id
                ? 'bg-calm-50 border-calm-400 ring-1 ring-calm-300'
                : 'bg-white border-sand-200 hover:border-sand-300'
            }`}
          >
            <p className="text-sm font-medium text-sand-900 mb-0.5">{h.label}</p>
            <p className="text-xs text-sand-500">{h.description}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onBack} className="px-5 py-3 rounded-xl text-sm text-sand-500 hover:bg-sand-100 transition-colors">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selectedId}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-calm-600 text-white font-medium text-sm hover:bg-calm-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 4 — Welcome ─────────────────────────────────────────────────────────
function StepWelcome({ firstName, onFinish }: { firstName: string; onFinish: () => void }) {
  return (
    <div className="flex flex-col gap-6 text-center items-center">
      <div className="w-16 h-16 rounded-2xl bg-calm-50 border border-calm-200 flex items-center justify-center">
        <span className="text-3xl">🌱</span>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-calm-600 mb-3">You're all set</p>
        <h2 className="text-2xl font-semibold text-sand-900 leading-snug mb-3">
          Welcome, {firstName}.
        </h2>
        <p className="text-sand-500 text-sm leading-relaxed max-w-sm">
          Your dashboard is ready with today's check-in. Come back tomorrow and it'll start building a real picture of your week.
        </p>
      </div>

      <div className="card-inset px-5 py-4 text-left w-full max-w-sm">
        <p className="text-xs text-sand-500 leading-relaxed">
          <strong className="text-sand-700">Tip for today:</strong> You don't need to change everything at once. Just notice one moment when you reach for your phone automatically — and pause for three seconds before you do.
        </p>
      </div>

      <button
        onClick={onFinish}
        className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-calm-600 text-white font-medium text-sm hover:bg-calm-700 transition-all shadow-sm"
      >
        Go to my dashboard <ArrowRight size={14} />
      </button>
    </div>
  );
}

// ─── Onboarding page ──────────────────────────────────────────────────────────
export default function OnboardingPage({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    mood: null,
    energy: null,
    sleepHours: null,
    habitId: '',
    habitLabel: '',
    habitCategory: 'boundary',
  });

  const handleFinish = () => {
    // 1. Save profile
    saveProfile({ firstName: data.firstName.trim(), createdAt: new Date().toISOString() });

    // 2. Save today's check-in
    const date = todayDate();
    saveCheckin({
      date,
      dayLabel: dayLabel(date),
      mood:         data.mood!,
      energy:       data.energy!,
      sleepHours:   data.sleepHours!,
      screenMinutes: 0,
      socialMinutes: 0,
      gamingMinutes: 0,
    });

    // 3. Save habit
    const habit: StoredHabit = {
      id: data.habitId,
      label: data.habitLabel,
      category: data.habitCategory,
      completionHistory: {},
    };
    saveHabits([habit]);

    // 4. Mark onboarding done
    markOnboardingDone();

    // 5. Hand control back to App
    onComplete();
  };

  const steps = 4;

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-sand-200 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-calm-600 flex items-center justify-center">
            <Scroll size={13} className="text-white" />
          </div>
          <span className="font-semibold text-sand-900 text-sm">Scrollin'</span>
        </div>
        {step < steps - 1 && <StepDots current={step} total={steps - 1} />}
        <div className="w-20" /> {/* spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 pt-12 pb-16">
        <div className="w-full max-w-lg">
          {/* Step transition wrapper */}
          <div key={step} className="animate-fade-up" style={{ animationFillMode: 'both' }}>
            {step === 0 && (
              <StepName
                value={data.firstName}
                onChange={v => setData(d => ({ ...d, firstName: v }))}
                onNext={() => setStep(1)}
              />
            )}
            {step === 1 && (
              <StepCheckin
                firstName={data.firstName}
                mood={data.mood}
                energy={data.energy}
                sleepHours={data.sleepHours}
                onMood={v => setData(d => ({ ...d, mood: v }))}
                onEnergy={v => setData(d => ({ ...d, energy: v }))}
                onSleep={v => setData(d => ({ ...d, sleepHours: v }))}
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <StepHabit
                selectedId={data.habitId}
                onSelect={(id, label, category) => setData(d => ({ ...d, habitId: id, habitLabel: label, habitCategory: category }))}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <StepWelcome
                firstName={data.firstName}
                onFinish={handleFinish}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
