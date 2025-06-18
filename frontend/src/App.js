import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css'; 

function App() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleSummarize = async () => {
    if (!url.trim()) {
      setError('Please enter a YouTube URL.');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      const response = await axios.post('http://localhost:5000/summarize', { url });
      if (response.data.summary) {
        setSummary(response.data.summary);
      } else {
        setError('No summary received.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    alert('📋 Summary copied to clipboard!');
  };

  const appTheme = darkMode ? 'dark' : 'light';

  return (
    <div className={`${appTheme} min-h-screen transition-all duration-300 bg-gray-900 text-white p-6`}>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center"
        >
          🎥 SmartClip AI – YouTube Summarizer
        </motion.h1>

        <div className="flex justify-center items-center gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube video link..."
            className="flex-1 p-3 rounded-md text-black"
          />
          <button
            onClick={handleSummarize}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md text-white transition"
          >
            Summarize
          </button>
        </div>

        <div className="flex justify-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="text-sm">Dark Mode</span>
          </label>
        </div>

        {loading && (
          <p className="text-center animate-pulse text-blue-400">⏳ Summarizing...</p>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-center"
            >
              {error}
            </motion.div>
          )}

          {summary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 p-5 rounded-lg shadow-lg space-y-4"
            >
              <h2 className="text-xl font-semibold">📝 Summary:</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed">{summary}</div>
              <button
                onClick={handleCopy}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                📋 Copy Summary
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
