import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { PanelRightClose, PanelRightOpen, ListFilter } from 'lucide-react';
import { Writeup, Platform } from '../types';

interface RightSidebarProps {
  platform?: Platform;
  writeups: Writeup[];
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  platform,
  writeups,
}) => {
  const { slug: currentWriteupSlug } = useParams<{ slug?: string }>();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const platformName = platform?.name || 'CyLab';
  const platformSlug = platform?.slug || 'cylab';
  const platformWriteups = writeups.filter(
    (w) => w.platform.toLowerCase() === platformName.toLowerCase()
  );

  if (isCollapsed) {
    return (
      <div className="hidden xl:flex flex-col items-center py-4 px-2 border-l border-white/[0.08] bg-[#080b11] w-12 shrink-0">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-1.5 rounded-md hover:bg-white/[0.06] text-slate-400 hover:text-emerald-400 transition"
          title="Expand Right Panel"
          aria-label="Expand Right Panel"
        >
          <PanelRightOpen className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside className="hidden xl:flex flex-col w-64 shrink-0 border-l border-white/[0.08] bg-[#080b11] p-4 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {platformName}
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-slate-400 hover:text-slate-200 transition"
          title="Collapse Panel"
          aria-label="Collapse Panel"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      {/* Counter Badge */}
      <div className="flex items-center gap-2 my-3 px-2 py-1.5 rounded-md bg-white/[0.02] border border-white/[0.05]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold text-slate-300">
          {platformWriteups.length} Challenges
        </span>
      </div>

      {/* Challenges List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {platformWriteups.map((w) => {
          const isActive = w.slug === currentWriteupSlug;
          return (
            <NavLink
              key={w.slug}
              to={`/${platformSlug}/${w.slug}`}
              className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs transition ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <span className="truncate flex-1" title={w.title}>
                {w.title}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {w.tags && w.tags.length > 0 && (
                  <span
                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30"
                    title={`Tag: ${w.tags.join(', ')}`}
                  >
                    {w.tags[0]}
                  </span>
                )}
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {w.difficulty}
                </span>
              </div>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
