import React from 'react';
import { auth, db, provider, isDemo } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

function Section({ title, children, action }) {
  return (
    <section className="border border-slate-800 rounded-xl p-4 bg-slate-800/40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function List({ items, onEdit, onDelete }) {
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
          <div className="flex-1">
            <div className="text-white font-medium">{it.title || it.name}</div>
            {it.subtitle && <div className="text-sm text-blue-300/80">{it.subtitle}</div>}
            {it.description && <div className="text-sm text-blue-200/80 mt-1">{it.description}</div>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(it)} className="px-2 py-1 rounded bg-white/10 text-white">Edit</button>
            <button onClick={() => onDelete(it)} className="px-2 py-1 rounded bg-red-600/80 text-white">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Admin() {
  const [user, setUser] = React.useState(null);
  const [education, setEducation] = React.useState([]);
  const [experience, setExperience] = React.useState([]);
  const [skills, setSkills] = React.useState([]);
  const [projects, setProjects] = React.useState({ frontend: [], fullstack: [], blockchain: [] });
  const [resumeUrl, setResumeUrl] = React.useState('');

  React.useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth || {}, (u) => setUser(u || null));
    return () => unsubAuth && unsubAuth();
  }, []);

  React.useEffect(() => {
    if (isDemo || !db) return; // don't attach in demo
    const unsubs = [];
    unsubs.push(onSnapshot(collection(db, 'education'), (s) => setEducation(s.docs.map(d => ({ id: d.id, ...d.data() })))));
    unsubs.push(onSnapshot(collection(db, 'experience'), (s) => setExperience(s.docs.map(d => ({ id: d.id, ...d.data() })))));
    unsubs.push(onSnapshot(collection(db, 'skills'), (s) => setSkills(s.docs.map(d => ({ id: d.id, ...d.data() })))));
    unsubs.push(onSnapshot(collection(db, 'projects_frontend'), (s) => setProjects(p => ({ ...p, frontend: s.docs.map(d => ({ id: d.id, ...d.data() })) }))));
    unsubs.push(onSnapshot(collection(db, 'projects_fullstack'), (s) => setProjects(p => ({ ...p, fullstack: s.docs.map(d => ({ id: d.id, ...d.data() })) }))));
    unsubs.push(onSnapshot(collection(db, 'projects_blockchain'), (s) => setProjects(p => ({ ...p, blockchain: s.docs.map(d => ({ id: d.id, ...d.data() })) }))));
    unsubs.push(onSnapshot(doc(db, 'meta', 'resume'), (d) => setResumeUrl(d.exists() ? d.data().url : '')));
    return () => unsubs.forEach(u => u());
  }, []);

  const guard = () => {
    if (isDemo || !auth || !db) {
      toast.info('Demo mode: no auth, data is local only');
      return true;
    }
    return false;
  };

  const handleSignIn = async () => {
    if (guard()) return;
    try {
      await signInWithPopup(auth, provider);
      toast.success('Signed in');
    } catch (e) {
      console.error(e);
      toast.error('Sign in failed');
    }
  };

  const handleSignOut = async () => {
    if (guard()) return;
    await signOut(auth);
    toast.success('Signed out');
  };

  async function addItem(col, data) {
    if (guard()) return;
    try {
      await addDoc(collection(db, col), data);
      toast.success('Added');
    } catch (e) { console.error(e); toast.error('Add failed'); }
  }
  async function updateItem(col, id, data) {
    if (guard()) return;
    try {
      await updateDoc(doc(db, col, id), data);
      toast.success('Updated');
    } catch (e) { console.error(e); toast.error('Update failed'); }
  }
  async function deleteItem(col, id) {
    if (guard()) return;
    try {
      await deleteDoc(doc(db, col, id));
      toast.success('Deleted');
    } catch (e) { console.error(e); toast.error('Delete failed'); }
  }

  async function saveResume() {
    if (guard()) return;
    try {
      await setDoc(doc(db, 'meta', 'resume'), { url: resumeUrl });
      toast.success('Resume updated');
    } catch (e) { console.error(e); toast.error('Failed to update resume'); }
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-white mb-4">Admin Login</h1>
        <p className="text-blue-200 mb-6">Sign in to manage content.</p>
        <button onClick={handleSignIn} className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white">Sign in with Google</button>
        <p className="text-blue-300/70 text-sm mt-3">Configure Firebase keys to enable real auth. You're currently in demo mode if not configured.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">Admin Panel</h1>
        <button onClick={handleSignOut} className="px-3 py-2 rounded-lg bg-white/10 text-white">Sign out</button>
      </div>

      <Section title="Resume Link" action={<button onClick={saveResume} className="px-3 py-1.5 rounded bg-blue-600 text-white">Save</button>}>
        <input value={resumeUrl} onChange={(e)=>setResumeUrl(e.target.value)} placeholder="Google Drive resume URL" className="w-full mt-2 px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-white" />
      </Section>

      <Section title="Education" action={<AddButton onAdd={(d)=>addItem('education', d)} fields={[{key:'range',ph:'2018 – 2022'},{key:'title',ph:'B.Tech – University'},{key:'subtitle',ph:'City, Country'},{key:'description',ph:'Details'}]} /> }>
        <List items={education} onEdit={(it)=>updateItem('education', it.id, promptEdit(it))} onDelete={(it)=>deleteItem('education', it.id)} />
      </Section>

      <Section title="Experience" action={<AddButton onAdd={(d)=>addItem('experience', d)} fields={[{key:'range',ph:'Jan 2023 – Present'},{key:'title',ph:'Role – Company'},{key:'subtitle',ph:'Tech stack'},{key:'description',ph:'Details'}]} /> }>
        <List items={experience} onEdit={(it)=>updateItem('experience', it.id, promptEdit(it))} onDelete={(it)=>deleteItem('experience', it.id)} />
      </Section>

      <Section title="Skills" action={<AddButton onAdd={(d)=>addItem('skills', d)} fields={[{key:'name',ph:'React'},{key:'level',ph:'Advanced'}]} /> }>
        <List items={skills.map(s=>({ ...s, title: s.name, description: s.level }))} onEdit={(it)=>updateItem('skills', it.id, promptEdit({name:it.title, level:it.description}))} onDelete={(it)=>deleteItem('skills', it.id)} />
      </Section>

      <Section title="Projects – Frontend" action={<AddButton onAdd={(d)=>addItem('projects_frontend', d)} fields={projectFields} /> }>
        <List items={projects.frontend} onEdit={(it)=>updateItem('projects_frontend', it.id, promptEdit(it))} onDelete={(it)=>deleteItem('projects_frontend', it.id)} />
      </Section>

      <Section title="Projects – Full‑stack" action={<AddButton onAdd={(d)=>addItem('projects_fullstack', d)} fields={projectFields} /> }>
        <List items={projects.fullstack} onEdit={(it)=>updateItem('projects_fullstack', it.id, promptEdit(it))} onDelete={(it)=>deleteItem('projects_fullstack', it.id)} />
      </Section>

      <Section title="Projects – Blockchain" action={<AddButton onAdd={(d)=>addItem('projects_blockchain', d)} fields={projectFields} /> }>
        <List items={projects.blockchain} onEdit={(it)=>updateItem('projects_blockchain', it.id, promptEdit(it))} onDelete={(it)=>deleteItem('projects_blockchain', it.id)} />
      </Section>
    </div>
  );
}

