import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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
    alert('Summary copied to clipboard!');
  };

  const appStyle = {
    backgroundColor: darkMode ? '#121212' : '#f9f9f9',
    color: darkMode ? '#ffffff' : '#121212',
    minHeight: '100vh',
    padding: '50px',
    fontFamily: 'Arial, sans-serif',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    padding: '10px',
    width: '300px',
    marginRight: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    background: darkMode ? '#1e1e1e' : '#fff',
    color: darkMode ? '#fff' : '#000'
  };

  const buttonStyle = {
    padding: '10px 16px',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  };

  return (
    <div style={appStyle}>
      <div style={{ textAlign: 'center' }}>
        <h1>YouTube Video Summarizer</h1>

        <label style={{ display: 'block', marginBottom: '20px' }}>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />{' '}
          Dark Mode
        </label>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube video URL"
          style={inputStyle}
        />
        <button onClick={handleSummarize} style={buttonStyle}>
          Summarize
        </button>

        {loading && <p style={{ marginTop: '20px' }}>⏳ Summarizing...</p>}

        <AnimatePresence>
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ color: 'red', marginTop: '20px' }}
            >
              {error}
            </motion.p>
          )}

          {summary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                marginTop: '30px',
                backgroundColor: darkMode ? '#1e1e1e' : '#fff',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              <h3>📄 Summary:</h3>
              <p>{summary}</p>
              <button onClick={handleCopy} style={{ ...buttonStyle, marginTop: '10px' }}>
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
