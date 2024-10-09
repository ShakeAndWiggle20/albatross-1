import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface MapCode {
  id: string;
  name: string;
  code: string;
  description: string;
  imageUrl: string;
  tags: string[];
  uploadedBy: string;
  likes: number;
  uploadDate: Date;
  comments: Comment[];
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
}

interface MapContextType {
  maps: MapCode[];
  addMap: (map: Omit<MapCode, 'id' | 'likes' | 'uploadDate' | 'comments'>) => void;
  likeMap: (mapId: string, userId: string) => void;
  unlikeMap: (mapId: string, userId: string) => void;
  addComment: (mapId: string, userId: string, username: string, content: string) => void;
  getUserLikedMaps: (userId: string) => MapCode[];
  getUserSavedMaps: (userId: string) => MapCode[];
  saveMap: (mapId: string, userId: string) => void;
  unsaveMap: (mapId: string, userId: string) => void;
  searchMaps: (query: string) => MapCode[];
  sortMaps: (criteria: 'likes' | 'date') => MapCode[];
  filterMapsByTags: (tags: string[]) => MapCode[];
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [maps, setMaps] = useState<MapCode[]>([]);
  const [userLikes, setUserLikes] = useState<Record<string, Set<string>>>({});
  const [userSaves, setUserSaves] = useState<Record<string, Set<string>>>({});

  useEffect(() => {
    // Load initial data from localStorage
    const storedMaps = localStorage.getItem('maps');
    if (storedMaps) {
      setMaps(JSON.parse(storedMaps));
    }
    const storedLikes = localStorage.getItem('userLikes');
    if (storedLikes) {
      setUserLikes(JSON.parse(storedLikes, (key, value) =>
        typeof value === 'object' && value !== null ? new Set(value) : value
      ));
    }
    const storedSaves = localStorage.getItem('userSaves');
    if (storedSaves) {
      setUserSaves(JSON.parse(storedSaves, (key, value) =>
        typeof value === 'object' && value !== null ? new Set(value) : value
      ));
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem('maps', JSON.stringify(maps));
    localStorage.setItem('userLikes', JSON.stringify(userLikes, (key, value) =>
      value instanceof Set ? Array.from(value) : value
    ));
    localStorage.setItem('userSaves', JSON.stringify(userSaves, (key, value) =>
      value instanceof Set ? Array.from(value) : value
    ));
  }, [maps, userLikes, userSaves]);

  const addMap = (map: Omit<MapCode, 'id' | 'likes' | 'uploadDate' | 'comments'>) => {
    const newMap: MapCode = {
      ...map,
      id: uuidv4(),
      likes: 0,
      uploadDate: new Date(),
      comments: [],
    };
    setMaps(prevMaps => [...prevMaps, newMap]);
  };

  const likeMap = (mapId: string, userId: string) => {
    setMaps(prevMaps =>
      prevMaps.map(map =>
        map.id === mapId ? { ...map, likes: map.likes + 1 } : map
      )
    );
    setUserLikes(prevLikes => ({
      ...prevLikes,
      [userId]: new Set([...(prevLikes[userId] || []), mapId]),
    }));
  };

  const unlikeMap = (mapId: string, userId: string) => {
    setMaps(prevMaps =>
      prevMaps.map(map =>
        map.id === mapId ? { ...map, likes: Math.max(0, map.likes - 1) } : map
      )
    );
    setUserLikes(prevLikes => {
      const userSet = new Set(prevLikes[userId]);
      userSet.delete(mapId);
      return { ...prevLikes, [userId]: userSet };
    });
  };

  const addComment = (mapId: string, userId: string, username: string, content: string) => {
    const newComment: Comment = {
      id: uuidv4(),
      userId,
      username,
      content,
      createdAt: new Date(),
    };
    setMaps(prevMaps =>
      prevMaps.map(map =>
        map.id === mapId
          ? { ...map, comments: [...map.comments, newComment] }
          : map
      )
    );
  };

  const getUserLikedMaps = (userId: string) => {
    const userLikedMapIds = userLikes[userId] || new Set();
    return maps.filter(map => userLikedMapIds.has(map.id));
  };

  const getUserSavedMaps = (userId: string) => {
    const userSavedMapIds = userSaves[userId] || new Set();
    return maps.filter(map => userSavedMapIds.has(map.id));
  };

  const saveMap = (mapId: string, userId: string) => {
    setUserSaves(prevSaves => ({
      ...prevSaves,
      [userId]: new Set([...(prevSaves[userId] || []), mapId]),
    }));
  };

  const unsaveMap = (mapId: string, userId: string) => {
    setUserSaves(prevSaves => {
      const userSet = new Set(prevSaves[userId]);
      userSet.delete(mapId);
      return { ...prevSaves, [userId]: userSet };
    });
  };

  const searchMaps = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return maps.filter(map =>
      map.name.toLowerCase().includes(lowercaseQuery) ||
      map.description.toLowerCase().includes(lowercaseQuery) ||
      map.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const sortMaps = (criteria: 'likes' | 'date') => {
    return [...maps].sort((a, b) =>
      criteria === 'likes'
        ? b.likes - a.likes
        : b.uploadDate.getTime() - a.uploadDate.getTime()
    );
  };

  const filterMapsByTags = (tags: string[]) => {
    return maps.filter(map =>
      tags.every(tag => map.tags.includes(tag))
    );
  };

  return (
    <MapContext.Provider
      value={{
        maps,
        addMap,
        likeMap,
        unlikeMap,
        addComment,
        getUserLikedMaps,
        getUserSavedMaps,
        saveMap,
        unsaveMap,
        searchMaps,
        sortMaps,
        filterMapsByTags,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};