// Tiny dependency-free Markdown parser used by the AI Advisor.
// parseBlocks(text) -> array of block objects; parseInline(text) -> array of inline tokens.

const isTableSep = (l) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l) && l.includes('-');
const splitRow = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());

export function parseBlocks(src = '') {
  const lines = String(src).replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // fenced code block
    const fence = line.match(/^\s*```\s*([\w+-]*)\s*$/);
    if (fence) {
      const code = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) { code.push(lines[i]); i++; }
      i++; // closing fence (or EOF while streaming)
      blocks.push({ type: 'code', lang: fence[1] || '', text: code.join('\n') });
      continue;
    }

    // heading
    const h = line.match(/^\s{0,3}(#{1,4})\s+(.*?)\s*#*\s*$/);
    if (h) { blocks.push({ type: 'heading', level: h[1].length, text: h[2] }); i++; continue; }

    // horizontal rule
    if (/^\s*([-*_])\s*(\1\s*){2,}$/.test(line)) { blocks.push({ type: 'hr' }); i++; continue; }

    // table
    if (line.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) { rows.push(splitRow(lines[i])); i++; }
      blocks.push({ type: 'table', header, rows });
      continue;
    }

    // blockquote
    if (/^\s*>/.test(line)) {
      const q = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) { q.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
      blocks.push({ type: 'quote', text: q.join('\n') });
      continue;
    }

    // lists (bullet or numbered, with simple indentation levels)
    if (/^\s*([-*•]|\d+[.)])\s+/.test(line)) {
      const items = [];
      let ordered = /^\s*\d+[.)]\s+/.test(line);
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)([-*•]|\d+[.)])\s+(.*)$/);
        if (m) {
          items.push({ level: Math.min(2, Math.floor(m[1].replace(/\t/g, '  ').length / 2)), text: m[3] });
          i++;
        } else if (lines[i].trim() && /^\s{2,}\S/.test(lines[i]) && items.length) {
          items[items.length - 1].text += ' ' + lines[i].trim(); // wrapped continuation
          i++;
        } else break;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    // paragraph (merge consecutive plain lines)
    const para = [line.trim()];
    i++;
    while (
      i < lines.length && lines[i].trim() &&
      !/^\s*(```|#{1,4}\s|>|([-*•]|\d+[.)])\s+)/.test(lines[i]) &&
      !(lines[i].includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1]))
    ) { para.push(lines[i].trim()); i++; }
    blocks.push({ type: 'paragraph', text: para.join(' ') });
  }

  return blocks;
}

// Inline: `code`, **bold**, *italic* / _italic_, [text](http-url)
export function parseInline(text = '') {
  const tokens = [];
  const re = /(`[^`\n]+`)|(\*\*[^*\n]+?\*\*)|(\[[^\]\n]+\]\((https?:\/\/[^\s)]+)\))|(\*[^*\s][^*\n]*?\*)|(\b_[^_\n]+_\b)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) tokens.push({ t: 'text', v: text.slice(last, m.index) });
    if (m[1]) tokens.push({ t: 'code', v: m[1].slice(1, -1) });
    else if (m[2]) tokens.push({ t: 'bold', v: m[2].slice(2, -2) });
    else if (m[3]) {
      const lm = m[3].match(/^\[([^\]]+)\]\((.+)\)$/);
      tokens.push({ t: 'link', v: lm[1], href: lm[2] });
    }
    else if (m[4]) tokens.push({ t: 'italic', v: m[4].slice(1, -1) });
    else if (m[5]) tokens.push({ t: 'italic', v: m[5].slice(1, -1) });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ t: 'text', v: text.slice(last) });
  return tokens;
}
