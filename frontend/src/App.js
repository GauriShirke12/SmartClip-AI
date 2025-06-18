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

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen transition-all duration-500`}>
      <div className="flex justify-end p-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="accent-blue-600"
          />
          <span className="text-sm">Dark Mode</span>
        </label>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold mb-6 text-center"
        >
          🎥 SmartClip AI
          <br />
          <span className="text-xl font-medium">YouTube Video Summarizer</span>
        </motion.h1>

        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-xl shadow-xl">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube video link..."
              className="flex-1 p-3 rounded-lg text-black focus:outline-none"
            />
            <button
              onClick={handleSummarize}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white transition"
            >
              Summarize
            </button>
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
                className="text-red-400 text-sm text-center"
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
                className="bg-gray-700 p-5 mt-4 rounded-lg shadow-md space-y-4"
              >
                <h2 className="text-lg font-semibold">📝 Summary:</h2>
                <div className="whitespace-pre-line text-sm">{summary}</div>
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
    </div>
  );
}

export default App;
