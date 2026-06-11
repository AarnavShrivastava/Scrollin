import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Leaf } from 'lucide-react';
import { saveProfile, saveCheckin, saveHabits, markOnboardingDone, todayDate, dayLabel } from '../store/userStore';
import type { MoodLevel, EnergyLevel } from '../data/mockWellbeing';
import type { StoredHabit } from '../store/userStore';

interface OnboardingData {
  firstName: string;
  mood: MoodLevel | null;
  energy: EnergyLevel | null;
  sleepHours: number | null;
  habitId: string;
  habitLabel: string;
  habitCategory: StoredHabit['category'];
}

const HABIT_OPTIONS: { id: string; label: string; category: StoredHabit['category']; description: string; emoji: string }[] = [
  { id: 'h-bed',     label: 'No phone in bed',                     category: 'boundary', description: 'Keep your phone out of reach when you sleep.', emoji: '🌙' },
  { id: 'h-break',   label: '20-min screen break after school',     category: 'offline',  description: 'Give yourself space between school and your device.', emoji: '🌳' },
  { id: 'h-twice',   label: 'Check social media only twice a day',  category: 'boundary', description: 'Set two intentional times to check — not all day.', emoji: '📅' },
  { id: 'h-outside', label: 'Spend 30 min outside',                 category: 'offline',  description: "Fresh air does more for your mood than you might think.", emoji: '🌻' },
  { id: 'h-morning', label: 'Morning without screens',              category: 'mindful',  description: 'Start your day before the feed starts you.', emoji: '☀️' },
  { id: 'h-notif',   label: 'Turn off non-essential notifications', category: 'boundary', description: 'Fewer interruptions, more focus.', emoji: '🔕' },
];

const MOOD_OPTIONS: { level: MoodLevel; emoji: string; label: string }[] = [
  { level:1, emoji:'😔', label:'Really low'  },
  { level:2, emoji:'😕', label:'Not great'   },
  { level:3, emoji:'😐', label:'Okay'        },
  { level:4, emoji:'🙂', label:'Pretty good' },
  { level:5, emoji:'😊', label:'Great'       },
];

const ENERGY_OPTIONS: { level: EnergyLevel; emoji: string; label: string }[] = [
  { level:1, emoji:'🪫', label:'Exhausted'      },
  { level:2, emoji:'😴', label:'Tired'          },
  { level:3, emoji:'😑', label:'Okay'           },
  { level:4, emoji:'⚡', label:'Energised'      },
  { level:5, emoji:'🚀', label:'Full of energy' },
];

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`rounded-full transition-all duration-300 ${
          i < current  ? 'w-2 h-2 bg-powder-600' :
          i === current ? 'w-6 h-2 bg-powder-600' :
                          'w-2 h-2 bg-powder-200'
        }`} />
      ))}
    </div>
  );
}

// ─── Selection helpers ────────────────────────────────────────────────────────
const SEL  = 'bg-powder-200 border-powder-400 ring-1 ring-powder-300';
const IDLE = 'bg-cream-100 border-powder-200 hover:border-powder-300';

// ─── Step 1 ───────────────────────────────────────────────────────────────────
function StepName({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="section-label mb-2">Step 1 of 4</p>
        <h2 className="text-2xl font-extrabold text-choco-800 leading-snug mb-2">First, what should we call you? 🌸</h2>
        <p className="text-steel-500 text-sm leading-relaxed font-semibold">Just a first name is fine. Stored only on your device, never shared.</p>
      </div>
      <input
        ref={inputRef}
        type="text" value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && value.trim()) onNext(); }}
        placeholder="Your first name"
        maxLength={40}
        className="w-full text-lg px-4 py-3.5 rounded-2xl border-2 border-powder-200 bg-cream-100 text-choco-800 placeholder:text-steel-300 focus:outline-none focus:border-powder-500 focus:ring-2 focus:ring-powder-100 transition-all font-semibold"
      />
      <button onClick={onNext} disabled={!value.trim()}
        className="self-start flex items-center gap-2 px-6 py-3 rounded-2xl bg-powder-600 text-white font-extrabold text-sm hover:bg-powder-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-soft">
        Continue <ArrowRight size={14} />
      </button>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────
