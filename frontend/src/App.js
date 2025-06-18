import React, { useState } from 'react';
import axios from 'axios';
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
    <div className={`app-container ${darkMode ? '' : 'light-mode'}`}>
      <div className="dark-mode-toggle">
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          {' '}Dark Mode
        </label>
      </div>

      <div className="header">
        <h1>🎥 SmartClip AI</h1>
        <p>YouTube Video Summarizer</p>
      </div>

      <div className="input-container">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube video link..."
        />
        <button onClick={handleSummarize}>Summarize</button>
      </div>

      {loading && <p style={{ textAlign: 'center' }}>⏳ Summarizing...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

      {summary && (
        <div className={`card ${darkMode ? '' : 'light'}`}>
          <h3>📝 Summary:</h3>
          <div className="summary">{summary}</div>
          <button onClick={handleCopy} style={{ marginTop: '10px' }}>
            📋 Copy Summary
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
