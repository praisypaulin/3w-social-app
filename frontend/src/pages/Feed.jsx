import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import BottomNav from '../components/BottomNav';

const TABS = ['All Post', 'Most Liked', 'Most Commented'];

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('All Post');

  const fetchFeed = useCallback(async (pageNum, append = false) => {
    try {
      const { data } = await api.get(`/posts?page=${pageNum}&limit=10`);
      setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to load feed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(1);
  }, [fetchFeed]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(nextPage, true);
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (activeTab === 'Most Liked') return (b.likes?.length || 0) - (a.likes?.length || 0);
    if (activeTab === 'Most Commented') return (b.comments?.length || 0) - (a.comments?.length || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="app-shell">
      <div className="top-bar">
        <h1>Social</h1>
      </div>

      <div className="page-content">
        <CreatePost onPostCreated={handlePostCreated} />

        <div className="filter-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">Loading feed...</div>
        ) : sortedPosts.length === 0 ? (
          <div className="empty-state">
            <span className="emoji">📭</span>
            Nothing here yet, check back soon!
          </div>
        ) : (
          <>
            {sortedPosts.map((post) => (
              <PostCard key={post._id} post={post} onUpdate={handlePostUpdate} />
            ))}
            {page < totalPages && (
              <button className="load-more-btn" onClick={loadMore}>
                Load more
              </button>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
