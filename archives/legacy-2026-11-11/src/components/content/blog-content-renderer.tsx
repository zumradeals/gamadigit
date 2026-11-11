import Link from 'next/link';
import { ArrowRight, Lightbulb } from 'lucide-react';
import type { BlogContentItem } from '@/types/content';

export function BlogContentRenderer({ content }: { content: BlogContentItem[] }) {
  return (
    <div className="space-y-7">
      {content.map((item, index) => {
        if (typeof item === 'string') {
          return <p key={index} className="text-lg leading-9 text-slate-700">{item}</p>;
        }

        if (item.type === 'heading') {
          const className = item.level === 3
            ? 'pt-3 text-2xl font-black tracking-tight text-ink'
            : 'pt-6 text-3xl font-black tracking-tight text-ink';
          return item.level === 3
            ? <h3 key={index} className={className}>{item.text}</h3>
            : <h2 key={index} className={className}>{item.text}</h2>;
        }

        if (item.type === 'paragraph') {
          return <p key={index} className="text-lg leading-9 text-slate-700">{item.text}</p>;
        }

        if (item.type === 'list') {
          return (
            <ul key={index} className="space-y-3 rounded-2xl bg-slate-50 p-6 text-base leading-8 text-slate-700">
              {item.items.map((listItem) => (
                <li key={listItem} className="flex items-start gap-3">
                  <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-ocean" />
                  <span>{listItem}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (item.type === 'callout') {
          return (
            <aside key={index} className="flex items-start gap-4 rounded-2xl border border-cyan/20 bg-blue-50 p-6 text-slate-700">
              <Lightbulb className="mt-1 h-6 w-6 shrink-0 text-ocean" />
              <p className="leading-8">{item.text}</p>
            </aside>
          );
        }

        if (item.type === 'cta') {
          const isExternal = /^https?:\/\//.test(item.href);
          const className = 'inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3.5 font-black text-white transition hover:-translate-y-0.5';
          return isExternal ? (
            <a key={index} href={item.href} target="_blank" rel="noreferrer" className={className}>
              {item.label}<ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <Link key={index} href={item.href} className={className}>
              {item.label}<ArrowRight className="h-4 w-4" />
            </Link>
          );
        }

        return null;
      })}
    </div>
  );
}
