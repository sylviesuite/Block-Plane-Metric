import { useState } from 'react';
import './App.css';
import MaterialLibrary from './components/MaterialLibrary';
import AssistantPanel from './components/AssistantPanel';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold" style={{color: '#FFD700'}}>
                🌍 BlockPlane Metric
              </h1>
              <p className="text-emerald-100 mt-1">Free Construction Carbon Calculator</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500 px-3 py-1 rounded-full text-xs font-semibold">
                Paris Agreement Aligned
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'calculator'
                  ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              🧮 Calculator
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'library'
                  ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📚 Material Library
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === 'assistant'
                  ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              💬 AI Assistant
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'calculator' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6">Carbon Calculator</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
              <p className="text-lg text-gray-700">
                <strong>Calculator Integration Coming Soon</strong>
              </p>
              <p className="text-gray-600 mt-2">
                The full BlockPlane Metric calculator will be integrated here. 
                For now, explore the Material Library and AI Assistant tabs to see the new features!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'library' && <MaterialLibrary />}

        {activeTab === 'assistant' && (
          <div className="py-8">
            <AssistantPanel />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">© 2025 BlockPlane. All rights reserved.</p>
              <p className="text-xs text-gray-400 mt-1">
                Free Construction Carbon Calculator
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
