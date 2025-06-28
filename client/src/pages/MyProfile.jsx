import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // Fetch the user's profile on mount
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/${user.id}`, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching your profile:', err);
      }
    };

    if (user?.id) fetchMyProfile();
  }, [user]);

  if (!profile) return <div>Loading your profile... Try refreshing.</div>;

  return (
    <div className="view-profile-container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Bio:</strong> {profile.bio}</p>
      <p><strong>Interests:</strong> {profile.interests.join(', ')}</p>
      <button onClick={() => navigate('/update-profile')}>Edit Profile</button>
    </div>
  );
};

export default MyProfile;
