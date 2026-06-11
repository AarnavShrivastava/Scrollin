import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, Save, BookOpen, Tag, X } from 'lucide-react';
import { reflectionPrompts, moodLabels, type JournalEntry, type MoodLevel } from '../data/mockWellbeing';
import { getJournalEntries, saveJournalEntry } from '../store/userStore';

const MOOD_OPTIONS: { level: MoodLevel; emoji: string; label: string }[] = [
  { level:1, emoji:'😔', label:'Really low'  },
  { level:2, emoji:'😕', label:'Not great'   },
  { level:3, emoji:'😐', label:'Okay'        },
  { level:4, emoji:'🙂', label:'Pretty good' },
  { level:5, emoji:'😊', label:'Great'       },
];

const SEL  = 'bg-powder-200 border-powder-400 ring-1 ring-powder-300';
const IDLE = 'bg-cream-100 border-powder-200 hover:border-powder-300';

function MoodPicker({ value, onChange }: { value: MoodLevel | null; onChange: (m: MoodLevel) => void }) {
  return (
    <div>
      <p className="text-xs font-extrabold text-choco-700 mb-2">How are you feeling right now?</p>
      <div className="flex gap-2">
        {MOOD_OPTIONS.map(m => (
          <button key={m.level} onClick={() => onChange(m.level)} title={m.label}
            className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-2xl border-2 text-sm transition-all ${value === m.level ? SEL : IDLE}`}>
            <span className="text-xl leading-none">{m.emoji}</span>
            <span className="text-[10px] text-steel-500 font-bold">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Entry card ───────────────────────────────────────────────────────────────
function EntryCard({ entry, onSelect }: { entry: JournalEntry; onSelect: (e: JournalEntry) => void }) {
  const moodEmoji = MOOD_OPTIONS.find(m => m.level === entry.mood)?.emoji ?? '😐';
  const preview   = entry.body.slice(0, 120) + (entry.body.length > 120 ? '…' : '');

  return (
    <button onClick={() => onSelect(entry)} className="card card-hover w-full text-left p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-steel-400 mb-1 font-bold">
            {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-xs text-steel-500 italic line-clamp-1 font-semibold">"{entry.prompt}"</p>
        </div>
        <span className="text-2xl flex-shrink-0">{moodEmoji}</span>
      </div>
      <p className="text-sm text-choco-700 leading-relaxed font-semibold font-serif">{preview}</p>
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {entry.tags.map(t => (
          <span key={t} className="text-[10px] font-extrabold bg-powder-100 text-steel-500 px-2.5 py-1 rounded-full border border-powder-300">{t}</span>
        ))}
      </div>
    </button>
  );
}

// ─── Entry detail ─────────────────────────────────────────────────────────────
function EntryDetail({ entry, onClose }: { entry: JournalEntry; onClose: () => void }) {
  const moodEmoji = MOOD_OPTIONS.find(m => m.level === entry.mood)?.emoji ?? '😐';

  return (
    <div className="card p-6 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-steel-400 mb-1 font-bold">
            {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="text-xs text-steel-500 italic font-semibold">"{entry.prompt}"</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{moodEmoji}</span>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-powder-100 text-steel-400 transition-colors" aria-label="Close"><X size={16} /></button>
        </div>
      </div>

      {/* Notebook-lined text */}
      <div className="bg-notebook rounded-2xl p-4 border-2 border-powder-200">
        <p className="text-choco-800 text-sm leading-relaxed whitespace-pre-wrap font-serif">{entry.body}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {entry.tags.map(t => (
          <span key={t} className="badge bg-powder-100 text-steel-600 border border-powder-300"><Tag size={9} /> {t}</span>
        ))}
      </div>

      <div className="pt-2 border-t border-powder-200">
        <p className="text-xs text-steel-400 italic font-semibold">
          🌸 "Every time you reflect, you're choosing to understand yourself a little better."
        </p>
      </div>
    </div>
  );
}

// ─── Composer ─────────────────────────────────────────────────────────────────
function NewEntryComposer({ onSave }: { onSave: (entry: Omit<JournalEntry, 'id' | 'date'>) => void }) {
  const [promptIdx, setPromptIdx] = useState(0);
  const [body, setBody]           = useState('');
  const [mood, setMood]           = useState<MoodLevel | null>(null);
  const [tags, setTags]           = useState<string[]>([]);
  const [tagInput, setTagInput]   = useState('');
  const [saved, setSaved]         = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const prompt    = reflectionPrompts[promptIdx];
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  const nextPrompt    = () => setPromptIdx(i => (i + 1) % reflectionPrompts.length);
  const shufflePrompt = () => {
    let next = Math.floor(Math.random() * reflectionPrompts.length);
    if (next === promptIdx) next = (next + 1) % reflectionPrompts.length;
    setPromptIdx(next); setBody(''); setSaved(false); textRef.current?.focus();
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
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
          <p className="text-xs font-extrabold uppercase tracking-widest text-steel-400">Today's prompt</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPromptIdx(i => Math.max(0, i - 1))} disabled={promptIdx === 0}
              className="p-1.5 rounded-xl hover:bg-powder-100 text-steel-400 disabled:opacity-30 transition-colors" aria-label="Previous">
              <ChevronLeft size={14} />
            </button>
            <button onClick={shufflePrompt} className="p-1.5 rounded-xl hover:bg-powder-100 text-steel-400 transition-colors" aria-label="Shuffle">
              <Shuffle size={14} />
            </button>
            <button onClick={nextPrompt} className="p-1.5 rounded-xl hover:bg-powder-100 text-steel-400 transition-colors" aria-label="Next">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
        {/* Prompt in powder-blue pill — like the "Judge Introductions" button */}
        <div className="bg-powder-200 border-2 border-powder-300 rounded-2xl px-4 py-3">
          <p className="text-choco-700 text-sm italic leading-relaxed font-serif">"{prompt}"</p>
        </div>
      </div>

      {/* Textarea with notebook lines */}
      <div>
        <textarea
          ref={textRef} value={body} onChange={e => setBody(e.target.value)}
          placeholder="Write whatever comes to mind. There's no right answer here."
          className="w-full h-44 resize-none rounded-2xl border-2 border-powder-200 bg-cream-100 text-choco-800 text-sm leading-[1.75rem] px-4 py-3 placeholder:text-steel-300 focus:outline-none focus:border-powder-400 focus:ring-1 focus:ring-powder-200 transition-all font-serif"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #CCDDE8 27px, #CCDDE8 28px)',
            backgroundSize: '100% 28px',
          }}
        />
        <p className="text-[10px] text-steel-300 text-right mt-1 font-extrabold">{wordCount} word{wordCount !== 1 ? 's' : ''}</p>
      </div>

      <MoodPicker value={mood} onChange={setMood} />

      {/* Tags */}
      <div>
        <p className="text-xs font-extrabold text-choco-700 mb-2">Tags (optional)</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map(t => (
            <span key={t} className="badge bg-powder-100 text-steel-600 border border-powder-300 cursor-default">
              {t}
              <button onClick={() => setTags(prev => prev.filter(x => x !== t))} className="ml-1 hover:text-choco-500 transition-colors" aria-label={`Remove ${t}`}><X size={9} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={tagInput} onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
            placeholder="Type a tag and press Enter"
            className="flex-1 text-sm px-3 py-2 rounded-xl border-2 border-powder-200 bg-cream-100 text-choco-800 placeholder:text-steel-300 focus:outline-none focus:border-powder-400 transition-all font-semibold"
          />
          <button onClick={addTag} className="px-3 py-2 rounded-xl text-sm font-extrabold text-steel-600 hover:bg-powder-100 border-2 border-powder-200 transition-colors">Add</button>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-steel-400 font-bold">
          {!body.trim() ? 'Write something to save your entry.' : !mood ? 'Choose a mood to continue.' : '🌸 Ready to save.'}
        </p>
        <button onClick={handleSave} disabled={!body.trim() || !mood || saved}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-extrabold transition-all ${
            saved ? 'bg-sage-100 text-sage-700 border border-sage-200' :
            !body.trim() || !mood ? 'bg-powder-100 text-steel-300 cursor-not-allowed border-2 border-powder-200' :
            'bg-powder-600 text-white hover:bg-powder-700 shadow-soft'
          }`}>
          <Save size={14} />
          {saved ? 'Saved ✓' : 'Save entry'}
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReflectionPage() {
  const [entries, setEntries]   = useState<JournalEntry[]>(() => getJournalEntries());
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const composerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, []);

  const saveEntry = (data: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = { ...data, id: `j${Date.now()}`, date: new Date().toISOString().split('T')[0] };
    saveJournalEntry(newEntry);
    setEntries(getJournalEntries());
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <div className="bg-white border-b-2 border-powder-200 px-6 py-5 shadow-soft">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-powder-200 border-2 border-powder-300 flex items-center justify-center">
              <BookOpen size={17} className="text-powder-700" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-choco-800">Reflection journal 📖</h1>
              <p className="text-xs text-steel-400 font-bold">{entries.length} entr{entries.length === 1 ? 'y' : 'ies'} · private to you</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Left */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <div ref={composerRef} className="card-inset px-5 py-4">
              <p className="text-sm text-steel-600 leading-relaxed font-semibold">
                🌸 This is your private space. Write as much or as little as you want. There's no grade, no audience, no right answer.
              </p>
            </div>
            <NewEntryComposer onSave={saveEntry} />
            {entries.length > 0 && (
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-steel-400 mb-3">Past entries</p>
                <div className="flex flex-col gap-3">
                  {entries.map(e => <EntryCard key={e.id} entry={e} onSelect={setSelected} />)}
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {selected ? (
              <EntryDetail entry={selected} onClose={() => setSelected(null)} />
            ) : (
              <div className="card p-5">
                <p className="text-xs font-extrabold uppercase tracking-widest text-steel-400 mb-3">All prompts ✨</p>
                <ul className="flex flex-col gap-2">
                  {reflectionPrompts.map((p, i) => (
                    <li key={i} className="text-xs text-steel-500 leading-relaxed pl-3 border-l-2 border-powder-200 hover:border-powder-500 hover:text-choco-700 transition-all cursor-default py-0.5 font-semibold">{p}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="card-inset px-5 py-4 text-center">
              <p className="text-xs text-steel-400 leading-relaxed font-bold">
                🌿 Your journal is stored only on your device. Scrollin' never reads your entries.
              </p>
            </div>

            {/* Quote card — powder blue pill style */}
            <div className="card-powder p-5 rounded-3xl text-center">
              <p className="text-sm text-choco-700 leading-relaxed font-serif italic">
                "The most important relationship you'll ever have is the one you have with yourself."
              </p>
              <p className="text-[10px] text-steel-500 mt-2 font-extrabold">Scrollin' Journal Corner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
