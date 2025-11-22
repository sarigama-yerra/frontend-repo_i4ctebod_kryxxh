import React from 'react';

function Dot() {
  return <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]" />;
}

export default function Timeline({ items = [], type = 'default' }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-1.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-blue-400/30 to-transparent" />
      <div className="space-y-10">
        {items.map((item, idx) => (
          <div key={idx} className="relative grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="absolute -left-[7px] mt-1">
              <Dot />
            </div>
            <div className="md:col-span-3 text-blue-300 text-sm whitespace-pre-line">
              {item.range || item.year || item.date}
            </div>
            <div className="md:col-span-9 bg-slate-800/60 border border-blue-500/10 rounded-xl p-4 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                {item.stack && <div className="text-xs text-blue-300/80">{item.stack}</div>}
              </div>
              {item.subtitle && <p className="text-blue-200/90 text-sm mt-1">{item.subtitle}</p>}
              {item.description && <p className="text-blue-100/80 text-sm mt-3">{item.description}</p>}
              {type === 'project' && (
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  {item.live && (
                    <a className="px-3 py-1.5 text-sm rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white" href={item.live} target="_blank" rel="noreferrer">Live</a>
                  )}
                  {item.github && (
                    <a className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 hover:bg-slate-600 text-white" href={item.github} target="_blank" rel="noreferrer">GitHub</a>
                  )}
                </div>
              )}
              {item.image && (
                <img src={item.image} alt={item.title} className="w-full mt-4 rounded-lg border border-slate-700" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
