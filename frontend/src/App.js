import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

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
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="toggle">
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          Dark Mode
        </label>
      </div>

      <div className="container">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="title"
        >
          🎥 SmartClip AI
          <div className="subtitle">YouTube Video Summarizer</div>
        </motion.h1>

        <div className="card">
          <div className="input-group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube video link..."
            />
            <button onClick={handleSummarize}>Summarize</button>
          </div>

          {loading && <p className="loading">⏳ Summarizing...</p>}

          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="error-message"
              >
                {error.includes("Transcript not available") ? (
                  <>❌ Sorry, this video doesn't have a transcript. Please try another one.</>
                ) : (
                  <>{error}</>
                )}
              </motion.div>
            )}

            {summary && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="summary-box"
              >
                <h2>📝 Summary:</h2>
                <div className="summary-text">{summary}</div>
                <button onClick={handleCopy}>📋 Copy Summary</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      
    </div>
  );
}

export default App;
