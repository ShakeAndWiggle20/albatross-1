import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MapDetails from './pages/MapDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import UploadMap from './pages/UploadMap';
import { AuthProvider } from './contexts/AuthContext';
import { MapProvider } from './contexts/MapContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MapProvider>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/map/:id" element={<MapDetails />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/upload" element={<UploadMap />} />
              </Routes>
            </main>
          </div>
        </MapProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;