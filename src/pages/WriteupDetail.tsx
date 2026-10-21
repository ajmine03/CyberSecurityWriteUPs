import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Clock,
  Tag,
} from 'lucide-react';
import { Writeup, Platform } from '../types';

interface WriteupDetailProps {
  writeups: Writeup[];
  platforms: Platform[];
}

export const WriteupDetail: React.FC<WriteupDetailProps> = ({
  writeups,
}) => {
  const { platform: platformSlug, slug: writeupSlug } = useParams<{
    platform: string;
    slug: string;
  }>();
  const navigate = useNavigate();

  const writeup = useMemo(() => {
    return writeups.find(
      (w) =>
        w.slug.toLowerCase() === writeupSlug?.toLowerCase() ||
        w.id === writeupSlug
    );
  }, [writeups, writeupSlug]);

  // Preprocess markdown: handle MkDocs admonitions (!!! tip "Note ...") and image paths
  const processedContent = useMemo(() => {
    if (!writeup) return '';

    let content = writeup.content;

    // Remove top H1 title if it matches writeup.title
    content = content.replace(/^#\s+[^\n]+\n+/, '');

    // Remove legacy raw html meta badges div if present
    content = content.replace(/<div class="article-meta-badges">[\s\S]*?<\/div>/g, '');

    // Transform MkDocs admonitions into HTML callout boxes
    content = content.replace(
      /!!!\s+(\w+)\s+"([^"]+)"\n((?:\s{4}[^\n]*\n*)+)/g,
      (_, type, title, body) => {
        const cleanedBody = body
          .split('\n')
          .map((line: string) => line.replace(/^\s{4}/, ''))
          .join('\n')
          .trim();
        return `\n<div class="admonition-callout admonition-${type}">
  <div class="admonition-header">
    <span class="admonition-icon">🔥</span>
    <span class="admonition-title">${title}</span>
  </div>
  <div class="admonition-body">${cleanedBody}</div>
</div>\n`;
      }
    );

    return content;
  }, [writeup]);

  if (!writeup) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-bold text-white mb-2">Writeup Not Found</h2>
        <p className="text-sm text-slate-400 mb-4">
          The requested writeup could not be located.
        </p>
        <Link
          to={`/${platformSlug || 'cylab'}`}
          className="text-xs font-semibold px-3 py-1.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
        >
          ← Return to Challenges
        </Link>
      </div>
    );
  }

  const baseAssetUrl = import.meta.env.BASE_URL || '/';

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      {/* 3. Main content enclosed in a dedicated separate panel card */}
      <article className="max-w-4xl mx-auto rounded-xl border border-white/[0.08] bg-[#0d111a] p-6 lg:p-10 shadow-xl shadow-black/40">
        {/* 1. Heading-এর উপরে Back to CyLab button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(`/${platformSlug || 'cylab'}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition group py-1 px-2.5 rounded-md bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/40"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to {writeup.platform}</span>
          </button>
        </div>

        {/* Title */}
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-4">
          {writeup.title}
        </h1>

        {/* Metadata Badges Row matching Image 2 */}
        <div className="flex flex-wrap items-center gap-2 pb-5 mb-6 border-b border-white/[0.08]">
          {/* Platform */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Layers className="w-3.5 h-3.5" />
            {writeup.platform}
          </span>

          {/* Category */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Tag className="w-3.5 h-3.5" />
            {writeup.category}
          </span>

          {/* Difficulty */}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]">
            <Clock className="w-3.5 h-3.5" />
            {writeup.difficulty}
          </span>

          {/* Date */}
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 px-2.5 py-1 rounded bg-white/[0.02] border border-white/[0.06]">
            <Calendar className="w-3.5 h-3.5" />
            {writeup.date}
          </span>
        </div>

        {/* Markdown Content Area */}
        <div className="writeup-prose text-slate-300 leading-relaxed space-y-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-2xl font-bold text-white mt-8 mb-4 pb-2 border-b border-white/[0.08]" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-xl font-bold text-white mt-6 mb-3 pb-1 border-b border-white/[0.05]" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-lg font-semibold text-slate-100 mt-5 mb-2" {...props} />
              ),
              p: ({ ...props }) => <p className="leading-7 my-3 text-slate-300 text-sm lg:text-base" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc list-inside space-y-1 my-3 text-slate-300 text-sm lg:text-base" {...props} />,
              ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-1.5 my-3 text-slate-300 text-sm lg:text-base" {...props} />,
              li: ({ ...props }) => <li className="text-slate-300" {...props} />,
              a: ({ ...props }) => (
                <a className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition" {...props} />
              ),
              img: ({ src, alt, ...props }) => {
                let cleanSrc = src || '';
                // Resolve assets path relative to app base
                if (cleanSrc.startsWith('assets/')) {
                  cleanSrc = `${baseAssetUrl}${cleanSrc}`;
                } else if (cleanSrc.startsWith('../assets/')) {
                  cleanSrc = `${baseAssetUrl}${cleanSrc.replace(/^\.\.\//, '')}`;
                }
                return (
                  <div className="my-6 rounded-lg overflow-hidden border border-white/[0.1] bg-black/40 p-2 flex justify-center">
                    <img
                      src={cleanSrc}
                      alt={alt || 'Writeup asset'}
                      className="max-h-[520px] max-w-full rounded object-contain"
                      loading="lazy"
                      {...props}
                    />
                  </div>
                );
              },
              code: ({ className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <code className="text-red-400 bg-white/[0.06] px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </div>
      </article>

      {/* Embedded CSS for Callout / Admonition Box */}
      <style>{`
        .admonition-callout {
          margin: 1.5rem 0;
          padding: 1rem 1.25rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(45, 212, 191, 0.35);
          background-color: rgba(13, 27, 34, 0.85);
        }
        .admonition-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          font-weight: 700;
          color: #2dd4bf;
          margin-bottom: 0.5rem;
        }
        .admonition-body {
          font-size: 0.88rem;
          line-height: 1.6;
          color: #cbd5e1;
        }
      `}</style>
    </div>
  );
};
