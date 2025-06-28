import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Requests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  // Fetch all pending friend requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/friends/requests', {
        headers: { Authorization: localStorage.getItem("token") }
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching friend requests:", err);
      alert("Error fetching friend requests");
    }
  };

  // Accept request
  const handleAccept = async (requestId) => {
    try {
      await axios.post(`http://localhost:5000/api/friends/accept/${requestId}`, {}, {
        headers: { Authorization: localStorage.getItem("token") }
      });
      alert("Friend request accepted!");
      fetchRequests(); // refresh list
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Error accepting request");
    }
  };

  // Reject request
  const handleReject = async (requestId) => {
    try {
      await axios.post(`http://localhost:5000/api/friends/reject/${requestId}`, {}, {
        headers: { Authorization: localStorage.getItem("token") }
      });
      alert("Friend request rejected!");
      fetchRequests(); // refresh list
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Error rejecting request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="requests-wrapper">
      <h2>Pending Friend Requests</h2>

      {requests.length === 0 ? (
        <p className="empty-text">No pending requests.</p>
      ) : (
        <div className="request-list">
          {requests.map((req) => (
            <div key={req._id} className="request-card">
              <div>
                <h4>{req.fromUser.name}</h4>
                <p>{req.fromUser.email}</p>
              </div>
              <div className="request-buttons">
                <button className="accept-btn" onClick={() => handleAccept(req._id)}>Accept</button>
                <button className="reject-btn" onClick={() => handleReject(req._id)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
