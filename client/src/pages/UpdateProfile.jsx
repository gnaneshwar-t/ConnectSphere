import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UpdateProfile = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch name and profile
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');

        const [resUser, resProfile] = await Promise.all([
          axios.get(`http://localhost:5000/api/user/${user.id}`, {
            headers: { Authorization: token }
          }),
          axios.get(`http://localhost:5000/api/profile/user/${user.id}`, {
            headers: { Authorization: token }
          })
        ]);

        setName(resUser.data.name || '');
        setBio(resProfile.data.bio || '');
        setInterests((resProfile.data.interests || []).join(', '));
      } catch (err) {
        console.error('Error fetching profile:', err);
        alert('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchProfileData();
  }, [user?.id]);

  // Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const formattedInterests = interests
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
        .map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase());

      await axios.post(
        'http://localhost:5000/api/profile/update',
        { bio, interests: formattedInterests },
        { headers: { Authorization: token } }
      );

      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Could not update profile.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">Update Your Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <label>Name</label>
        <input type="text" value={name} readOnly />

        <label>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="4"
          placeholder="Tell us something about yourself"
        />

        <label>Interests (comma separated)</label>
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="e.g. Coding, Football, Music"
        />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
