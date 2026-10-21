import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Folder,
  FileText,
  Layers,
  Home,
  X,
} from 'lucide-react';
import { Platform, Writeup } from '../types';

interface LeftSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  platforms: Platform[];
  writeups: Writeup[];
  activePlatformSlug: string;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  platforms,
  writeups,
  activePlatformSlug,
}) => {
  const { slug: activeWriteupSlug } = useParams<{ slug?: string }>();
  const isInsideWriteup = Boolean(activeWriteupSlug);

  const handleLinkClick = () => {
    // Automatically close drawer on mobile when navigating
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          isMobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar: Off-canvas drawer on mobile, inline collapsible on desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-[#080b11] border-r border-white/[0.08] shadow-2xl transition-all duration-300 ease-in-out flex flex-col
          md:relative md:z-auto md:shadow-none md:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-14' : 'md:w-64'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-14 md:h-12 border-b border-white/[0.06] flex items-center justify-between px-3.5">
          {/* Mobile Header Title & Close Button */}
          <div className="flex md:hidden items-center justify-between w-full">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>{isInsideWriteup ? 'Navigation' : 'Modules'}</span>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="w-8 h-8 rounded-md border border-white/[0.08] bg-white/[0.04] text-slate-400 hover:text-white flex items-center justify-center transition"
              title="Close menu"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Header with Minimize Button */}
          <div className="hidden md:flex items-center justify-between w-full">
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isInsideWriteup ? 'Navigation' : 'Modules'}</span>
                </div>
                {/* Desktop Left navigation minimize button */}
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="w-7 h-7 rounded-md border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.08] text-slate-400 hover:text-white flex items-center justify-center transition"
                  title="Minimize sidebar"
                  aria-label="Minimize sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsCollapsed(false)}
                className="w-8 h-8 mx-auto rounded-md border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.08] text-slate-400 hover:text-emerald-400 flex items-center justify-center transition"
                title="Expand sidebar"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-2 space-y-1">
          {!isInsideWriteup ? (
            /* Module List View */
            <div className="space-y-1">
              <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Modules
              </div>
              {platforms.map((plat) => {
                const isActive = plat.slug === activePlatformSlug;
                return (
                  <NavLink
                    key={plat.slug}
                    to={`/${plat.slug}`}
                    onClick={handleLinkClick}
                    title={plat.name}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isActive ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}
                    />
                    <span className="truncate flex-1 md:inline">
                      {plat.name}
                    </span>
                    {plat.count > 0 && (
                      <span className="text-[11px] font-mono text-slate-500">
                        {plat.count}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ) : (
            /* Tree Navigation View */
            <div className="space-y-1">
              {/* Home Link */}
              <NavLink
                to={`/${activePlatformSlug || 'cylab'}`}
                onClick={handleLinkClick}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition"
                title="Home"
              >
                <Home className="w-3.5 h-3.5 shrink-0" />
                <span>Home</span>
              </NavLink>

              {/* Platform Tree */}
              {platforms.map((plat) => {
                const isCurrentPlat = plat.slug === (activePlatformSlug || 'cylab');
                const platWriteups = writeups.filter(
                  (w) => w.platform.toLowerCase() === plat.name.toLowerCase()
                );

                return (
                  <div key={plat.slug} className="pt-1">
                    <NavLink
                      to={`/${plat.slug}`}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold transition ${
                        isCurrentPlat
                          ? 'text-emerald-400'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title={plat.name}
                    >
                      <Folder className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{plat.name}</span>
                    </NavLink>

                    {/* Sub-items if current platform */}
                    {isCurrentPlat && (
                      <div className="ml-3 pl-2 border-l border-white/[0.06] mt-1 space-y-0.5">
                        {platWriteups.map((w) => {
                          const isWriteupActive = w.slug === activeWriteupSlug;
                          return (
                            <NavLink
                              key={w.slug}
                              to={`/${plat.slug}/${w.slug}`}
                              onClick={handleLinkClick}
                              title={w.title}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                                isWriteupActive
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                              }`}
                            >
                              <FileText
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isWriteupActive
                                    ? 'text-emerald-400'
                                    : 'text-slate-500'
                                }`}
                              />
                              <span className="truncate">{w.title}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
