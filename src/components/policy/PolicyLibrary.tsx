import { useState, useEffect } from 'react';
import { Book, Tag, ChevronDown, ChevronUp, Search, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function PolicyLibrary() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/policies')
      .then(res => res.json())
      .then(data => setPolicies(data));
  }, []);

  const filtered = policies.filter(p => 
    p.title.includes(search) || p.content.includes(search)
  );

  return (
    <div className="p-12 max-w-5xl mx-auto space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-900 pb-12">
        <div className="space-y-4">
          <h2 className="text-6xl font-serif italic text-slate-900 leading-none tracking-tighter">政策规章<br />档案库</h2>
          <p className="text-slate-500 font-medium text-sm max-w-sm leading-relaxed">
            审计引擎的底层逻辑支撑。包含国家标准、部委规章及地方细则。
          </p>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">条款总数</p>
           <p className="text-3xl font-mono tracking-tighter font-medium">{policies.length * 12 + 4}</p>
        </div>
      </div>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="检索政策标题或条款关键字..."
          className="w-full bg-white border border-slate-200 p-6 pl-14 focus:outline-none focus:border-slate-900 font-serif italic text-lg shadow-sm transition-all"
        />
      </div>

      <div className="space-y-6">
        {filtered.map((policy) => (
          <div key={policy.id} className="bg-white border border-slate-100 hover:border-slate-900 transition-all group overflow-hidden shadow-sm">
            <button 
              onClick={() => setExpandedId(expandedId === policy.id ? null : policy.id)}
              className="w-full p-8 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-8">
                <div className="w-14 h-14 bg-slate-50 rounded flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <Book className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-slate-900 leading-tight mb-2 italic">{policy.title}</h3>
                  <div className="flex gap-2">
                    {policy.tags.map((tag: string) => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400 border border-slate-200 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {expandedId === policy.id ? <ChevronUp className="w-4 h-4 text-slate-900" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
            </button>

            <AnimatePresence>
              {expandedId === policy.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-slate-100"
                >
                  <div className="p-10 bg-slate-50/50 space-y-8">
                    <div className="prose prose-slate max-w-none">
                      <p className="text-lg leading-relaxed font-serif text-slate-700 italic border-l-4 border-slate-200 pl-8">
                        {policy.content}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                       <span className="text-[10px] font-mono text-slate-300 uppercase tracking-tighter">生效日期: 2024-01-01</span>
                       <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 hover:opacity-60 transition-opacity">
                         查看原始文档 <ExternalLink className="w-3 h-3" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
