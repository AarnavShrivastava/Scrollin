import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, Save, BookOpen, Tag, X } from 'lucide-react';
import {
  reflectionPrompts, moodLabels,
  type JournalEntry, type MoodLevel,
} from '../data/mockWellbeing';
import { getJournalEntries, saveJournalEntry } from '../store/userStore';

// ─── Mood selector ────────────────────────────────────────────────────────────
const MOOD_OPTIONS: { level: MoodLevel; emoji: string; label: string }[] = [
  { level: 1, emoji: '😔', label: 'Really low'  },
  { level: 2, emoji: '😕', label: 'Not great'   },
  { level: 3, emoji: '😐', label: 'Okay'        },
  { level: 4, emoji: '🙂', label: 'Pretty good' },
  { level: 5, emoji: '😊', label: 'Great'       },
];

function MoodPicker({ value, onChange }: { value: MoodLevel | null; onChange: (m: MoodLevel) => void }) {
  return (
    <div>
      <p className="text-xs font-medium text-sand-500 mb-2">How are you feeling right now?</p>
      <div className="flex gap-2">
        {MOOD_OPTIONS.map(m => (
          <button
            key={m.level}
            onClick={() => onChange(m.level)}
            title={m.label}
            className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border text-sm transition-all ${
              value === m.level
                ? 'bg-calm-50 border-calm-300 ring-1 ring-calm-400'
                : 'bg-white border-sand-200 hover:border-sand-300'
            }`}
          >
            <span className="text-xl leading-none">{m.emoji}</span>
            <span className="text-[10px] text-sand-500">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Entry card (past journal) ────────────────────────────────────────────────
function EntryCard({ entry, onSelect }: { entry: JournalEntry; onSelect: (e: JournalEntry) => void }) {
  const moodEmoji = MOOD_OPTIONS.find(m => m.level === entry.mood)?.emoji ?? '😐';
  const preview = entry.body.slice(0, 120) + (entry.body.length > 120 ? '…' : '');

  return (
    <button
      onClick={() => onSelect(entry)}
      className="card card-hover w-full text-left p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-sand-400 mb-1">
            {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-xs text-sand-600 italic line-clamp-1">"{entry.prompt}"</p>
        </div>
        <span className="text-xl flex-shrink-0">{moodEmoji}</span>
      </div>
      <p className="text-sm text-sand-700 leading-relaxed">{preview}</p>
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {entry.tags.map(t => (
          <span key={t} className="text-[10px] font-medium bg-sand-100 text-sand-500 px-2.5 py-1 rounded-full">
            {t}
          </span>
        ))}
      </div>
    </button>
  );
}

// ─── Entry detail view ────────────────────────────────────────────────────────
function EntryDetail({ entry, onClose }: { entry: JournalEntry; onClose: () => void }) {
  const moodEmoji = MOOD_OPTIONS.find(m => m.level === entry.mood)?.emoji ?? '😐';

  return (
    <div className="card p-6 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-sand-400 mb-1">
            {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-xs text-sand-500 italic">"{entry.prompt}"</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{moodEmoji}</span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-sand-100 text-sand-400 transition-colors" aria-label="Close">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="card-inset p-4">
        <p className="text-sand-800 text-sm leading-relaxed whitespace-pre-wrap font-serif">{entry.body}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {entry.tags.map(t => (
          <span key={t} className="badge bg-sand-100 text-sand-500 border border-sand-200">
            <Tag size={9} /> {t}
          </span>
        ))}
      </div>

      <div className="pt-2 border-t border-sand-100">
        <p className="text-xs text-sand-400 italic">
          "Every time you reflect, you're choosing to understand yourself a little better."
        </p>
      </div>
    </div>
  );
}

// ─── New entry composer ───────────────────────────────────────────────────────
function NewEntryComposer({ onSave }: { onSave: (entry: Omit<JournalEntry, 'id' | 'date'>) => void }) {
  const [promptIdx, setPromptIdx] = useState(0);
  const [body, setBody]           = useState('');
  const [mood, setMood]           = useState<MoodLevel | null>(null);
  const [tags, setTags]           = useState<string[]>([]);
  const [tagInput, setTagInput]   = useState('');
  const [saved, setSaved]         = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const prompt = reflectionPrompts[promptIdx];
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  const nextPrompt = () => setPromptIdx(i => (i + 1) % reflectionPrompts.length);
  const shufflePrompt = () => {
    let next = Math.floor(Math.random() * reflectionPrompts.length);
    if (next === promptIdx) next = (next + 1) % reflectionPrompts.length;
    setPromptIdx(next);
    setBody('');
    setSaved(false);
    textRef.current?.focus();
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g,'-');
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const handleSave = () => {
    if (!body.trim() || !mood) return;
    onSave({ prompt, body: body.trim(), mood, tags });
    setSaved(true);
    setTimeout(() => { setBody(''); setMood(null); setTags([]); setSaved(false); nextPrompt(); }, 1800);
  };

  return (
    <div className="card p-6 flex flex-col gap-5">
      {/* Prompt */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-sand-400">Today's prompt</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPromptIdx(i => Math.max(0, i - 1))}
              disabled={promptIdx === 0}
              className="p-1 rounded-lg hover:bg-sand-100 text-sand-400 disabled:opacity-30 transition-colors"
              aria-label="Previous prompt"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={shufflePrompt}
              className="p-1 rounded-lg hover:bg-sand-100 text-sand-400 transition-colors"
              aria-label="Shuffle prompt"
            >
              <Shuffle size={14} />
            </button>
            <button
              onClick={nextPrompt}
              className="p-1 rounded-lg hover:bg-sand-100 text-sand-400 transition-colors"
              aria-label="Next prompt"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        <div className="card-inset px-4 py-3">
          <p className="text-sand-800 text-sm italic leading-relaxed">"{prompt}"</p>
        </div>
      </div>

      {/* Text area */}
      <div>
        <textarea
          ref={textRef}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Write whatever comes to mind. There's no right answer here."
          className="w-full h-40 resize-none rounded-xl border border-sand-200 bg-white text-sand-800 text-sm leading-relaxed px-4 py-3 placeholder:text-sand-300 focus:outline-none focus:border-calm-300 focus:ring-1 focus:ring-calm-300 transition-all font-serif"
        />
        <p className="text-[10px] text-sand-300 text-right mt-1">{wordCount} word{wordCount !== 1 ? 's' : ''}</p>
      </div>

      {/* Mood */}
      <MoodPicker value={mood} onChange={setMood} />

      {/* Tags */}
      <div>
        <p className="text-xs font-medium text-sand-500 mb-2">Tags (optional)</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map(t => (
            <span key={t} className="badge bg-sand-100 text-sand-600 border border-sand-200 cursor-default">
              {t}
              <button onClick={() => setTags(prev => prev.filter(x => x !== t))} className="ml-1 hover:text-blush-500 transition-colors" aria-label={`Remove ${t}`}>
                <X size={9} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
            placeholder="Type a tag and press Enter"
            className="flex-1 text-sm px-3 py-2 rounded-lg border border-sand-200 bg-white text-sand-800 placeholder:text-sand-300 focus:outline-none focus:border-calm-300 transition-all"
          />
          <button onClick={addTag} className="px-3 py-2 rounded-lg text-sm text-sand-500 hover:bg-sand-100 border border-sand-200 transition-colors">
            Add
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-sand-400">
          {!body.trim() ? 'Write something to save your entry.' : !mood ? 'Choose a mood to continue.' : 'Ready to save.'}
        </p>
        <button
          onClick={handleSave}
          disabled={!body.trim() || !mood || saved}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            saved
              ? 'bg-sage-100 text-sage-600 border border-sage-200'
              : !body.trim() || !mood
                ? 'bg-sand-100 text-sand-400 cursor-not-allowed'
                : 'bg-calm-600 text-white hover:bg-calm-700 shadow-sm'
          }`}
        >
          <Save size={14} />
          {saved ? 'Saved ✓' : 'Save entry'}
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReflectionPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => getJournalEntries());
  const [selected, setSelected] = useState<JournalEntry | null>(null);

  const saveEntry = (data: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...data,
      id: `j${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    saveJournalEntry(newEntry);
    setEntries(getJournalEntries()); // re-read from store so order is consistent
  };

  // Auto-scroll composer into view when page loads
  const composerRef = useRef<HTMLDivElement>(null);
  useEffect(() => { composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, []);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Page header */}
      <div className="bg-white border-b border-sand-200 px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sage-50 border border-sage-200 flex items-center justify-center">
              <BookOpen size={16} className="text-sage-600" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-sand-900">Reflection journal</h1>
              <p className="text-xs text-sand-400">{entries.length} entr{entries.length === 1 ? 'y' : 'ies'} · private to you</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Left col: composer + past entries */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Gentle intro */}
            <div ref={composerRef} className="card-inset px-5 py-4">
              <p className="text-sm text-sand-600 leading-relaxed">
                This is your private space. Write as much or as little as you want. There's no grade, no audience, no right answer.
              </p>
            </div>

            {/* Composer */}
            <NewEntryComposer onSave={saveEntry} />

            {/* Past entries heading */}
            {entries.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-sand-400 mb-3">Past entries</p>
                <div className="flex flex-col gap-3">
                  {entries.map(e => (
                    <EntryCard key={e.id} entry={e} onSelect={setSelected} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right col: selected entry detail / prompts list */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Selected entry */}
            {selected ? (
              <EntryDetail entry={selected} onClose={() => setSelected(null)} />
            ) : (
              <div className="card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-sand-400 mb-3">All prompts</p>
                <ul className="flex flex-col gap-2">
                  {reflectionPrompts.map((p, i) => (
                    <li key={i} className="text-xs text-sand-500 leading-relaxed pl-3 border-l-2 border-sand-200 hover:border-calm-400 hover:text-sand-700 transition-all cursor-default py-0.5">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Private note */}
            <div className="card-inset px-5 py-4 text-center">
              <p className="text-xs text-sand-400 leading-relaxed">
                Your journal is stored only on your device. Scrollin' never reads your entries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
