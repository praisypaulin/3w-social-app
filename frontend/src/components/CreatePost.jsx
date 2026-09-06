import { useState, useRef } from 'react';
import api from '../api/api';

export default function CreatePost({ onPostCreated }) {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef(null);

   const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setImageFile(file);

  const reader = new FileReader();
  reader.onload = () => setImagePreview(reader.result);
  reader.onerror = () => {
    console.error('Failed to read image file for preview');
    alert('Could not preview that image. Try a different file.');
  };
  reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!text.trim() && !imageFile) return;

    setPosting(true);
    try {
      const formData = new FormData();
      formData.append('text', text.trim());
      if (imageFile) formData.append('image', imageFile);

      // Don't set Content-Type manually — the browser needs to add its own
      // multipart boundary string, which only happens if we leave this out.
      const { data } = await api.post('/posts', formData);

      onPostCreated(data);
      setText('');
      removeImage();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not create post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const canPost = (text.trim() || imageFile) && !posting;

  return (
    <div className="create-post-card">
      <textarea
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={imagePreview ? 2 : 1}
      />

      {imagePreview && (
        <div className="image-preview-wrap">
          <img src={imagePreview} alt="Selected preview" />
          <button className="image-preview-remove" onClick={removeImage} aria-label="Remove image">
            ✕
          </button>
        </div>
      )}

      <div className="create-post-divider" />

      <div className="create-post-actions">
        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="post-image-input"
          />
          <label htmlFor="post-image-input" className="icon-btn" style={{ cursor: 'pointer' }}>
            📷
          </label>
        </div>

        <button className="post-submit-btn" onClick={handleSubmit} disabled={!canPost}>
          {posting ? 'Posting...' : 'Post'} ➤
        </button>
      </div>
    </div>
  );
}
