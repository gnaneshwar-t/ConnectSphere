import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FriendList = () => {
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/friends/myfriends', {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setFriends(res.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
        alert("Error fetching friends");
      }
    };

    fetchFriends();
  }, []);

  const openChat = (friendId) => {
    navigate(`/chat/${friendId}`);
  };

  const viewProfile = (friendId) => {
    navigate(`/profile/${friendId}`);
  };

  return (
    <div className="friends-wrapper">
      <h2>Your Friends</h2>
      {friends.length === 0 ? (
        <p className="empty-text">No friends yet.</p>
      ) : (
        <div className="friend-list">
          {friends.map(friend => (
            <div key={friend._id} className="friend-card">
              <div>
                <h4>{friend.name}</h4>
                <p>{friend.email}</p>
              </div>
              <div>
                <button className="chat-btn" onClick={() => openChat(friend._id)}>Chat</button>
                <button className="view-btn" onClick={() => viewProfile(friend._id)}>View Profile</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendList;