function AddButton({ onAdd, fields }) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({});
  const submit = async () => {
    if (!Object.keys(data).length) return;
    await onAdd(data);
    setData({});
    setOpen(false);
  };
  if (!open) return <button onClick={()=>setOpen(true)} className="px-3 py-1.5 rounded bg-white/10 text-white">Add</button>;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {fields.map(f => (
        <input key={f.key} value={data[f.key]||''} onChange={(e)=>setData(d=>({...d,[f.key]:e.target.value}))} placeholder={f.ph} className="px-3 py-1.5 rounded bg-slate-900/60 border border-slate-800 text-white" />
      ))}
      <button onClick={submit} className="px-3 py-1.5 rounded bg-blue-600 text-white">Save</button>
      <button onClick={()=>setOpen(false)} className="px-3 py-1.5 rounded bg-white/10 text-white">Cancel</button>
    </div>
  );
}

const projectFields = [
  { key: 'title', ph: 'Project title' },
  { key: 'stack', ph: 'Tech stack' },
  { key: 'description', ph: 'Short description' },
  { key: 'live', ph: 'Live URL' },
  { key: 'github', ph: 'GitHub URL' },
  { key: 'image', ph: 'Image URL' },
];

function promptEdit(obj) {
  const json = prompt('Edit JSON', JSON.stringify(obj, null, 2));
  try { return JSON.parse(json); } catch { return obj; }
}
