import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = React.useState(false);

  const navItem = (to, label) => (
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive ? 'text-white bg-white/10' : 'text-blue-200 hover:text-white hover:bg-white/10'
      }`}
    >
      {label}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-white font-bold tracking-tight">Sadanand Jaiswal</Link>
        <nav className="hidden md:flex items-center gap-2">
          {navItem('/', 'Home')}
          {navItem('/about', 'About')}
          {navItem('/projects', 'Projects')}
          {navItem('/contact', 'Contact')}
          {navItem('/admin', 'Admin')}
        </nav>
        <button className="md:hidden p-2 text-blue-200" onClick={() => setOpen(!open)}>
          <Menu />
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <div className="flex flex-col gap-2">
            {navItem('/', 'Home')}
            {navItem('/about', 'About')}
            {navItem('/projects', 'Projects')}
            {navItem('/contact', 'Contact')}
            {navItem('/admin', 'Admin')}
          </div>
        </div>
      )}
    </header>
  );
}
