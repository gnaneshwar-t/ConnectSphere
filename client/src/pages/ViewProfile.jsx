import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../style.css'; 

const ViewProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/user/${userId}`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile) return <div className="view-profile-container">Loading profile...</div>;

  return (
    <div className="view-profile-container">
      <h2>{profile.name}'s Profile</h2>
      <p>Email: {profile.email}</p>
      <p>Bio: {profile.bio}</p>
      <p>Interests: {profile.interests.join(', ')}</p>
    </div>
  );
};

export default ViewProfile;
