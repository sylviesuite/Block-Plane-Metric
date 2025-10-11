import { useState } from 'react';
import { faqProvider } from '../lib/faqProvider';

export default function AssistantPanel() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      text: `Hi! I'm the BlockPlane FAQ assistant. I can answer questions about LIS, Paris Alignment, Benchmark 2000, and more. Ask me anything!` 
    }
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (!input.trim() || busy) return;
    const q = input.trim();
    setMessages(m => [...m, { role: 'user', text: q }]);
    setInput('');
    setBusy(true);
    try {
      const res = await faqProvider.ask(q);
      const answerText = res.answer + (res.source ? `\n\n📚 Source: "${res.source}"` : '');
      setMessages(m => [...m, { role: 'assistant', text: answerText }]);
    } catch (e) {
      setMessages(m => [...m, { 
        role: 'assistant', 
        text: 'Error: ' + (e?.message || 'unknown error occurred') 
      }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto border rounded-2xl p-4 shadow-lg bg-white">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <div className="text-sm font-semibold text-gray-700">
          AI Assistant (Beta) — FAQ Provider
        </div>
      </div>
      
      <div className="h-96 overflow-auto border rounded-lg p-4 bg-gray-50 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right mb-3' : 'text-left mb-3'}>
            <div className={
              (m.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-800 border border-gray-200'
              ) +
              ' inline-block px-4 py-3 rounded-2xl max-w-[85%] text-sm shadow-sm whitespace-pre-wrap'
            }>
              {m.text}
            </div>
          </div>
        ))}
        {busy && (
          <div className="text-left mb-3">
            <div className="inline-block bg-white border border-gray-200 px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask about LIS, Benchmark 2000, Paris %…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send(); }}
          disabled={busy}
        />
        <button 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          onClick={send} 
          disabled={busy || !input.trim()}
        >
          {busy ? '...' : 'Ask'}
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mt-3 text-center">
        Local FAQ only. Answers are based on built-in documentation. Full AI coming soon.
      </p>
    </div>
  );
}
