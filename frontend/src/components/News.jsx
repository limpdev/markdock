import React, { useState, useEffect } from 'react';
import './News.css';
import { FetchNews, GetCachedNewsAge } from '../../wailsjs/go/main/App';

function News({ theme }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cacheAge, setCacheAge] = useState(-1);

  useEffect(() => {
    // Only fetch news once when component mounts to avoid excessive API calls
    fetchNews();
  }, []); // Empty dependency array - only runs once

  const fetchNews = async () => {
    try {
      setLoading(true);

      // Call the Go backend which handles caching and API key security
      const response = await FetchNews();
      const data = JSON.parse(response);

      setNews(data.news || []);
      setError(null);

      // Get cache age
      const age = await GetCachedNewsAge();
      setCacheAge(age);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.toString() || 'Failed to load news. Please configure your Currents API key.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className={`news-container ${theme === 'dark' ? 'news-dark' : 'news-light'}`}>
        <div className="loading-state">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`news-container ${theme === 'dark' ? 'news-dark' : 'news-light'}`}>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchNews} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`news-container ${theme === 'dark' ? 'news-dark' : 'news-light'}`}>
      <div className="news-header">
        <h2>Financial News</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="news-count">{news.length} articles</span>
          {cacheAge >= 0 && (
            <span className="cache-indicator" title="Data cached to minimize API calls">
              {cacheAge === 0 ? 'Just updated' : `Updated ${cacheAge}m ago`}
            </span>
          )}
        </div>
      </div>

      <div className="news-grid">
        {news.map((article, index) => (
          <div key={index} className="news-card">
            {article.image && (
              <div className="news-image">
                <img
                  src={article.image}
                  alt={article.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="news-content">
              <div className="news-meta">
                <span className="news-source">{article.author || 'Unknown'}</span>
                <span className="news-divider">•</span>
                <span className="news-time">{formatTimeAgo(article.published)}</span>
              </div>

              <h3 className="news-title">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {article.title}
                </a>
              </h3>

              {article.description && (
                <p className="news-description">{article.description}</p>
              )}

              {article.category && article.category.length > 0 && (
                <div className="news-categories">
                  {article.category.slice(0, 3).map((cat, idx) => (
                    <span key={idx} className="news-category">{cat}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;