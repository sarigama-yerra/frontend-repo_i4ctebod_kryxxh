import React from 'react';

const defaults = [
  { name: 'React', level: 'Advanced' },
  { name: 'Node.js', level: 'Advanced' },
  { name: 'TypeScript', level: 'Intermediate' },
  { name: 'TailwindCSS', level: 'Advanced' },
  { name: 'Firebase', level: 'Intermediate' },
  { name: 'MongoDB', level: 'Intermediate' },
  { name: 'Solidity', level: 'Beginner' },
  { name: 'Framer Motion', level: 'Intermediate' },
];

export default function Skills({ items = defaults }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">Skills</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((s, i) => (
          <div key={i} className="group rounded-xl border border-slate-800 bg-slate-800/50 p-4 hover:border-blue-500/50 hover:bg-slate-800 transition-all">
            <div className="text-white font-medium">{s.name}</div>
            <div className="text-blue-300 text-sm opacity-80">{s.level}</div>
            <div className="mt-2 h-1.5 rounded bg-slate-700 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:scale-x-105 origin-left" style={{ width: `${s.level === 'Advanced' ? 90 : s.level === 'Intermediate' ? 70 : 40}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
