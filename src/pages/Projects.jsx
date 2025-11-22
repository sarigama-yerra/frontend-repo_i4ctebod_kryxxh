import React from 'react';
import Timeline from '../components/Timeline';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, isDemo } from '../firebase';

export default function Projects() {
  const [projects, setProjects] = React.useState({ frontend: [], fullstack: [], blockchain: [] });

  React.useEffect(() => {
    if (isDemo || !db) {
      setProjects({
        frontend: [{ title: 'UI Kit', stack: 'React, Tailwind', description: 'Reusable components library.', live: '#', github: '#', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop' }],
        fullstack: [{ title: 'SaaS Dashboard', stack: 'React, Node, Mongo', description: 'Admin analytics with auth.', live: '#', github: '#', image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop' }],
        blockchain: [{ title: 'NFT Mint DApp', stack: 'Next.js, Solidity', description: 'Mint and view NFTs.', live: '#', github: '#', image: 'https://images.unsplash.com/photo-1651760464181-49092525ca3b?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxTYWFTJTIwRGFzaGJvYXJkfGVufDB8MHx8fDE3NjM4MDUzODd8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80' }]
      });
      return;
    }
    const unsub = [];
    unsub.push(onSnapshot(collection(db, 'projects_frontend'), (snap) => setProjects(p => ({ ...p, frontend: snap.docs.map(d => ({ id: d.id, ...d.data() })) }))));
    unsub.push(onSnapshot(collection(db, 'projects_fullstack'), (snap) => setProjects(p => ({ ...p, fullstack: snap.docs.map(d => ({ id: d.id, ...d.data() })) }))));
    unsub.push(onSnapshot(collection(db, 'projects_blockchain'), (snap) => setProjects(p => ({ ...p, blockchain: snap.docs.map(d => ({ id: d.id, ...d.data() })) }))));
    return () => unsub.forEach(u => u());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-white mb-8">Projects</h1>
      <h2 className="text-xl text-white mb-4">Frontend</h2>
      <Timeline items={projects.frontend} type="project" />
      <h2 className="text-xl text-white mt-12 mb-4">Full‑stack</h2>
      <Timeline items={projects.fullstack} type="project" />
      <h2 className="text-xl text-white mt-12 mb-4">Blockchain</h2>
      <Timeline items={projects.blockchain} type="project" />
    </div>
  );
}
