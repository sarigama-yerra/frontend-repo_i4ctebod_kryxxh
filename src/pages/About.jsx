import React from 'react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-white mb-8">About</h1>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <img src="https://avatars.githubusercontent.com/u/000000?v=4" alt="Sadanand Jaiswal" className="w-full aspect-square object-cover rounded-2xl border border-slate-800" />
        <div className="md:col-span-2 text-blue-200 leading-relaxed">
          <p className="mb-4">Hi, I’m Sadanand — a full‑stack developer focused on building modern, performant, and accessible web applications. I love working with React, Tailwind, and cloud services.</p>
          <p>Outside of coding, I enjoy reading, exploring new tech, and contributing to open‑source.</p>
        </div>
      </div>
    </div>
  );
}
