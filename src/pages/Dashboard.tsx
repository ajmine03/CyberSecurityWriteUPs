import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, ChevronDown, Tag as TagIcon, X } from 'lucide-react';
import { Platform, Writeup } from '../types';

interface DashboardProps {
  platform: Platform;
  writeups: Writeup[];
  globalSearch: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  platform,
  writeups,
  globalSearch,
}) => {
  const navigate = useNavigate();

  const [localSearch, setLocalSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Difficulties');
  const [sortOrder, setSortOrder] = useState('Newest First');

  const platformWriteups = useMemo(() => {
    return writeups.filter(
      (w) => w.platform.toLowerCase() === platform.name.toLowerCase()
    );
  }, [writeups, platform.name]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(platformWriteups.map((w) => w.category));
    return ['All Categories', ...Array.from(set)];
  }, [platformWriteups]);

  // Extract unique tags and count of tagged items
  const { allTags, taggedCount } = useMemo(() => {
    const tagSet = new Set<string>();
    let count = 0;
    platformWriteups.forEach((w) => {
      if (w.tags && w.tags.length > 0) {
        count++;
        w.tags.forEach((t) => tagSet.add(t));
      }
    });
    return {
      allTags: Array.from(tagSet),
      taggedCount: count,
    };
  }, [platformWriteups]);

  // Tag filter dropdown options
  const tagOptions = useMemo(() => {
    const options = ['All Tags'];
    if (taggedCount > 0) {
      options.push('⚡ Tagged Only');
      allTags.forEach((t) => options.push(t));
    }
    return options;
  }, [allTags, taggedCount]);

  const difficulties = ['All Difficulties', 'Easy', 'Medium', 'Hard'];
  const sortOptions = ['Newest First', 'Oldest First', 'Title A-Z'];

  // Filtered and sorted writeups
  const filteredWriteups = useMemo(() => {
    const query = (localSearch || globalSearch).toLowerCase().trim();

    return platformWriteups
      .filter((w) => {
        const matchesQuery =
          !query ||
          w.title.toLowerCase().includes(query) ||
          w.category.toLowerCase().includes(query) ||
          w.description.toLowerCase().includes(query) ||
          w.content.toLowerCase().includes(query) ||
          Boolean(w.tags && w.tags.some((t) => t.toLowerCase().includes(query)));

        const matchesCategory =
          selectedCategory === 'All Categories' ||
          w.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesTag =
          selectedTag === 'All Tags' ||
          (selectedTag === '⚡ Tagged Only'
            ? Boolean(w.tags && w.tags.length > 0)
            : Boolean(w.tags && w.tags.includes(selectedTag)));

        const matchesDifficulty =
          selectedDifficulty === 'All Difficulties' ||
          w.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

        return matchesQuery && matchesCategory && matchesTag && matchesDifficulty;
      })
      .sort((a, b) => {
        if (sortOrder === 'Newest First') {
          return b.date.localeCompare(a.date);
        } else if (sortOrder === 'Oldest First') {
          return a.date.localeCompare(b.date);
        } else if (sortOrder === 'Title A-Z') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [
    platformWriteups,
    localSearch,
    globalSearch,
    selectedCategory,
    selectedTag,
    selectedDifficulty,
    sortOrder,
  ]);

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8 w-full min-w-0">
      {/* Main Content Isolated Panel (Matching Image 1) */}
      <div className="max-w-5xl mx-auto rounded-xl border border-white/[0.08] bg-[#0d111a] p-3.5 sm:p-6 lg:p-8 shadow-xl shadow-black/40">
        {/* Title & Platform Archive Badge */}
        <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
            {platform.name} Writeups
          </h1>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Platform Archive
            </span>

            {/* Quick 1-click toggle to show only tagged assignments if any exist */}
            {taggedCount > 0 && (
              <button
                onClick={() =>
                  setSelectedTag(selectedTag === '⚡ Tagged Only' ? 'All Tags' : '⚡ Tagged Only')
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition ${
                  selectedTag === '⚡ Tagged Only'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 ring-1 ring-amber-400/30'
                    : 'bg-amber-400/10 text-amber-300/80 hover:text-amber-300 border border-amber-400/25 hover:border-amber-400/40'
                }`}
                title="Click to toggle only tagged challenges (e.g. current assignment)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Tagged Only ({taggedCount})
              </button>
            )}

            {/* Active Tag pill if a specific tag is selected */}
            {selectedTag !== 'All Tags' && selectedTag !== '⚡ Tagged Only' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                <TagIcon className="w-3 h-3" />
                <span>{selectedTag}</span>
                <button
                  onClick={() => setSelectedTag('All Tags')}
                  className="hover:text-white ml-0.5"
                  title="Clear tag filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            {platform.description}
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-4 sm:mb-6">
          {/* Search challenges input */}
          <div className="relative flex items-center lg:col-span-1">
            <Search className="absolute left-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-[#111726] text-xs text-slate-200 placeholder-slate-500 pl-9 pr-3 py-2 rounded-lg border border-white/[0.08] focus:outline-none focus:border-emerald-500/50 transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-[#111726] text-xs text-slate-200 px-3 py-2 pr-8 rounded-lg border border-white/[0.08] focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Tag Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className={`w-full appearance-none bg-[#111726] text-xs px-3 py-2 pr-8 rounded-lg border transition cursor-pointer ${
                selectedTag !== 'All Tags'
                  ? 'border-amber-400/50 text-amber-300 font-medium focus:border-amber-400'
                  : 'border-white/[0.08] text-slate-200 focus:border-emerald-500/50'
              } focus:outline-none`}
            >
              {tagOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Difficulty Dropdown */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full appearance-none bg-[#111726] text-xs text-slate-200 px-3 py-2 pr-8 rounded-lg border border-white/[0.08] focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>

          {/* Sort Order Dropdown */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full appearance-none bg-[#111726] text-xs text-slate-200 px-3 py-2 pr-8 rounded-lg border border-white/[0.08] focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              {sortOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Challenges Table */}
        <div className="overflow-x-auto rounded-lg border border-white/[0.06] bg-[#0a0d14] -mx-0.5 sm:mx-0">
          <table className="w-full text-left border-collapse min-w-[320px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 sm:py-3 px-3 sm:px-4">Challenge</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4 hidden sm:table-cell">Category</th>
                <th className="py-2.5 sm:py-3 px-2 sm:px-4">Difficulty</th>
                <th className="py-2.5 sm:py-3 px-3 sm:px-4 hidden md:table-cell">Date</th>
                <th className="py-2.5 sm:py-3 px-2 sm:px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredWriteups.length > 0 ? (
                filteredWriteups.map((w) => (
                  <tr
                    key={w.slug}
                    onClick={() => navigate(`/${platform.slug}/${w.slug}`)}
                    className="group hover:bg-white/[0.03] cursor-pointer transition"
                  >
                    {/* Challenge Title + Optional Tag Highlight Badge */}
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 font-semibold text-xs sm:text-sm text-slate-200 group-hover:text-emerald-400 transition">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="leading-snug">{w.title}</span>
                        {w.tags &&
                          w.tags.map((tag) => (
                            <span
                              key={tag}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTag(tag);
                              }}
                              title={`Click to filter by tag: ${tag}`}
                              className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/35 hover:bg-amber-400/25 transition shadow-sm shadow-amber-500/10 shrink-0 cursor-pointer"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              {tag}
                            </span>
                          ))}
                      </div>
                    </td>

                    {/* Category (Hidden on small mobile) */}
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 hidden sm:table-cell">
                      <span className="text-xs text-slate-400 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
                        {w.category}
                      </span>
                    </td>

                    {/* Difficulty */}
                    <td className="py-2.5 sm:py-3.5 px-2 sm:px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {w.difficulty}
                      </span>
                    </td>

                    {/* Date (Hidden on mobile) */}
                    <td className="py-2.5 sm:py-3.5 px-3 sm:px-4 text-xs font-mono text-slate-500 hidden md:table-cell whitespace-nowrap">
                      {w.date}
                    </td>

                    {/* Action Arrow */}
                    <td className="py-2.5 sm:py-3.5 px-2 sm:px-4 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition inline-block" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-xs sm:text-sm text-slate-500"
                  >
                    No challenges found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
