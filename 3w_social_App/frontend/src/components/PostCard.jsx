import { useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

function timeAgo(dateStr) {
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liking, setLiking] = useState(false);

  const isLiked = post.likes?.some((like) => like.user === user?.id || like.username === user?.username);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const { data } = await api.put(`/posts/${post._id}/like`);
      onUpdate(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, { text: commentText.trim() });
      onUpdate(data);
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const initial = post.username?.[0]?.toUpperCase() || '?';

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="avatar">{initial}</div>
        <div className="who">
          <span className="username">{post.username}</span>
          <span className="timestamp">{timeAgo(post.createdAt)}</span>
        </div>
      </div>

      {post.text && <p className="post-text">{post.text}</p>}

      {post.imageUrl && (
        <img className="post-image" src={`${API_ORIGIN}${post.imageUrl}`} alt="Post attachment" />
      )}

      <div className="post-stats">
        <span>{post.likes?.length || 0} likes</span>
        <span>{post.comments?.length || 0} comments</span>
      </div>

      <div className="post-footer-actions">
        <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike} disabled={liking}>
          {isLiked ? '💙' : '🤍'} Like
        </button>
        <button className="action-btn" onClick={() => setShowComments((s) => !s)}>
          💬 Comment
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {post.comments?.map((c) => (
            <div className="comment-row" key={c._id}>
              <div className="comment-bubble">
                <span className="comment-username">{c.username}</span>
                {c.text}
              </div>
            </div>
          ))}

          <form className="comment-input-row" onSubmit={handleComment}>
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="comment-send-btn" type="submit" disabled={!commentText.trim() || submittingComment}>
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
