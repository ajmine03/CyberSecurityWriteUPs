import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Terminal, ChevronDown, Menu } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchFocus?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onToggleMobileMenu,
}) => {
  const location = useLocation();
  const isCyLab = location.pathname === '/' || location.pathname.startsWith('/cylab');

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-white/[0.08] bg-[#0b0f17]/95 backdrop-blur-md px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
      {/* Mobile Drawer Trigger & Brand */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 -ml-1 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-md transition"
            title="Open navigation menu"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-emerald-400" />
          </button>
        )}

        <Link to="/cylab" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
          <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition shrink-0">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-emerald-400 transition truncate max-w-[140px] sm:max-w-none">
              CyberSecurityWriteUps
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 leading-tight hidden sm:inline">
              Break. Learn. Document.
            </span>
          </div>
        </Link>
      </div>

      {/* Global Search Bar (Desktop) */}
      <div className="flex-1 max-w-md mx-auto hidden md:block">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search challenges, tags, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111726]/80 text-sm text-slate-200 placeholder-slate-500 pl-9 pr-16 py-1.5 rounded-lg border border-white/[0.08] focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/[0.05] border border-white/[0.08] rounded">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Navigation & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Active Tab */}
        <Link
          to="/cylab"
          className={`text-xs font-semibold px-2 py-1 sm:px-2.5 rounded transition ${
            isCyLab
              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          CyLab
        </Link>

        {/* GitHub Badge (Hidden on very small phones) */}
        <a
          href="https://github.com/ajmine03/CyberSecurityWriteUPs"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span className="hidden md:inline">ajmine03</span>
        </a>

        {/* User Profile Badge (Matching Image 1) */}
        <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/[0.08]">
          <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-inner shrink-0">
            A
          </div>
          <span className="text-xs font-medium text-slate-300 hidden sm:inline">
            ajmine03
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
        </div>
      </div>
    </header>
  );
};
