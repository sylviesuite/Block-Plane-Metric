function tokenize(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function score(query, text) {
  const q = tokenize(query);
  const t = tokenize(text);
  const tf = new Map();
  for (const w of t) tf.set(w, (tf.get(w) || 0) + 1);
  let sum = 0;
  for (const w of q) sum += (tf.get(w) || 0);
  return sum / (t.length || 1);
}

async function loadFAQ() {
  const res = await fetch('/data/faq.json');
  if (!res.ok) throw new Error('Failed to load FAQ JSON');
  return await res.json();
}

export const faqProvider = {
  name: 'faq',
  async ask(query) {
    const data = await loadFAQ();
    let best = { idx: -1, score: 0 };
    data.faqs.forEach((item, i) => {
      const s = Math.max(
        score(query, item.q),
        score(query, item.a),
        item.tags ? score(query, item.tags.join(' ')) : 0
      );
      if (s > best.score) best = { idx: i, score: s };
    });
    if (best.idx === -1) {
      return { 
        answer: "I couldn't find an exact match in the local FAQ. Try rephrasing or asking about LIS, Paris Alignment, Benchmark 2000, data sources, or maintenance cycles.", 
        confidence: 0.0 
      };
    }
    const hit = data.faqs[best.idx];
    return { 
      answer: hit.a, 
      source: hit.q, 
      confidence: Number(best.score.toFixed(3)) 
    };
  },
};
