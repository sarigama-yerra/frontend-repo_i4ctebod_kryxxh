import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero({ resumeUrl = '#' }) {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/90 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            Sadanand Jaiswal
          </h1>
          <p className="mt-4 text-blue-200 text-lg">
            Full‑stack developer crafting performant web apps with modern tech. I love clean UIs, smooth UX, and shipping quality.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white">
              View Resume
            </a>
            <a href="/contact" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white">
              Contact Me
            </a>
          </div>
        </div>
        <div className="hidden md:block" />
      </div>
    </section>
  );
}
