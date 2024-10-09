import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMap } from '../contexts/MapContext';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Bookmark, MessageSquare } from 'lucide-react';

const MapDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { maps, likeMap, unlikeMap, saveMap, unsaveMap, addComment } = useMap();
  const { user } = useAuth();
  const [comment, setComment] = useState('');

  const map = maps.find(m => m.id === id);

  if (!map) {
    return <div>Map not found</div>;
  }

  const handleLike = () => {
    if (user) {
      likeMap(map.id, user.id);
    }
  };

  const handleUnlike = () => {
    if (user) {
      unlikeMap(map.id, user.id);
    }
  };

  const handleSave = () => {
    if (user) {
      saveMap(map.id, user.id);
    }
  };

  const handleUnsave = () => {
    if (user) {
      unsaveMap(map.id, user.id);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && comment.trim()) {
      addComment(map.id, user.id, user.username, comment.trim());
      setComment('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <img src={map.imageUrl} alt={map.name} className="w-full h-64 object-cover rounded-lg mb-6" />
      <h1 className="text-3xl font-bold mb-4">{map.name}</h1>
      <p className="text-gray-600 mb-4">{map.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {map.tags.map(tag => (
          <span key={tag} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 text-red-500 hover:text-red-600"
          >
            <Heart size={20} />
            <span>{map.likes}</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-600"
          >
            <Bookmark size={20} />
            <span>Save</span>
          </button>
        </div>
        <Link to={`/profile/${map.uploadedBy}`} className="text-blue-500 hover:underline">
          Uploaded by {map.uploadedBy}
        </Link>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Map Code</h2>
        <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">{map.code}</pre>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded-lg resize-none"
              rows={3}
              placeholder="Add a comment..."
            ></textarea>
            <button
              type="submit"
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <p className="mb-6 text-gray-600">
            <Link to="/login" className="text-blue-500 hover:underline">Log in</Link> to post a comment.
          </p>
        )}
        {map.comments.length > 0 ? (
          map.comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <Link to={`/profile/${comment.username}`} className="font-semibold text-blue-500 hover:underline">
                  {comment.username}
                </Link>
                <span className="text-gray-500 text-sm">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default MapDetails;