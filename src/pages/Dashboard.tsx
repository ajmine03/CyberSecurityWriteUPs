import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, ChevronDown } from 'lucide-react';
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
          w.content.toLowerCase().includes(query);

        const matchesCategory =
          selectedCategory === 'All Categories' ||
          w.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesDifficulty =
          selectedDifficulty === 'All Difficulties' ||
          w.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

        return matchesQuery && matchesCategory && matchesDifficulty;
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
    selectedDifficulty,
    sortOrder,
  ]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      {/* Main Content Isolated Panel (Matching Image 1) */}
      <div className="max-w-5xl mx-auto rounded-xl border border-white/[0.08] bg-[#0d111a] p-6 lg:p-8 shadow-xl shadow-black/40">
        {/* Title & Platform Archive Badge */}
        <div className="space-y-3 mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
            {platform.name} Writeups
          </h1>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Platform Archive
            </span>
          </div>

          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            {platform.description}
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
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
        <div className="overflow-x-auto rounded-lg border border-white/[0.06] bg-[#0a0d14]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Challenge</th>
                <th className="py-3 px-4 hidden sm:table-cell">Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4 hidden md:table-cell">Date</th>
                <th className="py-3 px-4 text-right"></th>
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
                    {/* Challenge Title */}
                    <td className="py-3.5 px-4 font-semibold text-sm text-slate-200 group-hover:text-emerald-400 transition">
                      {w.title}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className="text-xs text-slate-400 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
                        {w.category}
                      </span>
                    </td>

                    {/* Difficulty */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {w.difficulty}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-500 hidden md:table-cell">
                      {w.date}
                    </td>

                    {/* Action Arrow */}
                    <td className="py-3.5 px-4 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition inline-block" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-sm text-slate-500"
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
