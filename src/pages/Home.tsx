import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMap } from '../contexts/MapContext';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Bookmark, Filter } from 'lucide-react';

const Home: React.FC = () => {
  const { maps, likeMap, unlikeMap, saveMap, unsaveMap, sortMaps, filterMapsByTags } = useMap();
  const { user } = useAuth();
  const [sortCriteria, setSortCriteria] = useState<'likes' | 'date'>('date');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleLike = (mapId: string) => {
    if (user) {
      likeMap(mapId, user.id);
    }
  };

  const handleUnlike = (mapId: string) => {
    if (user) {
      unlikeMap(mapId, user.id);
    }
  };

  const handleSave = (mapId: string) => {
    if (user) {
      saveMap(mapId, user.id);
    }
  };

  const handleUnsave = (mapId: string) => {
    if (user) {
      unsaveMap(mapId, user.id);
    }
  };

  const handleSort = (criteria: 'likes' | 'date') => {
    setSortCriteria(criteria);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const sortedAndFilteredMaps = filterMapsByTags(selectedTags).sort((a, b) =>
    sortCriteria === 'likes'
      ? b.likes - a.likes
      : b.uploadDate.getTime() - a.uploadDate.getTime()
  );

  const allTags = Array.from(new Set(maps.flatMap(map => map.tags)));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Discover Map Codes</h1>
      <div className="mb-4 flex items-center space-x-4">
        <button
          onClick={() => handleSort('date')}
          className={`px-3 py-1 rounded ${
            sortCriteria === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => handleSort('likes')}
          className={`px-3 py-1 rounded ${
            sortCriteria === 'likes' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Most Liked
        </button>
        <div className="relative">
          <button
            className="px-3 py-1 rounded bg-gray-200 flex items-center"
            onClick={() => document.getElementById('tagFilter')?.classList.toggle('hidden')}
          >
            <Filter size={18} className="mr-1" />
            Filter Tags
          </button>
          <div id="tagFilter" className="absolute z-10 mt-2 p-2 bg-white shadow-lg rounded hidden">
            {allTags.map(tag => (
              <label key={tag} className="block">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagFilter(tag)}
                  className="mr-2"
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAndFilteredMaps.map(map => (
          <div key={map.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={map.imageUrl} alt={map.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{map.name}</h2>
              <p className="text-gray-600 mb-2">{map.description.substring(0, 100)}...</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {map.tags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                <Link to={`/map/${map.id}`} className="text-blue-500 hover:underline">
                  View Details
                </Link>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLike(map.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Heart size={20} />
                  </button>
                  <span>{map.likes}</span>
                  <button
                    onClick={() => handleSave(map.id)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <Bookmark size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;