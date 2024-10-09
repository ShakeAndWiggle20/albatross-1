import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMap } from '../contexts/MapContext';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Heart, Bookmark } from 'lucide-react';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { maps, getUserLikedMaps, getUserSavedMaps } = useMap();
  const { user, changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');

  const isOwnProfile = user?.username === username;
  const userMaps = maps.filter(map => map.uploadedBy === username);
  const likedMaps = isOwnProfile ? getUserLikedMaps(user.id) : [];
  const savedMaps = isOwnProfile ? getUserSavedMaps(user.id) : [];

  const [activeTab, setActiveTab] = useState<'uploaded' | 'liked' | 'saved'>('uploaded');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword(oldPassword, newPassword);
      setPasswordChangeMessage('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      setPasswordChangeMessage('Failed to change password');
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{username}'s Profile</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin size={20} className="mr-2" />
          <span>{userMaps.length} maps uploaded</span>
        </div>
        {isOwnProfile && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                  Old Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Change Password
              </button>
            </form>
            {passwordChangeMessage && (
              <p className="mt-2 text-sm text-green-600">{passwordChangeMessage}</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex border-b mb-4">
          <button
            className={`mr-4 py-2 ${activeTab === 'uploaded' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('uploaded')}
          >
            Uploaded Maps
          </button>
          {isOwnProfile && (
            <><button
              className={`mr-4 py-2 ${activeTab === 'liked' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('liked')}
            >
              Liked Maps
            </button>
            <button
              className={`py-2 ${activeTab === 'saved' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              Saved Maps
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'uploaded' && userMaps.map(map => (
          <MapCard key={map.id} map={map} />
        ))}
        {isOwnProfile && activeTab === 'liked' && likedMaps.map(map => (
          <MapCard key={map.id} map={map} />
        ))}
        {isOwnProfile && activeTab === 'saved' && savedMaps.map(map => (
          <MapCard key={map.id} map={map} />
        ))}
      </div>
    </div>
  </div>
);
};

const MapCard: React.FC<{ map: any }> = ({ map }) => (
<div className="bg-white rounded-lg shadow-md overflow-hidden">
  <img src={map.imageUrl} alt={map.name} className="w-full h-48 object-cover" />
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-2">{map.name}</h2>
    <p className="text-gray-600 mb-2">{map.description.substring(0, 100)}...</p>
    <div className="flex flex-wrap gap-2 mb-2">
      {map.tags.map((tag: string) => (
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
        <Heart size={20} className="text-red-500" />
        <span>{map.likes}</span>
      </div>
    </div>
  </div>
</div>
);

export default Profile;