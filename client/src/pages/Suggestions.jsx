import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Suggestions = () => {
  const { user } = useContext(AuthContext);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null); // track sending request

  // Fetch recommendations from backend
  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/suggestions', {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      alert("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };

  // Send friend request
  const handleSendRequest = async (toUserId) => {
    try {
      setSendingId(toUserId);
      await axios.post('http://localhost:5000/api/friends/send', { toUserId }, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      alert("Friend request sent!");
      fetchSuggestions(); // refresh list
    } catch (err) {
      console.error("Error sending request:", err);
      alert("Failed to send friend request");
    } finally {
      setSendingId(null);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="suggestions-wrapper">
      <h2>Friend Suggestions</h2>

      {loading ? (
        <p className="loading-text">Loading suggestions...</p>
      ) : suggestions.length === 0 ? (
        <p className="empty-text">No suggestions available right now.</p>
      ) : (
        <div className="suggestion-list">
          {suggestions.map((suggestion) => (
            <div key={suggestion.user.id} className="suggestion-card">
              <div className="info">
                <h4>{suggestion.user.name}</h4>
                <p><strong>Email:</strong> {suggestion.user.email}</p>
                <p><strong>Common Interests:</strong> {suggestion.commonInterests.join(', ') || 'None'}</p>
                <p><strong>Mutual Friends:</strong> {suggestion.mutualFriendsCount}</p>
              </div>
              <button
                onClick={() => handleSendRequest(suggestion.user.id)}
                disabled={sendingId === suggestion.user.id}
              >
                {sendingId === suggestion.user.id ? 'Sending...' : 'Send Friend Request'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suggestions;
