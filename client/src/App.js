// client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Requests from './pages/Requests';
import Suggestions from './pages/Suggestions';
import UpdateProfile from './pages/UpdateProfile';
import Chat from './pages/Chat';
import FriendsList from './pages/FriendsList'; 
import ViewProfile from './pages/ViewProfile';
import Navbar from './components/Navbar';
import './style.css';

// Handles routing and conditional layout (like Navbar visibility)
const AppContent = () => {
  const location = useLocation();
  const hideNavbar = ['/login', '/register', '/'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/friends" element={<FriendsList />} />
        <Route path="/chat/:friendId" element={<Chat />} />
        <Route path="/profile/:userId" element={<ViewProfile />} />
      </Routes>
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
