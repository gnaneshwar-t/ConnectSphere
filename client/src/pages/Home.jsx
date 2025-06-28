import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h2 className="home-heading">ConnectSphere {user?.name}</h2>

      <div className="nav-links">
        <Link to="/update-profile">My Profile</Link>
        <Link to="/friends">Friends</Link>
        <Link to="/suggestions">Suggestions</Link>
        <Link to="/requests">Requests</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Home;
