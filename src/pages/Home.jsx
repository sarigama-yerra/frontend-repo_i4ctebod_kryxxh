import React from 'react';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db, isDemo } from '../firebase';
import Hero from '../components/Hero';
import Timeline from '../components/Timeline';
import Skills from '../components/Skills';

export default function Home() {
  const [education, setEducation] = React.useState([]);
  const [experience, setExperience] = React.useState([]);
  const [projects, setProjects] = React.useState({ frontend: [], fullstack: [], blockchain: [] });
  const [resumeUrl, setResumeUrl] = React.useState('#');

  React.useEffect(() => {
    if (isDemo || !db) {
      setEducation([
        { range: '2018 – 2022', title: 'B.Tech in Computer Science', subtitle: 'ABC University', description: 'CGPA: 8.9/10' },
      ]);
      setExperience([
        { range: 'Jan 2023 – Present', title: 'Frontend Engineer', subtitle: 'Tech Corp', stack: 'React, Tailwind, Vite', description: 'Building delightful web interfaces.' },
      ]);
      setProjects({
        frontend: [
          { title: 'UI Kit', stack: 'React, Tailwind', description: 'Reusable components library.', live: '#', github: '#', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop' },
        ],
        fullstack: [
          { title: 'SaaS Dashboard', stack: 'React, Node, Mongo', description: 'Admin analytics with auth.', live: '#', github: '#', image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop' },
        ],
        blockchain: [
          { title: 'NFT Mint DApp', stack: 'Next.js, Solidity', description: 'Mint and view NFTs.', live: '#', github: '#', image: 'https://images.unsplash.com/photo-1651760464181-49092525ca3b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxTYWFTJTIwRGFzaGJvYXJkfGVufDB8MHx8fDE3NjM4MDUzODd8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' },
        ],
      });
      setResumeUrl('#');
      return;
    }

    const unsub = [];

    unsub.push(onSnapshot(collection(db, 'education'), (snap) => {
      setEducation(snap.docs.map(d => ({ id: d.id, ...d.data() }))); 
    }));
    unsub.push(onSnapshot(collection(db, 'experience'), (snap) => {
      setExperience(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }));
    unsub.push(onSnapshot(collection(db, 'projects_frontend'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(prev => ({ ...prev, frontend: data }));
    }));
    unsub.push(onSnapshot(collection(db, 'projects_fullstack'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(prev => ({ ...prev, fullstack: data }));
    }));
    unsub.push(onSnapshot(collection(db, 'projects_blockchain'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(prev => ({ ...prev, blockchain: data }));
    }));
    unsub.push(onSnapshot(doc(db, 'meta', 'resume'), (d) => {
      if (d.exists()) setResumeUrl(d.data().url || '#');
    }));

    return () => unsub.forEach(u => u());
  }, []);

  return (
    <div>
      <Hero resumeUrl={resumeUrl} />

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">About</h2>
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <img src="https://avatars.githubusercontent.com/u/000000?v=4" alt="Sadanand Jaiswal" className="w-full aspect-square object-cover rounded-2xl border border-slate-800" />
          <div className="md:col-span-2 text-blue-200 leading-relaxed">
            Passionate full‑stack developer with a focus on clean architecture, performance, and delightful UI. I enjoy solving complex problems and bringing ideas to life.
          </div>
        </div>
      </section>

      <Skills />

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Education</h2>
        <Timeline items={education} />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Experience</h2>
        <Timeline items={experience} />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">Projects — Frontend</h2>
        <Timeline items={projects.frontend} type="project" />
        <h2 className="text-2xl md:text-3xl font-semibold text-white mt-12 mb-4">Projects — Full‑stack</h2>
        <Timeline items={projects.fullstack} type="project" />
        <h2 className="text-2xl md:text-3xl font-semibold text-white mt-12 mb-4">Blockchain</h2>
        <Timeline items={projects.blockchain} type="project" />
      </section>
    </div>
  );
}
