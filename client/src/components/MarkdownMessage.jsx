import React, { useState } from 'react';
import { Copy, Check, Lightbulb } from 'lucide-react';
import { parseBlocks, parseInline } from '../utils/markdown';

const Inline = ({ text }) => (
  <>
    {parseInline(text).map((tok, i) => {
      switch (tok.t) {
        case 'bold':
          return <strong key={i} className="font-bold text-[#1E1B4B]">{tok.v}</strong>;
        case 'italic':
          return <em key={i} className="italic">{tok.v}</em>;
        case 'code':
          return <code key={i} className="px-1.5 py-0.5 rounded-md bg-[#EDE9FE] text-[#6D28D9] text-[11px] font-mono">{tok.v}</code>;
        case 'link':
          return <a key={i} href={tok.href} target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] font-semibold underline underline-offset-2 hover:text-[#6D28D9]">{tok.v}</a>;
        default:
          return <React.Fragment key={i}>{tok.v}</React.Fragment>;
      }
    })}
  </>
);

const CodeBlock = ({ text, lang }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <div className="rounded-xl overflow-hidden border border-[#DDD6FE] bg-white shadow-sm">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#F5F3FF] border-b border-[#DDD6FE]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED]">{lang || 'Ready to copy'}</span>
        <button onClick={copy} className="flex items-center gap-1 text-[11px] font-semibold text-[#7C3AED] hover:text-[#6D28D9] cursor-pointer">
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-3.5 text-[12px] leading-relaxed text-[#1E1B4B] whitespace-pre-wrap font-sans">{text}</pre>
    </div>
  );
};

const Block = ({ block, isFirst }) => {
  switch (block.type) {
    case 'heading':
      return block.level <= 2 ? (
        <h4 className="flex items-center gap-2 pt-1 text-[13px] font-extrabold text-[#1E1B4B]">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#7C3AED] to-[#A78BFA]" />
          <Inline text={block.text} />
        </h4>
      ) : (
        <h5 className="text-xs font-bold text-[#6D28D9] uppercase tracking-wide"><Inline text={block.text} /></h5>
      );

    case 'paragraph':
      return (
        <p className={isFirst ? 'text-[13px] font-medium text-[#1E1B4B] leading-relaxed' : 'text-xs text-[#334155] leading-relaxed'}>
          <Inline text={block.text} />
        </p>
      );

    case 'list': {
      let n = 0;
      return (
        <ul className="space-y-2">
          {block.items.map((it, i) => {
            if (block.ordered && it.level === 0) n += 1;
            return (
              <li key={i} className="flex items-start gap-2.5 text-xs text-[#334155] leading-relaxed" style={{ marginLeft: it.level * 18 }}>
                {block.ordered && it.level === 0 ? (
                  <span className="mt-px w-5 h-5 shrink-0 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold flex items-center justify-center">{n}</span>
                ) : (
                  <span className={`mt-[7px] shrink-0 rounded-full ${it.level ? 'w-1.5 h-1.5 border border-[#7C3AED]' : 'w-2 h-2 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]'}`} />
                )}
                <span className="flex-1"><Inline text={it.text} /></span>
              </li>
            );
          })}
        </ul>
      );
    }

    case 'quote': {
      const isTip = /tip|note|remember|important/i.test(block.text.slice(0, 40));
      return (
        <div className={`flex items-start gap-2.5 rounded-xl p-3 border text-xs leading-relaxed ${isTip ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-[#F5F3FF] border-[#DDD6FE] text-[#1E1B4B]'}`}>
          <Lightbulb className={`w-4 h-4 shrink-0 mt-0.5 ${isTip ? 'text-amber-500' : 'text-[#7C3AED]'}`} />
          <div><Inline text={block.text.replace(/^💡\s*/, '')} /></div>
        </div>
      );
    }

    case 'table':
      return (
        <div className="overflow-x-auto rounded-xl border border-[#DDD6FE]">
          <table className="w-full text-xs">
            <thead className="bg-[#F5F3FF] text-[#6D28D9]">
              <tr>{block.header.map((h, i) => <th key={i} className="text-left font-bold px-3 py-2 whitespace-nowrap"><Inline text={h} /></th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((r, ri) => (
                <tr key={ri} className="border-t border-[#EDE9FE] even:bg-[#FBFAFF]">
                  {r.map((c, ci) => <td key={ci} className="px-3 py-2 text-[#334155] align-top"><Inline text={c} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'code':
      return <CodeBlock text={block.text} lang={block.lang} />;

    case 'hr':
      return <hr className="border-[#DDD6FE]" />;

    default:
      return null;
  }
};

// Renders an AI answer as a structured, easy-to-scan card layout.
const MarkdownMessage = ({ text }) => {
  const blocks = parseBlocks(text);
  return (
    <div className="space-y-3">
      {blocks.map((b, i) => <Block key={i} block={b} isFirst={i === 0} />)}
    </div>
  );
};

export default MarkdownMessage;