function StepCheckin({ firstName, mood, energy, sleepHours, onMood, onEnergy, onSleep, onNext, onBack }: {
  firstName: string; mood: MoodLevel | null; energy: EnergyLevel | null; sleepHours: number | null;
  onMood: (v: MoodLevel) => void; onEnergy: (v: EnergyLevel) => void; onSleep: (v: number) => void;
  onNext: () => void; onBack: () => void;
}) {
  const canContinue = mood !== null && energy !== null && sleepHours !== null;
  const sleepOpts   = [4, 5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 10];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="section-label mb-2">Step 2 of 4</p>
        <h2 className="text-2xl font-extrabold text-choco-800 leading-snug mb-2">Hey {firstName} — how are you right now? ☀️</h2>
        <p className="text-steel-500 text-sm leading-relaxed font-semibold">Three quick questions. This becomes your first dashboard entry.</p>
      </div>

      <div>
        <p className="text-sm font-extrabold text-choco-700 mb-3">How's your mood today?</p>
        <div className="flex gap-2 flex-wrap">
          {MOOD_OPTIONS.map(m => (
            <button key={m.level} onClick={() => onMood(m.level)}
              className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border-2 transition-all ${mood === m.level ? SEL : IDLE}`}>
              <span className="text-2xl leading-none">{m.emoji}</span>
              <span className="text-[11px] text-steel-500 whitespace-nowrap font-bold">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-extrabold text-choco-700 mb-3">How's your energy?</p>
        <div className="flex gap-2 flex-wrap">
          {ENERGY_OPTIONS.map(e => (
            <button key={e.level} onClick={() => onEnergy(e.level)}
              className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border-2 transition-all ${energy === e.level ? SEL : IDLE}`}>
              <span className="text-2xl leading-none">{e.emoji}</span>
              <span className="text-[11px] text-steel-500 whitespace-nowrap font-bold">{e.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-extrabold text-choco-700 mb-3">How many hours did you sleep last night?</p>
        <div className="flex gap-2 flex-wrap">
          {sleepOpts.map(h => (
            <button key={h} onClick={() => onSleep(h)}
              className={`px-4 py-2.5 rounded-xl border-2 text-sm font-extrabold transition-all ${sleepHours === h ? 'bg-powder-200 border-powder-400 text-choco-700 ring-1 ring-powder-300' : 'bg-cream-100 border-powder-200 text-steel-600 hover:border-powder-300'}`}>
              {h}h
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onBack} className="px-5 py-3 rounded-2xl text-sm font-extrabold text-steel-500 hover:bg-powder-100 transition-colors">Back</button>
        <button onClick={onNext} disabled={!canContinue}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-powder-600 text-white font-extrabold text-sm hover:bg-powder-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-soft">
          Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────
function StepHabit({ selectedId, onSelect, onNext, onBack }: {
  selectedId: string;
  onSelect: (id: string, label: string, category: StoredHabit['category']) => void;
  onNext: () => void; onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="section-label mb-2">Step 3 of 4</p>
        <h2 className="text-2xl font-extrabold text-choco-800 leading-snug mb-2">Pick one thing to try. 🌱</h2>
        <p className="text-steel-500 text-sm leading-relaxed font-semibold">Just one. Small changes stick better than big ones. You can add more later.</p>
      </div>

      <div className="flex flex-col gap-2">
        {HABIT_OPTIONS.map(h => (
          <button key={h.id} onClick={() => onSelect(h.id, h.label, h.category)}
            className={`w-full text-left px-4 py-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${selectedId === h.id ? SEL : IDLE}`}>
            <span className="text-xl flex-shrink-0 mt-0.5">{h.emoji}</span>
            <div>
              <p className="text-sm font-extrabold text-choco-800 mb-0.5">{h.label}</p>
              <p className="text-xs text-steel-500 font-semibold">{h.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onBack} className="px-5 py-3 rounded-2xl text-sm font-extrabold text-steel-500 hover:bg-powder-100 transition-colors">Back</button>
        <button onClick={onNext} disabled={!selectedId}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-powder-600 text-white font-extrabold text-sm hover:bg-powder-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-soft">
          Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────
function StepWelcome({ firstName, onFinish }: { firstName: string; onFinish: () => void }) {
  return (
    <div className="flex flex-col gap-6 text-center items-center">
      <div className="w-20 h-20 rounded-full bg-powder-200 border-2 border-powder-300 flex items-center justify-center">
        <span className="text-4xl">🌻</span>
      </div>
      <div>
        <p className="section-label mb-3">You're all set</p>
        <h2 className="text-2xl font-extrabold text-choco-800 leading-snug mb-3">Welcome, {firstName}! 🌸</h2>
        <p className="text-steel-500 text-sm leading-relaxed max-w-sm font-semibold">
          Your dashboard is ready with today's check-in. Come back tomorrow and it'll start building a real picture of your week.
        </p>
      </div>
      <div className="card-inset px-5 py-4 text-left w-full max-w-sm">
        <p className="text-xs text-steel-600 leading-relaxed font-semibold">
          <strong className="text-choco-700">Tip for today:</strong> You don't need to change everything at once. Just notice one moment when you reach for your phone automatically — and pause for three seconds before you do. 🌿
        </p>
      </div>
      <button onClick={onFinish}
        className="flex items-center gap-2 px-8 py-3.5 rounded-3xl bg-powder-600 text-white font-extrabold text-sm hover:bg-powder-700 transition-all shadow-soft">
        Go to my dashboard <ArrowRight size={14} />
      </button>
    </div>
  );
}

// ─── Onboarding page ──────────────────────────────────────────────────────────
export default function OnboardingPage({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    firstName: '', mood: null, energy: null, sleepHours: null,
    habitId: '', habitLabel: '', habitCategory: 'boundary',
  });

  const handleFinish = () => {
    saveProfile({ firstName: data.firstName.trim(), createdAt: new Date().toISOString() });
    const date = todayDate();
    saveCheckin({ date, dayLabel: dayLabel(date), mood: data.mood!, energy: data.energy!, sleepHours: data.sleepHours!, screenMinutes: 0, socialMinutes: 0, gamingMinutes: 0 });
    saveHabits([{ id: data.habitId, label: data.habitLabel, category: data.habitCategory, completionHistory: {} }]);
    markOnboardingDone();
    onComplete();
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col relative overflow-hidden">
      {/* Scattered circles matching brand image */}
      <div className="absolute top-12 left-6 w-20 h-20 rounded-full bg-powder-200 opacity-60 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-8 right-10 w-14 h-14 rounded-full bg-powder-200 opacity-50 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-20 left-12 w-16 h-16 rounded-full bg-powder-200 opacity-55 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-14 right-6 w-24 h-24 rounded-full bg-powder-200 opacity-45 pointer-events-none" aria-hidden="true" />
      <span className="absolute top-24 right-16 text-xl opacity-30 animate-float select-none pointer-events-none" aria-hidden="true">🌸</span>
      <span className="absolute bottom-28 left-10 text-xl opacity-30 animate-sway select-none pointer-events-none" aria-hidden="true">🌿</span>

      {/* Header */}
      <div className="bg-white border-b-2 border-powder-200 px-6 h-14 flex items-center justify-between shadow-soft relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-powder-600 flex items-center justify-center">
            <Leaf size={14} className="text-white" />
          </div>
          <span className="font-extrabold text-choco-800 text-sm">Scrollin'</span>
        </div>
        {step < 3 && <StepDots current={step} total={3} />}
        <div className="w-20" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 pt-12 pb-16 relative z-10">
        <div className="w-full max-w-lg">
          <div key={step} className="animate-fade-up" style={{ animationFillMode: 'both' }}>
            {step === 0 && <StepName value={data.firstName} onChange={v => setData(d => ({ ...d, firstName: v }))} onNext={() => setStep(1)} />}
            {step === 1 && <StepCheckin firstName={data.firstName} mood={data.mood} energy={data.energy} sleepHours={data.sleepHours}
                onMood={v => setData(d => ({ ...d, mood: v }))} onEnergy={v => setData(d => ({ ...d, energy: v }))} onSleep={v => setData(d => ({ ...d, sleepHours: v }))}
                onNext={() => setStep(2)} onBack={() => setStep(0)} />}
            {step === 2 && <StepHabit selectedId={data.habitId}
                onSelect={(id, label, category) => setData(d => ({ ...d, habitId: id, habitLabel: label, habitCategory: category }))}
                onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <StepWelcome firstName={data.firstName} onFinish={handleFinish} />}
          </div>
        </div>
      </div>
    </div>
  );
}
